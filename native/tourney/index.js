// Don't Slice Me! Keukentoernooi: the small server behind the weekly ladders.
// One HTTPS Cloud Function ("tourney"): tournament actions, player profiles and friends. v0.32 duels per hour, ghosts and friend requests (review fixes) (see README). Firestore as storage, anonymous
// Firebase Auth for identity.
// The game keeps working without it (simulated division); with it, divisions of 50 real players, a weekly close with
// prizes, and plausibility checks on every score. Deploy: see README.md in this folder.
const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const EVENTS = ['sapstorm', 'nacht', 'estafette', 'jacht'];
const DIVISIONS = ['hout', 'koper', 'zilver', 'goud', 'diamant'];
const DIV_SIZE = 50;
// plausibility: the most a round can score per second of play, per event (generous, catches only forged numbers)
const MAX_PER_SEC = { sapstorm: 12, nacht: 3, estafette: 10, jacht: 2 };
// Friends: every player has a short code; opening an invite link (or typing the code) makes two players friends at once.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', MAX_FRIENDS = 50, FRIEND_SAP = 300, MAX_INVITE_REWARDS = 10;
// Duels (v0.29): one seeded knife sequence a day; a player is paired with a finished entry of a similar level and sees
// its ghost. Friend challenges are settled when both have played that day's duel. Rivals: two players just above you.
const TIP_SAP = 100, APPLIANCES = ['plank', 'oven', 'koelkast', 'vitrine'];
const kitchenOf = k => { if (!k || typeof k !== 'object') return null; const lv = {}; for (const a of APPLIANCES) lv[a] = clampInt(k.lv && k.lv[a], 0, 5); return { lv, tier: clampInt(k.tier, 0, 3), fruit: String(k.fruit || 'appel').slice(0, 24), hat: String(k.hat || 'none').slice(0, 24), tips: clampInt(k.tips, 0, 1e6), score: clampInt(k.score, 0, 1e6) }; };
const DUEL_MAX_PER_SEC = 15, CHALLENGE_SAP = 200, LOSER_HAT = 'pannetje', GHOST_MAX = 2400, DAY_RX = /^\d{4}-\d{2}-\d{2}$/;
const bandOf = level => Math.floor(Math.max(1, Number(level) || 1) / 15);
// v0.32 duels per hour, ghosts and friend requests. hello tells a client what this server can do. A ghost is one finished duel
// with its own seed; a player keeps GHOST_KEEP of them in fixed slots (ghosts/{hash}_{k}, no uid in the id), a random opponent
// comes from the last two days of the same level band (then the bands next to it), never yourself and never a seed you already
// played; the reply has no uid. At most DUEL_PER_HOUR duels an hour per player (+1 for clock skew), the window anchored at
// the duel's start like the client. Friend duels v2: the challenger's seed and ghost go into challenges/{a_b}; the first
// duelfind of the friend starts it (status playing, no replays), the friend's score settles it, and a started duel whose
// score never comes counts as 0 after CHALLENGE_PLAY_MS. Only friends whose client knows v2 (profile cv) can be challenged.
// Friends by name: profiles that a new client marked findable carry nameKey; findplayer answers with name, level, fruit
// and a tag only (no uid, no code), rate limited per player and per address; friendreq / friendans make a request the
// other player accepts; a repeated request sends no new note, a refused one waits a week, requests expire after two weeks.
// FRIEND_SAP is paid once per pair.
const crypto = require('crypto');
const SAVE_HISTORY_DAYS = 7; // v0.32.2: one copy of the save per day, the last 7 days (saves/{uid}/history/{YYYY-MM-DD})
const SERVER_V = 32, CLIENT_V = 32, CAPS = ['find', 'request', 'duel2'], DUEL_PER_HOUR = 5, HOUR_MS = 3600000, GHOST_KEEP = 20, GHOST_DAYS = 3, GHOST_RECENT_MS = 48 * HOUR_MS;
const CHALLENGE_MS = 24 * HOUR_MS, CHALLENGE_GRACE_MS = 20000, CHALLENGE_PLAY_MS = 3 * 60000, DUEL_T_MAX = 95000;
const FIND_MAX = 20, FIND_IP_MAX = 60, FIND_WINDOW_MS = 10 * 60000, REQ_IN_MAX = 20, REQ_OUT_DAY = 20, REQ_TTL_MS = 14 * 86400000, REFUSED_MS = 7 * 86400000, MAX_JOIN_REWARDS = 10, SEED_RX = /^[A-Za-z0-9.\-]{4,40}$/;
const ghostBand = level => Math.floor(Math.max(1, Number(level) || 1) / 10);
const nameKeyOf = v => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
const cleanRef = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
const playerName = v => String(v || 'Fruit').replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16) || 'Fruit';
const ghostView = (id, g) => ({ id, seed: String(g.seed || ''), name: String(g.name || 'Fruit').slice(0, 16), fruit: String(g.fruit || 'appel').slice(0, 24), level: g.level || 1, score: g.score || 0, t: g.t || 0, ghost: g.ghost || '' });
const reqView = p => ({ ref: String(p.ref || ''), name: String(p.name || 'Fruit').slice(0, 16), level: p.level || 1, fruit: String(p.fruit || 'appel').slice(0, 24), tag: p.ref ? '#' + String(p.ref).slice(0, 3) : '' });
const hashOf = (salt, v) => crypto.createHash('sha256').update(salt + ':' + v).digest('hex');
const ghostKey = uid => hashOf('ghost', uid).slice(0, 20); // a ghost id never shows the uid
const dayNow = () => new Date(Date.now() - 7 * 3600000).toISOString().slice(0, 10); // the game's day starts at 07:00
const reqFresh = d => (((d.data && d.data()) || {}).at || 0) > Date.now() - REQ_TTL_MS; // a friend request older than two weeks no longer counts
const clientIp = req => { const xff = String((req.get && req.get('x-forwarded-for')) || '').split(',').map(s => s.trim()).filter(Boolean); return xff.length ? xff[xff.length - 1] : String(req.ip || ''); }; // Google's front end appends the real address last
async function rateOk(key, max, windowMs) { // a fixed window per key in limits/{key}
  const ref = db.doc(`limits/${key}`);
  return db.runTransaction(async tx => { const d = (await tx.get(ref)).data() || {}, now = Date.now(); let start = d.start || 0, n = d.n || 0; if (!(now >= start && now - start < windowMs)) { start = now; n = 0; } if (n >= max) return false; tx.set(ref, { start, n: n + 1 }); return true; });
}
async function ensureRef(uid) { // a public handle for name search and requests; never the friend code, which befriends at once
  const pref = db.doc(`profiles/${uid}`), cur = (await pref.get()).data() || {}; if (cur.ref) return cur.ref;
  for (let i = 0; i < 6; i++) { const r = Array.from({ length: 10 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join(''); const taken = await db.collection('profiles').where('ref', '==', r).limit(1).get(); if (taken.empty) { await pref.set({ ref: r }, { merge: true }); return r; } }
  return '';
}
async function byRef(ref) { const r = cleanRef(ref); if (r.length !== 10) return null; const snap = await db.collection('profiles').where('ref', '==', r).limit(1).get(); return snap.empty ? null : snap.docs[0]; }
async function makeFriends(uid, other, mp, op) { // both ways; FRIEND_SAP once per pair, at most MAX_INVITE_REWARDS (other) and MAX_JOIN_REWARDS (uid) times
  const pairRef = db.doc(`pairs/${[uid, other].sort().join('_')}`), paid = (await pairRef.get()).exists, now = admin.firestore.FieldValue.serverTimestamp(), batch = db.batch();
  const otherOk = !paid && (op.inviteRewards || 0) < MAX_INVITE_REWARDS, meOk = !paid && (mp.joinRewards || 0) < MAX_JOIN_REWARDS;
  batch.set(db.doc(`friends/${uid}/of/${other}`), { since: now }); batch.set(db.doc(`friends/${other}/of/${uid}`), { since: now });
  if (otherOk) batch.set(db.doc(`profiles/${other}`), { inviteRewards: admin.firestore.FieldValue.increment(1), pending: admin.firestore.FieldValue.arrayUnion({ from: String(mp.name || 'Een vriend').slice(0, 16), sap: FRIEND_SAP }) }, { merge: true });
  if (meOk) batch.set(db.doc(`profiles/${uid}`), { joinRewards: admin.firestore.FieldValue.increment(1) }, { merge: true });
  if (!paid) batch.set(pairRef, { at: Date.now() });
  for (const p of [`requests/${uid}/in/${other}`, `requests/${other}/out/${uid}`, `requests/${other}/in/${uid}`, `requests/${uid}/out/${other}`]) batch.delete(db.doc(p));
  await batch.commit(); return { friend: profileView(other, op), reward: meOk ? FRIEND_SAP : 0 };
}
async function freshRequests(uid) { // the requests that wait for uid; stale ones (older than REQ_TTL_MS) are deleted on the way
  const snap = await db.collection(`requests/${uid}/in`).limit(REQ_IN_MAX * 2).get(), keep = [], old = [];
  for (const d of snap.docs) (reqFresh(d) ? keep : old).push(d);
  if (old.length) { const b = db.batch(); for (const d of old) { b.delete(d.ref); b.delete(db.doc(`requests/${d.id}/out/${uid}`)); } await b.commit(); }
  return keep;
}
async function duelSlot(uid, startedAt, withGhost) { // the hourly duel limit (a window from the start of its first duel, DUEL_PER_HOUR + 1 for clock skew) and the ghost slot
  const ref = db.doc(`duelwin/${uid}`);
  return db.runTransaction(async tx => { const d = (await tx.get(ref)).data() || {}, gk = d.gk || 0; let start = d.start || 0, n = d.n || 0;
    if (!start || startedAt >= start + HOUR_MS) { start = startedAt; n = 0; } // a duel that started before the window counts in it
    if (n >= DUEL_PER_HOUR + 1) return { ok: false, k: -1 };
    tx.set(ref, { start, n: n + 1, gk: gk + (withGhost ? 1 : 0) }); return { ok: true, k: gk % GHOST_KEEP }; });
}
async function ghostPlayed(id, seed, day, myScore) { // a ghost was played on its own seed: its counts, and a summary for its owner, one note a day instead of one per pick
  const gref = db.doc(`ghosts/${String(id).slice(0, 64)}`), g = (await gref.get()).data(); if (!g || !g.uid || g.seed !== seed) return; // a stale or made-up id counts nothing
  const ownerWon = (g.score || 0) > myScore; await gref.set({ picked: admin.firestore.FieldValue.increment(1), [ownerWon ? 'wins' : 'losses']: admin.firestore.FieldValue.increment(1) }, { merge: true });
  const sref = db.doc(`duelsum/${g.uid}`);
  const prev = await db.runTransaction(async tx => { const s = (await tx.get(sref)).data() || {}; if (s.day && s.day !== day && s.n > 0) { tx.set(sref, { day, n: 1, won: ownerWon ? 1 : 0 }); return s; } tx.set(sref, { day, n: (s.day === day ? s.n || 0 : 0) + 1, won: (s.day === day ? s.won || 0 : 0) + (ownerWon ? 1 : 0) }); return null; });
  if (prev) await noteTo(g.uid, { type: 'ghostsum', n: prev.n, won: prev.won || 0, day: prev.day });
}
const chalLive = (x, now) => (x.status === 'open' && (x.expires || 0) > now) || (x.status === 'playing' && (x.startedAt || 0) + CHALLENGE_PLAY_MS > now); // a friend duel that can still take the friend's score
async function settleStale(ref) { // a friend duel that was started (duelfind) but whose score never came within CHALLENGE_PLAY_MS counts as 0 sap
  const now = Date.now(); const x = await db.runTransaction(async tx => { const c = (await tx.get(ref)).data(); if (!c || c.status !== 'playing' || (c.startedAt || 0) + CHALLENGE_PLAY_MS > now) return null; tx.update(ref, { status: 'done', toScore: 0, settled: now, forfeit: true }); return c; });
  if (x) { const theirs = x.fromScore || 0, day = dayNow(); await Promise.all([noteTo(x.from, { type: 'duel', vs: x.toName || 'vriend', won: theirs > 0, tie: theirs === 0, score: theirs, theirs: 0, hat: LOSER_HAT, day }), noteTo(x.to, { type: 'duel', vs: x.fromName || 'vriend', won: false, tie: theirs === 0, score: 0, theirs, hat: LOSER_HAT, day })]); }
  return x;
}
const dayOk = day => { if (!DAY_RX.test(String(day || ''))) return false; const t = Date.parse(day + 'T12:00:00Z'); return Math.abs(t - Date.now()) < 2 * 86400000; }; // today, give or take a day of timezone
const noteTo = (other, note) => db.doc(`profiles/${other}`).set({ notes: admin.firestore.FieldValue.arrayUnion(Object.assign({ at: Date.now() }, note)) }, { merge: true });
async function settleChallenge(day, c, ref) { // both entries present: the higher score wins; a tie pays nothing
  const [a, b] = await Promise.all([db.doc(`duels/${day}/entries/${c.from}`).get(), db.doc(`duels/${day}/entries/${c.to}`).get()]);
  if (!a.exists || !b.exists) return false; const sa = a.data().score || 0, sb = b.data().score || 0;
  await Promise.all([noteTo(c.from, { type: 'duel', vs: c.toName || 'vriend', won: sa > sb, tie: sa === sb, score: sa, theirs: sb, sap: CHALLENGE_SAP, hat: LOSER_HAT, day }),
    noteTo(c.to, { type: 'duel', vs: c.fromName || 'vriend', won: sb > sa, tie: sa === sb, score: sb, theirs: sa, sap: CHALLENGE_SAP, hat: LOSER_HAT, day }), ref.update({ resolved: true, settled: Date.now() })]);
  return true;
}
const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
const cleanCode = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.floor(Number(v) || 0)));
const profileView = (id, p) => p ? ({ uid: id, name: String(p.name || 'Fruit').slice(0, 16), level: p.level || 1, best: p.best || 0, fruits: Array.isArray(p.fruits) ? p.fruits : [], hat: p.hat || 'none', streak: p.streak || 0, runs: p.runs || 0, stamps: p.stamps || 0, division: p.division || '', weekKey: p.weekKey || '', weekEv: p.weekEv || '', weekScore: p.weekScore || 0, kitchen: p.kitchen && typeof p.kitchen === 'object' ? p.kitchen : null, last: p.updatedMs || 0, v2: (p.cv || 0) >= CLIENT_V }) : null; // v0.32: v2 = the friend's client plays friend duels v2
async function ensureCode(uid, data) { // the player's code, created once
  const ref = db.doc(`profiles/${uid}`), cur = (await ref.get()).data() || {};
  if (cur.code) return cur.code;
  for (let i = 0; i < 8; i++) { const code = newCode(), cref = db.doc(`codes/${code}`); const ok = await db.runTransaction(async tx => { const c = await tx.get(cref); if (c.exists) return false; tx.set(cref, { uid }); tx.set(ref, Object.assign({ code }, data || {}), { merge: true }); return true; }); if (ok) return code; }
  throw new Error('code');
}
const rankPrize = r => r === 1 ? { sap: 5000, munt: 3, hat: 'weekkroon' } : r <= 3 ? { sap: 3000, munt: 2 } : r <= 10 ? { sap: 2000, munt: 1 } : r <= 25 ? { sap: 1000 } : { sap: 500 };

function isoWeek(d) { // "2026-W44", Monday-based, like weekKey() in the game (day boundary at 07:00)
  const t = new Date(d.getTime() - 7 * 3600000); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4)); const wk = 1 + Math.round(((t - firstThu) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return `${t.getUTCFullYear()}-W${String(wk).padStart(2, '0')}`;
}
const eventOfWeek = key => EVENTS[parseInt(key.split('-W')[1], 10) % EVENTS.length];
const divisionFor = level => level <= 20 ? 'hout' : level <= 50 ? 'koper' : level <= 90 ? 'zilver' : level <= 140 ? 'goud' : 'diamant';

async function uidFrom(req) {
  const h = req.get('Authorization') || ''; const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!tok) return null; try { return (await admin.auth().verifyIdToken(tok)).uid; } catch (e) { return null; }
}

// A player joins a group of at most 50 in their division for the week; groups fill in order of arrival.
async function groupFor(week, uid, level, division) {
  const ev = eventOfWeek(week), div = division || divisionFor(level), playerRef = db.doc(`players/${uid}`), player = (await playerRef.get()).data() || {};
  if (player.week === week && player.group) return { group: player.group, div: player.division || div };
  const groups = await db.collection('groups').where('week', '==', week).where('division', '==', div).where('count', '<', DIV_SIZE).limit(1).get();
  let groupId;
  if (groups.empty) { const ref = await db.collection('groups').add({ week, division: div, event: ev, count: 1, created: admin.firestore.FieldValue.serverTimestamp() }); groupId = ref.id; }
  else { groupId = groups.docs[0].id; await groups.docs[0].ref.update({ count: admin.firestore.FieldValue.increment(1) }); }
  await playerRef.set({ week, group: groupId, division: div, level, updated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { group: groupId, div };
}

exports.tourney = onRequest({ region: 'europe-west1', cors: true }, async (req, res) => {
  const rawUid = await uidFrom(req); if (!rawUid) { res.status(401).json({ error: 'auth' }); return; }
  // A device that was linked with a link code acts as the identity it joined (devices/{uid}.primary).
  let uid = rawUid; try { const dev = (await db.doc(`devices/${rawUid}`).get()).data(); if (dev && dev.primary) uid = dev.primary; } catch (e) {}
  const body = req.body || {}, action = body.action, week = isoWeek(new Date());
  try {
    if (action === 'hello') { // v0.32: what this server can do, and what waits for me (friend requests, friend duels)
      const [rin, cin] = await Promise.all([freshRequests(uid), db.collection('challenges').where('to', '==', uid).where('status', '==', 'open').limit(10).get()]);
      const now = Date.now(); res.json({ ok: true, v: SERVER_V, caps: CAPS, inbox: { req: rin.length, duel: cin.docs.filter(d => (d.data().expires || 0) > now).length } });
    } else if (action === 'submit') { // { ev, score, seconds, level, division, name }
      const ev = String(body.ev); if (!EVENTS.includes(ev) || ev !== eventOfWeek(week)) { res.status(400).json({ error: 'event' }); return; }
      const score = Math.max(0, Math.floor(Number(body.score) || 0)), seconds = Math.max(1, Number(body.seconds) || 1);
      if (score > seconds * MAX_PER_SEC[ev] + 50) { res.status(400).json({ error: 'implausible' }); return; }
      const { group, div } = await groupFor(week, uid, Number(body.level) || 1, body.division);
      const ref = db.doc(`groups/${group}/scores/${uid}`), cur = (await ref.get()).data();
      if (!cur || score > cur.score) await ref.set({ score, name: String(body.name || 'Fruit').slice(0, 20), level: Number(body.level) || 1, updated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      res.json({ ok: true, group, division: div, week });
    } else if (action === 'ladder') { // the player's group, sorted; the client shows top 10 + neighbours
      const { group, div } = await groupFor(week, uid, Number(body.level) || 1, body.division);
      const snap = await db.collection(`groups/${group}/scores`).orderBy('score', 'desc').limit(DIV_SIZE).get();
      const rows = snap.docs.map(d => ({ id: d.id, name: d.data().name, score: d.data().score, me: d.id === uid }));
      res.json({ ok: true, week, division: div, event: eventOfWeek(week), rows, rank: rows.findIndex(r => r.me) + 1 || null });
    } else if (action === 'result') { // prizes of the last closed week, once
      const doc = await db.doc(`results/${uid}`).get(); const r = doc.data();
      if (!r || r.claimed) { res.json({ ok: true, result: null }); return; }
      await doc.ref.update({ claimed: true }); res.json({ ok: true, result: r });
    } else if (action === 'profile') { // { name, level, best, fruits, hat, streak, runs, stamps, division, weekKey, weekEv, weekScore } -> { code }
      const data = { name: String(body.name || 'Fruit').replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16) || 'Fruit', level: clampInt(body.level, 1, 500), best: clampInt(body.best, 0, 3 * 3600000),
        fruits: (Array.isArray(body.fruits) ? body.fruits : []).map(k => String(k).slice(0, 24)).slice(0, 40), hat: String(body.hat || 'none').slice(0, 24), streak: clampInt(body.streak, 0, 10000), runs: clampInt(body.runs, 0, 1e6),
        stamps: clampInt(body.stamps, 0, 100000), division: DIVISIONS.includes(body.division) ? body.division : '', weekKey: String(body.weekKey || '').slice(0, 12), weekEv: EVENTS.includes(body.weekEv) ? body.weekEv : '', weekScore: clampInt(body.weekScore, 0, 1e6), kitchen: kitchenOf(body.kitchen),
        updatedMs: Date.now(), updated: admin.firestore.FieldValue.serverTimestamp() };
      if (typeof body.findable === 'boolean') { data.findable = body.findable; data.nameKey = body.findable ? nameKeyOf(data.name) : ''; data.cv = CLIENT_V; } // v0.32: only a client that can show requests and friend duels v2 sends findable
      if (body.fruit) data.fruit = String(body.fruit).slice(0, 24);
      const code = await ensureCode(uid, data); await db.doc(`profiles/${uid}`).set(data, { merge: true }); await ensureRef(uid); res.json({ ok: true, code });
    } else if (action === 'befriend') { // { code } -> both players become friends; the first time, both get FRIEND_SAP
      const code = cleanCode(body.code); if (code.length !== 6) { res.status(400).json({ error: 'code' }); return; }
      const c = (await db.doc(`codes/${code}`).get()).data(); if (!c) { res.json({ ok: false, error: 'unknown' }); return; }
      const other = c.uid; if (other === uid) { res.json({ ok: false, error: 'self' }); return; }
      const [mine, theirs, otherProfile, myProfile] = await Promise.all([db.collection(`friends/${uid}/of`).get(), db.collection(`friends/${other}/of`).get(), db.doc(`profiles/${other}`).get(), db.doc(`profiles/${uid}`).get()]);
      const op = otherProfile.data() || {}, mp = myProfile.data() || {};
      if (mine.docs.some(d => d.id === other)) { res.json({ ok: true, already: true, friend: profileView(other, op) }); return; }
      if (mine.size >= MAX_FRIENDS || theirs.size >= MAX_FRIENDS) { res.json({ ok: false, error: 'full' }); return; }
      const made = await makeFriends(uid, other, mp, op); res.json({ ok: true, friend: made.friend, reward: made.reward }); // v0.32: once per pair, both sides capped
    } else if (action === 'friends') { // { day? } -> { code, friends, rewards: [{from, sap}], notes: [...], challenges: [...] } (rewards and notes are handed out once)
      const meRef = db.doc(`profiles/${uid}`), me = (await meRef.get()).data() || {}; const list = await db.collection(`friends/${uid}/of`).get();
      const refs = list.docs.map(d => db.doc(`profiles/${d.id}`)); const docs = refs.length ? await db.getAll(...refs) : [];
      const friends = docs.map(d => profileView(d.id, d.data())).filter(Boolean);
      const rewards = Array.isArray(me.pending) ? me.pending : [], notes = Array.isArray(me.notes) ? me.notes.slice(0, 20) : [];
      if (rewards.length || notes.length) await meRef.set({ pending: [], notes: [] }, { merge: true });
      let challenges = [];
      if (dayOk(body.day)) { // today's open friend duels involving me, with who has played
        const [asFrom, asTo] = await Promise.all([db.collection(`duels/${body.day}/challenges`).where('from', '==', uid).get(), db.collection(`duels/${body.day}/challenges`).where('to', '==', uid).get()]);
        const all = asFrom.docs.concat(asTo.docs).map(d => Object.assign({ id: d.id }, d.data()));
        const ids = Array.from(new Set(all.flatMap(c => [c.from, c.to]))); const ents = ids.length ? await db.getAll(...ids.map(i => db.doc(`duels/${body.day}/entries/${i}`))) : []; const played = new Set(ents.filter(e => e.exists).map(e => e.id));
        for (const c of all) if (!c.resolved && played.has(c.from) && played.has(c.to)) { await settleChallenge(body.day, c, db.doc(`duels/${body.day}/challenges/${c.id}`)); c.resolved = true; }
        challenges = all.map(c => ({ from: c.from, to: c.to, mine: c.from === uid ? 'from' : 'to', fromName: c.fromName || '', toName: c.toName || '', fromPlayed: played.has(c.from), toPlayed: played.has(c.to), resolved: !!c.resolved }));
        const fresh = (await meRef.get()).data() || {}; if (Array.isArray(fresh.notes) && fresh.notes.length) { notes.push(...fresh.notes.slice(0, 20)); await meRef.set({ notes: [] }, { merge: true }); }
      }
      const C = f => db.collection('challenges').where(f, '==', uid); // v0.32: open and started friend duels are queried apart, so none is ever cut off by a limit
      const [rin, rout, sum, ...cq] = await Promise.all([freshRequests(uid), db.collection(`requests/${uid}/out`).limit(REQ_IN_MAX * 2).get(), db.doc(`duelsum/${uid}`).get(),
        ...['to', 'from'].flatMap(f => [C(f).where('status', '==', 'open').limit(MAX_FRIENDS).get(), C(f).where('status', '==', 'playing').limit(MAX_FRIENDS).get(), C(f).orderBy('created', 'desc').limit(10).get()])]);
      const requests = { in: rin.map(d => reqView(d.data())), out: rout.docs.filter(reqFresh).map(d => reqView(d.data())) }, nowMs = Date.now(), ids = new Set(), duels2 = [];
      for (const q of cq) for (const d of q.docs) { if (ids.has(d.id)) continue; ids.add(d.id); let c = d.data();
        if (c.status === 'playing' && (c.startedAt || 0) + CHALLENGE_PLAY_MS <= nowMs && await settleStale(d.ref)) c = Object.assign({}, c, { status: 'done', toScore: 0 });
        const mine = c.from === uid ? 'from' : 'to', status = c.status === 'open' && !((c.expires || 0) > nowMs) ? 'expired' : c.status || 'open';
        if (status === 'open' || status === 'playing' || nowMs - (c.created || 0) < 2 * 86400000) duels2.push({ id: d.id, mine, other: mine === 'from' ? c.to : c.from, otherName: mine === 'from' ? c.toName || '' : c.fromName || '', score: c.fromScore || 0, theirs: c.toScore || 0, status, expires: c.expires || 0, created: c.created || 0 }); }
      duels2.sort((a, b) => (b.created || 0) - (a.created || 0)); duels2.splice(40);
      const s = sum.data(); if (s && s.n > 0 && dayOk(body.day) && s.day !== body.day) { notes.push({ type: 'ghostsum', n: s.n, won: s.won || 0, day: s.day }); await sum.ref.set({ day: body.day, n: 0, won: 0 }); }
      res.json({ ok: true, code: me.code || '', friends, rewards, notes, challenges, requests, duels2 });
    } else if (action === 'duelfind' && body.v === 2) { // v0.32 { v: 2, day, level, seen: [seed], challenge? } -> { opp: { id, seed, name, fruit, level, score, t, ghost } } or null
      const now = Date.now(), cid = String(body.challenge || '').slice(0, 300);
      if (cid) { const cref = db.doc(`challenges/${cid}`); // the first fetch starts the friend duel (playing); only a second tap within CHALLENGE_GRACE_MS gets it again, so nobody replays known knives
        const got = await db.runTransaction(async tx => { const x = (await tx.get(cref)).data(); if (!x || x.to !== uid) return { gone: 'gone' };
          if (x.status === 'open' && (x.expires || 0) > now) { tx.update(cref, { status: 'playing', startedAt: now }); return { x }; }
          if (x.status === 'playing' && now - (x.startedAt || 0) < CHALLENGE_GRACE_MS) return { x };
          return { gone: x.status === 'playing' ? 'playing' : 'gone' }; });
        if (got.gone === 'playing') await settleStale(cref);
        if (!got.x) { res.json({ ok: true, opp: null, gone: true, error: got.gone }); return; }
        const c = got.x; res.json({ ok: true, opp: { id: '', seed: c.seed, name: c.fromName || 'Vriend', fruit: c.fromFruit || 'appel', level: c.level || 1, score: c.fromScore || 0, t: c.t || 0, ghost: c.ghost || '' }, challenge: cid }); return; }
      const seen = new Set((Array.isArray(body.seen) ? body.seen : []).map(String).slice(-60)), band = ghostBand(body.level); let cands = [];
      for (const b of [band, band - 1, band + 1]) { if (b < 0) continue; const snap = await db.collection('ghosts').where('band', '==', b).orderBy('createdMs', 'desc').limit(40).get();
        cands = snap.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(g => g.uid !== uid && (g.createdMs || 0) > now - GHOST_RECENT_MS && !seen.has(String(g.seed))); if (cands.length) break; }
      if (cands.length) { const pick5 = cands.sort((a, b) => (a.picked || 0) - (b.picked || 0)).slice(0, 5), o = pick5[Math.floor(Math.random() * pick5.length)]; res.json({ ok: true, opp: ghostView(o.id, o) }); return; }
      if (dayOk(body.day) && !seen.has(String(body.day))) { // nobody new yet: today's entries of the day-based duel (older clients), on the day's knives
        const snap = await db.collection(`duels/${body.day}/entries`).limit(30).get(), list = snap.docs.filter(d => d.id !== uid).map(d => d.data()).sort((a, b) => (a.picked || 0) - (b.picked || 0)).slice(0, 5);
        if (list.length) { const o = list[Math.floor(Math.random() * list.length)]; res.json({ ok: true, opp: { id: '', seed: body.day, name: o.name, fruit: o.fruit, level: o.level, score: o.score, t: o.t, ghost: o.ghost || '' } }); return; } }
      res.json({ ok: true, opp: null });
    } else if (action === 'duelfind') { // { day, level } -> an opponent of a similar level who already played today's duel (with ghost), or null
      if (!dayOk(body.day)) { res.status(400).json({ error: 'day' }); return; }
      const band = bandOf(body.level); let snap = await db.collection(`duels/${body.day}/entries`).where('band', '==', band).limit(30).get();
      if (snap.docs.filter(d => d.id !== uid).length === 0) snap = await db.collection(`duels/${body.day}/entries`).limit(30).get(); // nobody of my level yet: anyone will do
      const cands = snap.docs.filter(d => d.id !== uid).map(d => Object.assign({ uid: d.id }, d.data())).sort((a, b) => (a.picked || 0) - (b.picked || 0)).slice(0, 5);
      if (!cands.length) { res.json({ ok: true, opp: null }); return; }
      const o = cands[Math.floor(Math.random() * cands.length)]; await db.doc(`duels/${body.day}/entries/${o.uid}`).set({ picked: admin.firestore.FieldValue.increment(1) }, { merge: true });
      res.json({ ok: true, opp: { uid: o.uid, name: o.name, fruit: o.fruit, level: o.level, score: o.score, t: o.t, ghost: o.ghost || '' } });
    } else if (action === 'duel' && SEED_RX.test(String(body.seed || '')) && dayOk(body.day)) { // v0.32 { day, seed, score, seconds, level, fruit, name, ghost, t, quit, vsGhost, challenge, challengeTo }
      const seed = String(body.seed), score = clampInt(body.score, 0, 1e6), t = clampInt(body.t, 0, DUEL_T_MAX), seconds = Math.max(1, Math.min(Number(body.seconds) || 1, t / 1000 + 2, DUEL_T_MAX / 1000)); // a duel lasts 90 s: seconds is bounded by its own t
      if (score > seconds * DUEL_MAX_PER_SEC + 50) { res.status(400).json({ error: 'implausible' }); return; }
      const now = Date.now(), name = playerName(body.name), level = clampInt(body.level, 1, 500), fruit = String(body.fruit || 'appel').slice(0, 24), quit = !!body.quit, ghost = quit ? '' : String(body.ghost || '').replace(/[^0-9,\-]/g, '').slice(0, GHOST_MAX * 8);
      const cid = String(body.challenge || '').slice(0, 300), to = String(body.challengeTo || '').slice(0, 128), slot = await duelSlot(uid, now - t, !!ghost); // the window is anchored at the duel's start, like the client's
      let ghostId = '', settled = 0, challenge = '', error = '';
      if (slot.ok) {
        if (ghost) { ghostId = `${ghostKey(uid)}_${slot.k}`; await db.doc(`ghosts/${ghostId}`).set({ uid, name, fruit, level, band: ghostBand(level), seed, score, t, ghost, createdMs: now, expireAt: new Date(now + GHOST_DAYS * 86400000), picked: 0, wins: 0, losses: 0 }); } // a fixed slot: the oldest of the player's GHOST_KEEP ghosts is replaced, no trim query
        if (seed === body.day && ghost) { const ref = db.doc(`duels/${body.day}/entries/${uid}`); if (!(await ref.get()).exists) { await ref.set({ score, level, band: bandOf(level), fruit, name, ghost, t, picked: 0, updatedMs: now });
          const [asFrom, asTo] = await Promise.all([db.collection(`duels/${body.day}/challenges`).where('from', '==', uid).get(), db.collection(`duels/${body.day}/challenges`).where('to', '==', uid).get()]); for (const d of asFrom.docs.concat(asTo.docs)) { const c = d.data(); if (!c.resolved) await settleChallenge(body.day, c, d.ref); } } }
        if (body.vsGhost) { try { await ghostPlayed(body.vsGhost, seed, body.day, score); } catch (e) {} }
      }
      if (cid) { const cref = db.doc(`challenges/${cid}`); const c = await db.runTransaction(async tx => { const x = (await tx.get(cref)).data(); if (!x || x.to !== uid || x.seed !== seed || !chalLive(x, now)) return null; tx.update(cref, { status: 'done', toScore: score, settled: now }); return x; }); // a reply settles even beyond the hourly limit: it was started from duelfind
        if (c) { const theirs = c.fromScore || 0; await Promise.all([noteTo(c.from, { type: 'duel', vs: c.toName || name, won: theirs > score, tie: theirs === score, score: theirs, theirs: score, hat: LOSER_HAT, day: body.day }), noteTo(uid, { type: 'duel', vs: c.fromName || 'vriend', won: score > theirs, tie: theirs === score, score, theirs, hat: LOSER_HAT, day: body.day })]); settled = 1; } }
      if (to && to !== uid) { if (!slot.ok) error = 'limit'; else if (!ghostId) error = 'quit'; else { const [isFriend, op, seenG, seenD] = await Promise.all([db.doc(`friends/${uid}/of/${to}`).get(), db.doc(`profiles/${to}`).get(), db.collection('ghosts').where('uid', '==', to).where('seed', '==', seed).limit(1).get(), seed === body.day ? db.doc(`duels/${body.day}/entries/${to}`).get() : Promise.resolve(null)]);
        const o = op.data() || {};
        if (!isFriend.exists) error = 'notfriend'; else if (!((o.cv || 0) >= CLIENT_V)) error = 'oldapp'; else if (!seenG.empty || (seenD && seenD.exists)) error = 'seen'; // an older app cannot play a v2 challenge; never knives the friend already played
        else { const id = [uid, to].sort().join('_'), cref = db.doc(`challenges/${id}`), cur = (await cref.get()).data();
          if (cur && chalLive(cur, now)) error = 'already';
          else { await cref.set({ from: uid, to, fromName: name, toName: String(o.name || 'vriend').slice(0, 16), seed, ghost, t, fromScore: score, fromFruit: fruit, level, status: 'open', created: now, expires: now + CHALLENGE_MS }); await noteTo(to, { type: 'challenge', v: 2, by: name }); challenge = id; } } } }
      res.json(slot.ok ? { ok: true, stored: true, settled, challenge, error } : { ok: true, stored: false, limit: true, settled, challenge, error });
    } else if (action === 'duel') { // { day, score, seconds, level, fruit, name, ghost, t, vs, vsScore }: my finished duel; settles friend challenges that are complete now
      if (!dayOk(body.day)) { res.status(400).json({ error: 'day' }); return; }
      const score = clampInt(body.score, 0, 1e6), dt = clampInt(body.t === undefined ? Number(body.seconds) * 1000 : body.t, 0, DUEL_T_MAX), seconds = Math.max(1, Math.min(Number(body.seconds) || 1, dt / 1000 + 2, DUEL_T_MAX / 1000)); if (score > seconds * DUEL_MAX_PER_SEC + 50) { res.status(400).json({ error: 'implausible' }); return; } // v0.32: seconds bounded by t and 95 s
      const ref = db.doc(`duels/${body.day}/entries/${uid}`); if ((await ref.get()).exists) { res.json({ ok: true, dup: true }); return; }
      const name = String(body.name || 'Fruit').replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16) || 'Fruit';
      await ref.set({ score, level: clampInt(body.level, 1, 500), band: bandOf(body.level), fruit: String(body.fruit || 'appel').slice(0, 24), name, ghost: String(body.ghost || '').replace(/[^0-9,\-]/g, '').slice(0, GHOST_MAX * 8), t: clampInt(body.t, 0, 120000), picked: 0, updatedMs: Date.now() });
      const vs = String(body.vs || '').slice(0, 128); if (vs && vs !== uid) { try { await noteTo(vs, { type: 'picked', by: name, won: score > clampInt(body.vsScore, 0, 1e6), score, theirs: clampInt(body.vsScore, 0, 1e6), day: body.day }); } catch (e) {} }
      const [asFrom, asTo] = await Promise.all([db.collection(`duels/${body.day}/challenges`).where('from', '==', uid).get(), db.collection(`duels/${body.day}/challenges`).where('to', '==', uid).get()]);
      let settled = 0; for (const d of asFrom.docs.concat(asTo.docs)) { const c = d.data(); if (!c.resolved && await settleChallenge(body.day, c, d.ref)) settled++; }
      res.json({ ok: true, settled });
    } else if (action === 'challenge') { // { uid, day }: challenge a friend to today's duel; the loser pays CHALLENGE_SAP and wears the pan for a day
      const other = String(body.uid || '').slice(0, 128); if (!other || other === uid || !dayOk(body.day)) { res.status(400).json({ error: 'uid' }); return; }
      const [isFriend, mp, op] = await Promise.all([db.doc(`friends/${uid}/of/${other}`).get(), db.doc(`profiles/${uid}`).get(), db.doc(`profiles/${other}`).get()]);
      if (!isFriend.exists) { res.json({ ok: false, error: 'notfriend' }); return; }
      if (((op.data() || {}).cv || 0) >= CLIENT_V) { res.json({ ok: false, error: 'newapp' }); return; } // v0.32: that friend plays friend duels v2; an old challenge would never be settled
      const id = [uid, other].sort().join('_'), ref = db.doc(`duels/${body.day}/challenges/${id}`); if ((await ref.get()).exists) { res.json({ ok: true, already: true }); return; }
      const fromName = String((mp.data() || {}).name || 'Een vriend').slice(0, 16), toName = String((op.data() || {}).name || 'vriend').slice(0, 16);
      await ref.set({ from: uid, to: other, fromName, toName, resolved: false, created: Date.now() }); await noteTo(other, { type: 'challenge', by: fromName, day: body.day });
      const c = { from: uid, to: other, fromName, toName }; const settled = await settleChallenge(body.day, c, ref); res.json({ ok: true, settled });
    } else if (action === 'rivals') { // { level, keep: [uid] } -> two players just above me (fresh views of the kept ones while the week lasts)
      const keep = (Array.isArray(body.keep) ? body.keep : []).map(String).slice(0, 2).filter(u => u && u !== uid);
      let rows = [];
      if (keep.length) { const docs = await db.getAll(...keep.map(u => db.doc(`profiles/${u}`))); rows = docs.filter(d => d.exists).map(d => profileView(d.id, d.data())); }
      if (rows.length < 2) { const lvl = clampInt(body.level, 1, 500); const snap = await db.collection('profiles').where('level', '>', lvl).orderBy('level', 'asc').limit(8).get();
        for (const d of snap.docs) { if (rows.length >= 2) break; if (d.id === uid || rows.some(r => r.uid === d.id)) continue; rows.push(profileView(d.id, d.data())); } }
      res.json({ ok: true, rivals: rows.slice(0, 2) });
    } else if (action === 'tip') { // { uid, day }: a tip for a friend's kitchen, once per friend per day; the receiver gets TIP_SAP by note
      const other = String(body.uid || '').slice(0, 128); if (!other || other === uid || !dayOk(body.day)) { res.status(400).json({ error: 'uid' }); return; }
      const [isFriend, mp] = await Promise.all([db.doc(`friends/${uid}/of/${other}`).get(), db.doc(`profiles/${uid}`).get()]); if (!isFriend.exists) { res.json({ ok: false, error: 'notfriend' }); return; }
      const ref = db.doc(`tips/${body.day}_${uid}_${other}`); if ((await ref.get()).exists) { res.json({ ok: false, error: 'already' }); return; }
      await ref.set({ from: uid, to: other, day: body.day, at: Date.now() }); await noteTo(other, { type: 'tip', by: String((mp.data() || {}).name || 'Een vriend').slice(0, 16), sap: TIP_SAP }); await db.doc(`profiles/${other}`).set({ 'kitchen.tips': admin.firestore.FieldValue.increment(1) }, { merge: true }).catch(() => {});
      res.json({ ok: true, sap: TIP_SAP });
    } else if (action === 'passed') { // { uid }: tell a rival I passed them
      const other = String(body.uid || '').slice(0, 128); if (!other || other === uid) { res.status(400).json({ error: 'uid' }); return; }
      const mp = (await db.doc(`profiles/${uid}`).get()).data() || {}; await noteTo(other, { type: 'passed', by: String(mp.name || 'Een speler').slice(0, 16), level: mp.level || 1 }); res.json({ ok: true });
    } else if (action === 'findplayer') { // v0.32 { q } -> up to 8 findable players: { ref, name, level, fruit, tag, friend }; nothing private
      const q = nameKeyOf(body.q); if (q.length < 2) { res.json({ ok: false, error: 'short' }); return; }
      if (!(await rateOk(`find_${uid}`, FIND_MAX, FIND_WINDOW_MS))) { res.json({ ok: false, error: 'slow' }); return; }
      const ip = clientIp(req); if (ip && !(await rateOk(`findip_${hashOf('ip', ip).slice(0, 24)}`, FIND_IP_MAX, FIND_WINDOW_MS))) { res.json({ ok: false, error: 'slow' }); return; } // fresh anonymous accounts share their address
      const exact = await db.collection('profiles').where('nameKey', '==', q).limit(9).get(); const docs = exact.docs.slice();
      if (q.length >= 3 && docs.length < 9) { const pre = await db.collection('profiles').where('nameKey', '>=', q).where('nameKey', '<', q + '').orderBy('nameKey').limit(12).get(); for (const d of pre.docs) if (!docs.some(x => x.id === d.id)) docs.push(d); }
      const mine = new Set((await db.collection(`friends/${uid}/of`).get()).docs.map(d => d.id));
      const players = docs.filter(d => d.id !== uid && d.data().findable === true && d.data().ref).slice(0, 8).map(d => Object.assign(reqView(d.data()), { friend: mine.has(d.id) }));
      res.json({ ok: true, players });
    } else if (action === 'friendreq') { // v0.32 { ref }: ask a player found by name; if they asked me already, we are friends at once
      const other = await byRef(body.ref); if (!other || other.data().findable !== true) { res.json({ ok: false, error: 'unknown' }); return; }
      const oid = other.id; if (oid === uid) { res.json({ ok: false, error: 'self' }); return; }
      const [isFriend, mpd, theirReq, myReq, refused, mine, theirs] = await Promise.all([db.doc(`friends/${uid}/of/${oid}`).get(), db.doc(`profiles/${uid}`).get(), db.doc(`requests/${uid}/in/${oid}`).get(), db.doc(`requests/${oid}/in/${uid}`).get(), db.doc(`requests/${uid}/refused/${oid}`).get(), db.collection(`friends/${uid}/of`).get(), db.collection(`friends/${oid}/of`).get()]);
      if (isFriend.exists) { res.json({ ok: true, already: true }); return; }
      const mp = mpd.data() || {}, op = other.data();
      if (mine.size >= MAX_FRIENDS || theirs.size >= MAX_FRIENDS) { res.json({ ok: false, error: 'friends' }); return; }
      if (theirReq.exists) { const made = await makeFriends(uid, oid, mp, op); await noteTo(oid, { type: 'accepted', by: playerName(mp.name) }); res.json({ ok: true, friend: made.friend, reward: made.reward, mutual: true }); return; }
      if (refused.exists && (refused.data().at || 0) > Date.now() - REFUSED_MS) { res.json({ ok: false, error: 'unknown' }); return; } // refused: no new request (and no new note) for a week
      if (myReq.exists && reqFresh(myReq)) { res.json({ ok: true, sent: true }); return; } // asked already: no second note
      if ((await freshRequests(oid)).length >= REQ_IN_MAX) { res.json({ ok: false, error: 'full' }); return; } // only requests of the last two weeks fill the inbox
      if (!(await rateOk(`req_${uid}`, REQ_OUT_DAY, 86400000))) { res.json({ ok: false, error: 'slow' }); return; }
      const myRef = mp.ref || await ensureRef(uid), at = Date.now();
      await Promise.all([db.doc(`requests/${oid}/in/${uid}`).set({ ref: myRef, name: playerName(mp.name), level: mp.level || 1, fruit: mp.fruit || 'appel', at }), db.doc(`requests/${uid}/out/${oid}`).set({ ref: op.ref, name: playerName(op.name), level: op.level || 1, fruit: op.fruit || 'appel', at })]);
      await noteTo(oid, { type: 'request', by: playerName(mp.name) }); res.json({ ok: true, sent: true });
    } else if (action === 'friendans') { // v0.32 { ref, yes }: accept or refuse a request; a refusal keeps the same player from asking again for a week
      const other = await byRef(body.ref); if (!other) { res.json({ ok: false, error: 'gone' }); return; }
      const oid = other.id, req = await db.doc(`requests/${uid}/in/${oid}`).get(); if (!req.exists) { res.json({ ok: false, error: 'gone' }); return; }
      if (!body.yes) { const b = db.batch(); b.delete(req.ref); b.delete(db.doc(`requests/${oid}/out/${uid}`)); b.set(db.doc(`requests/${oid}/refused/${uid}`), { at: Date.now() }); await b.commit(); res.json({ ok: true, refused: true }); return; }
      const [mpd, mine, theirs] = await Promise.all([db.doc(`profiles/${uid}`).get(), db.collection(`friends/${uid}/of`).get(), db.collection(`friends/${oid}/of`).get()]);
      if (mine.size >= MAX_FRIENDS || theirs.size >= MAX_FRIENDS) { res.json({ ok: false, error: 'full' }); return; }
      const mp = mpd.data() || {}, made = await makeFriends(uid, oid, mp, other.data()); await noteTo(oid, { type: 'accepted', by: playerName(mp.name) }); res.json({ ok: true, friend: made.friend, reward: made.reward });
    } else if (action === 'unfriend') { // { uid }
      const other = String(body.uid || '').slice(0, 128); if (!other) { res.status(400).json({ error: 'uid' }); return; }
      const batch = db.batch(); batch.delete(db.doc(`friends/${uid}/of/${other}`)); batch.delete(db.doc(`friends/${other}/of/${uid}`)); await batch.commit(); res.json({ ok: true });
    } else if (action === 'save') { // { data, rev, level, runs }: the save blob (the game's own FV1 code), kept unless the stored one is ahead
      const data = String(body.data || ''); if (!data.startsWith('FV1.') || data.length > 300000) { res.status(400).json({ error: 'data' }); return; }
      const rev = clampInt(body.rev, 0, 1e9), level = clampInt(body.level, 1, 500), runs = clampInt(body.runs, 0, 1e6), ref = db.doc(`saves/${uid}`), cur = (await ref.get()).data() || {};
      if ((cur.rev || 0) > rev && (cur.level || 0) >= level && (cur.runs || 0) >= runs) { res.json({ ok: true, rev: cur.rev, kept: true }); return; }
      const histDay = new Date(Date.now()).toISOString().slice(0, 10);
      await ref.set({ data, rev, level, runs, histDay, updatedMs: Date.now(), updated: admin.firestore.FieldValue.serverTimestamp() });
      if (cur.histDay !== histDay) { // v0.32.2 save history: the first save of a new day is kept as that day's copy; days beyond SAVE_HISTORY_DAYS go
        await db.doc(`saves/${uid}/history/${histDay}`).set({ data, rev, level, runs, savedMs: Date.now() });
        const hs = await db.collection(`saves/${uid}/history`).get(); const old = hs.docs.map(d => d.id).sort().reverse().slice(SAVE_HISTORY_DAYS);
        for (const id of old) await db.doc(`saves/${uid}/history/${id}`).delete();
      }
      res.json({ ok: true, rev });
    } else if (action === 'load') { // -> the stored save of this identity, if any
      const cur = (await db.doc(`saves/${uid}`).get()).data(); res.json({ ok: true, data: cur ? cur.data : null, rev: cur ? cur.rev || 0 : 0, level: cur ? cur.level || 0 : 0 });
    } else if (action === 'linkcode') { // -> a code, valid ten minutes, that lets another device join this identity
      const code = Array.from({ length: 8 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
      await db.doc(`links/${code}`).set({ uid, exp: Date.now() + 10 * 60000 }); res.json({ ok: true, code });
    } else if (action === 'link') { // { code }: this device becomes an alias of the code's identity and receives its save
      const code = String(body.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); if (code.length !== 8) { res.json({ ok: false, error: 'unknown' }); return; }
      const ref = db.doc(`links/${code}`), l = (await ref.get()).data(); if (!l || !(l.exp > Date.now())) { res.json({ ok: false, error: 'unknown' }); return; }
      if (l.uid === uid) { res.json({ ok: false, error: 'self' }); return; }
      await db.doc(`devices/${rawUid}`).set({ primary: l.uid, linkedMs: Date.now() }); await ref.delete();
      const cur = (await db.doc(`saves/${l.uid}`).get()).data(); res.json({ ok: true, data: cur ? cur.data : null });
    } else if (action === 'meter') { // the community meter of the hunt
      const doc = await db.doc(`meters/${week}`).get(); res.json({ ok: true, total: (doc.data() || {}).total || 0 });
    } else if (action === 'fork') { // +n forks in the hunt
      const n = Math.min(20, Math.max(1, Math.floor(Number(body.n) || 1)));
      await db.doc(`meters/${week}`).set({ total: admin.firestore.FieldValue.increment(n) }, { merge: true }); res.json({ ok: true });
    } else res.status(400).json({ error: 'action' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server' }); }
});

// Sunday 23:00 Brussels: close every group of the week, write each player's result (rank, prize, promotion).
exports.closeWeek = onSchedule({ schedule: '0 23 * * 0', timeZone: 'Europe/Brussels', region: 'europe-west1' }, async () => {
  const week = isoWeek(new Date()), ev = eventOfWeek(week), groups = await db.collection('groups').where('week', '==', week).get();
  for (const g of groups.docs) {
    const div = g.data().division, di = DIVISIONS.indexOf(div), snap = await db.collection(`groups/${g.id}/scores`).orderBy('score', 'desc').get();
    let rank = 0; for (const d of snap.docs) { rank++; const prize = rankPrize(rank); const promoted = rank <= 5 && di < DIVISIONS.length - 1, degraded = rank >= 46 && di > 0;
      const next = promoted ? DIVISIONS[di + 1] : degraded ? DIVISIONS[di - 1] : div;
      await db.doc(`results/${d.id}`).set({ week, event: ev, rank, division: div, nextDivision: next, prize, fragment: rank <= 10 ? 1 : 0, claimed: false, closed: admin.firestore.FieldValue.serverTimestamp() });
      await db.doc(`players/${d.id}`).set({ division: next }, { merge: true });
    }
    await g.ref.update({ closed: true });
  }
});
