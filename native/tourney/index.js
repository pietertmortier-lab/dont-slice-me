// Don't Slice Me! Keukentoernooi: the small server behind the weekly ladders.
// One HTTPS Cloud Function ("tourney"): tournament actions, player profiles and friends. v0.32 ghosts and friend requests (review fixes), v0.32.3 duels per day and unlimited friend duels (see README). Firestore as storage, anonymous
// Firebase Auth for identity.
// The game keeps working without it (simulated division); with it, divisions of 50 real players, a weekly close with
// prizes, and plausibility checks on every score. Deploy: see README.md in this folder.
const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { defineSecret } = require('firebase-functions/params');
const LIVEDUEL_VAPID = defineSecret('LIVEDUEL_VAPID'); // v0.32.5: the Web Push key pair (JSON), set once by Pieter with one command; never in the code
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
// played; the reply has no uid. v0.32.3: at most DUEL_DAY_MAX random duels a game day per player (5 free + 2 after a video + 8 duel
// tickets; the client keeps the split), the day of the duel's start like the client. Friend duels are unlimited and never
// public ghosts. Friend duels v2: the challenger's seed and ghost go into challenges/{from}-{to} (v0.32: {a_b}); the first
// duelfind of the friend starts it (status playing, no replays), the friend's score settles it, and a started duel whose
// score never comes counts as 0 after CHALLENGE_PLAY_MS. Only friends whose client knows v2 (profile cv) can be challenged.
// hello counts what waits (requests, open challenges, notes), so a client asks friends only when there is something.
// Friends by name: profiles that a new client marked findable carry nameKey; findplayer answers with name, level, fruit
// and a tag only (no uid, no code), rate limited per player and per address; friendreq / friendans make a request the
// other player accepts; a repeated request sends no new note, a refused one waits a week, requests expire after two weeks.
// FRIEND_SAP is paid once per pair.
const crypto = require('crypto');
const SAVE_HISTORY_DAYS = 7; // v0.32.2: one copy of the save per day, the last 7 days (saves/{uid}/history/{YYYY-MM-DD})
const SERVER_V = 34, CLIENT_V = 32, POLL_V = 33, CAPS = ['find', 'request', 'duel2', 'duel3'], DUEL_DAY_MAX = 15, HOUR_MS = 3600000, GHOST_KEEP = 20, GHOST_DAYS = 3, GHOST_RECENT_MS = 48 * HOUR_MS;
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
const dayOf = t => new Date(t - 7 * 3600000).toISOString().slice(0, 10), dayNow = () => dayOf(Date.now()); // the game's day starts at 07:00
const reqFresh = d => (((d.data && d.data()) || {}).at || 0) > Date.now() - REQ_TTL_MS; // a friend request older than two weeks no longer counts
const clientIp = req => { const xff = String((req.get && req.get('x-forwarded-for')) || '').split(',').map(s => s.trim()).filter(Boolean); return xff.length ? xff[xff.length - 1] : String(req.ip || ''); }; // Google's front end appends the real address last
// ---- v0.32.8 own statistics (Pieter, 11 November 2026: "A, onze eigen telling", no Google Analytics): daily TOTALS only, in
// stats/d_YYYYMMDD (the UTC day: in Belgium from 01:00, in summer 02:00, to the same hour the next day), readable only by the owner's
// Google account (firestore.rules, stats.html). A stats document holds counters only, never a uid, name, address or device. Per player
// only profiles/{uid}.lastStatDay (the UTC day the player was last counted as active, so each player counts once a day). pf: 'app' or
// 'web' from v0.32.8 clients, anything else 'unk'. At most one extra write per call; a stats error (or a write slower than STAT_MS) is
// logged and never fails or blocks the action. The daily knife and ad rewards never reach the server: not counted.
const STAT_MS = 1500, STAT_RUNS_MAX = 300, STAT_LVL_MAX = 50, STAT_BUY_MAX = 5;
const STAT_SKUS = ['sap_3000', 'sap_10000', 'hearts_5', 'doubler_1h', 'coins_5', 'shield', 'pass', 'noads', 'plus_month', 'plus_year', 'tickets_5', 'tickets_15', 'weekpass']; // the client's Google Play product ids (PRODUCTS), and bundle_*
const statDay = t => new Date(t).toISOString().slice(0, 10), statRef = t => db.doc(`stats/d_${statDay(t).replace(/-/g, '')}`);
const statPf = v => v === 'app' || v === 'web' ? v : 'unk';
const statSku = v => { const s = String(v || '').toLowerCase(); return STAT_SKUS.includes(s) || /^bundle_[a-z0-9]{1,16}$/.test(s) ? s : 'other'; };
const statBuys = v => { const o = {}; for (const x of (Array.isArray(v) ? v : []).slice(0, STAT_BUY_MAX)) { const k = 'buyRep_' + statSku(x); o[k] = (o[k] || 0) + 1; o.buyRep = (o.buyRep || 0) + 1; } return o; }; // purchases as REPORTED by a client (never verified here)
function statFields(inc, now) { const o = { day: statDay(now), tz: 'UTC', at: now }; for (const k of Object.keys(inc)) { const n = Math.floor(Number(inc[k]) || 0); if (n > 0) o[k] = admin.firestore.FieldValue.increment(n); } return o; }
function statQuiet(p) { let t = 0; return Promise.race([p, new Promise((_, no) => { t = setTimeout(() => no(new Error('stats: slower than ' + STAT_MS + ' ms')), STAT_MS); })]).finally(() => clearTimeout(t)); } // never hold the action up
async function statBump(inc, opt) { // inc: { field: n } added to today's totals; opt.lvl: a level reached (the day's highest is kept: read, then an update guarded by the read's updateTime)
  const now = Date.now(), ref = statRef(now), lvl = (opt && opt.lvl) || 0, any = Object.keys(inc || {}).some(k => Math.floor(Number(inc[k]) || 0) > 0);
  try {
    if (lvl > 0) for (let i = 0; i < 2; i++) { const snap = await statQuiet(ref.get()), d = snap.data() || {}; if (!(lvl > (d.lvlMax || 0))) break;
      const f = Object.assign(statFields(inc || {}, now), { lvlMax: lvl });
      try { if (snap.exists && snap.updateTime) await statQuiet(ref.update(f, { lastUpdateTime: snap.updateTime })); else await statQuiet(ref.set(f, { merge: true })); return true; }
      catch (e) { if (!(e && (e.code === 9 || e.code === 'failed-precondition' || /FAILED_PRECONDITION/.test(String(e.message))))) throw e; } } // another call wrote meanwhile: read once more, then the counts without the max
    if (any) await statQuiet(ref.set(statFields(inc, now), { merge: true }));
    return true;
  } catch (e) { console.error('stats', (e && e.message) || e); return false; }
}
async function statActive(uid, pf) { // the player's first counted call of the UTC day: active (app / web / unk) and, the very first time, new. One transaction (the marker and the totals together), so a hello and a profile at the same moment count once
  try { const now = Date.now(), day = statDay(now), pref = db.doc(`profiles/${uid}`), k = statPf(pf);
    return await statQuiet(db.runTransaction(async tx => { const p = (await tx.get(pref)).data() || {}; if (p.lastStatDay === day) return false;
      const inc = { act: 1, ['act_' + k]: 1 }; if (!p.lastStatDay && (!p.code || (p.firstMs > 0 && statDay(p.firstMs) === day))) Object.assign(inc, { nw: 1, ['nw_' + k]: 1 }); // new: never counted, and no profile yet (or its Firebase account was made today: a first day that fell in a stats outage)
      tx.set(statRef(now), statFields(inc, now), { merge: true }); tx.set(pref, { lastStatDay: day }, { merge: true }); return true; }));
  } catch (e) { console.error('stats', (e && e.message) || e); return false; }
}
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
  await batch.commit(); await statBump({ fr: 1 }); return { friend: profileView(other, op), reward: meOk ? FRIEND_SAP : 0 }; // v0.32.8 stats
}
async function freshRequests(uid) { // the requests that wait for uid; stale ones (older than REQ_TTL_MS) are deleted on the way
  const snap = await db.collection(`requests/${uid}/in`).limit(REQ_IN_MAX * 2).get(), keep = [], old = [];
  for (const d of snap.docs) (reqFresh(d) ? keep : old).push(d);
  if (old.length) { const b = db.batch(); for (const d of old) { b.delete(d.ref); b.delete(db.doc(`requests/${d.id}/out/${uid}`)); } await b.commit(); }
  return keep;
}
async function duelSlot(uid, startedAt, withGhost) { // v0.32.3: the daily random-duel limit (DUEL_DAY_MAX a game day, the day of the duel's start like the client) and the ghost slot; friend duels never come here
  const ref = db.doc(`duelwin/${uid}`), day = dayOf(startedAt);
  return db.runTransaction(async tx => { const d = (await tx.get(ref)).data() || {}, gk = d.gk || 0; let cur = typeof d.day === 'string' ? d.day : '', n = d.n || 0;
    if (!cur || day > cur) { cur = day; n = 0; } // a new day (an old hourly doc has no day); a late post from the day before counts in the current one
    if (n >= DUEL_DAY_MAX) return { ok: false, k: -1 };
    tx.set(ref, { day: cur, n: n + 1, gk: gk + (withGhost ? 1 : 0) }); return { ok: true, k: gk % GHOST_KEEP }; });
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
  if (x) { const theirs = x.fromScore || 0, day = dayNow(); try { await db.runTransaction(tx => ldRecordTx(tx, x.from, x.to, { s: theirs, t: x.t || 0 }, { s: 0, t: 0, forfeit: true }, 'chal', now)); } catch (e) { console.error('ldrecord', e); } /* v0.32.5: a forfeit is a loss in the record, never a counted win */ await Promise.all([noteTo(x.from, { type: 'duel', ch: 'from', forfeit: true, vs: x.toName || 'vriend', won: theirs > 0, tie: theirs === 0, score: theirs, theirs: 0, hat: LOSER_HAT, day }), noteTo(x.to, { type: 'duel', ch: 'to', forfeit: true, vs: x.fromName || 'vriend', won: false, tie: theirs === 0, score: 0, theirs, hat: LOSER_HAT, day })]); } // v0.32.3: ch says whose note it is
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
const profileView = (id, p) => p ? ({ uid: id, name: String(p.name || 'Fruit').slice(0, 16), level: p.level || 1, best: p.best || 0, fruits: Array.isArray(p.fruits) ? p.fruits : [], hat: p.hat || 'none', streak: p.streak || 0, runs: p.runs || 0, stamps: p.stamps || 0, division: p.division || '', weekKey: p.weekKey || '', weekEv: p.weekEv || '', weekScore: p.weekScore || 0, kitchen: p.kitchen && typeof p.kitchen === 'object' ? p.kitchen : null, last: p.updatedMs || 0, v2: (p.cv || 0) >= CLIENT_V, v3: (p.pv || 0) >= POLL_V }) : null; // v0.32: v2 = the friend's client plays friend duels v2; v0.32.3: v3 = it also polls and shows a challenge as an in-game card
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

// ---- v0.32.5 live friend duels (Pieter, 9 November 2026): invite a friend, accept / not now / refuse, a small lobby, a 2-minute return
// window with a push to whoever is not there, an automatic 15 s countdown or the host's start, a synchronized start on the server clock,
// both runs live (positions and score every 3 s), the result from both server-checked scores, the head-to-head record (h2h) and the counted
// wins (duelstats, farm-resistant) for a later milestone ladder, for live duels and 24 h challenges alike. No realtime listeners and no
// scheduler: the lobby state is derived from timestamps, so the 2-minute rule holds even when nobody polls; whoever calls writes it.
// The beats can carry timed events, stamped on the shared duel clock (reserved for duel powers; LD_POWERS is empty and ldPowerOk refuses).
const LD_INV_MS = 10 * 60000, LD_RETURN_MS = 120000, LD_PUSH_AFTER_MS = 15000, LD_CHK_MS = 10000, LD_COUNT_MS = 90000, LD_GO_MS = 6000, LD_LATE_MS = 15000, LD_RUN_MS = 90000;
const LD_PAUSE_MS = 60000, LD_GRACE_MS = 20000, LD_SEAT_MAX_MS = 240000, LD_IN_MS = 8000, LD_SEEN_LOBBY_MS = 4000, LD_SEEN_WRITE_MS = 25000, LD_HERE_MS = 50000, LD_BUSY_HERE_MS = 75000, LD_ON_MS = 90000;
const LD_RESUME_MIN_MS = 20000, LD_OPT_MIN_MS = 30000; // v0.32.8: 90 s to pick a fruit (Pieter); a count that resumes after a drop keeps its time left (at least 20 s); the host's options leave at least 30 s
const LD_LOBBY_MAX_MS = 15 * 60000, LD_KEEP_MS = 86400000, LD_SETTLE_POLL_MS = 110000;
const LD_INV_HOUR = 10, LD_SAME_MS = 120000, LD_NO_MS = 30 * 60000, LD_NO_DAY = 2, LD_AGAIN_MS = 5 * 60000, LD_PTS = 30, LD_PUSH_IN_HOUR = 3, LD_QUIET_FROM = 21, LD_QUIET_TO = 8, LD_PUSH_WAIT_MS = 2500, LD_PUSH_DAYS = 60, LD_PUSH_FAILS = 5, LD_MISS_MAX = 2, LD_MISS_MS = 30 * 60000;
const LD_MIN_T = 30000, LD_MIN_SCORE = 5, LD_FRIEND_MS = 24 * HOUR_MS, LD_NEW_MS = 7 * 86400000, LD_MIN_LEVEL = 15, LD_ACT_DAYS = 3, LD_PAIR_DAY = 3, LD_WIN_DAY = 10; // counted wins (Pieter's decision)
const LD_POWERS = [], LD_EV_MAX = 3, LD_EV_LEAD_MIN = 2500, LD_EV_LEAD_MAX = 15000; // a power later: { k: 'zwaarte', maxDur: 4000 }; none exists yet
const LD_FRUITS = ['appel', 'druif', 'aardbei', 'kersen', 'citroen', 'kiwi', 'banaan', 'kokosnoot', 'sinaasappel', 'pruim', 'avocado', 'watermeloen', 'ananas', 'mandarijn', 'durian', 'granaatappel', 'drakenvrucht', 'lychee', 'stervrucht', 'passievrucht']; // the 20 classic fruits (the client's ORDER), lent for the round
const LD_PUSH_SUBJECT = 'mailto:dont.slice.me@gmail.com', LD_PUSH_HOSTS = /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9-]+\.push\.apple\.com|[a-z0-9-]+\.notify\.windows\.com)$/;
const LD_DEAD = new Set([404, 410, 'messaging/registration-token-not-registered', 'messaging/invalid-registration-token']); // only these remove a subscription at once
const LD_BAD = c => (typeof c === 'number' && c >= 400 && c < 500 && c !== 429) || c === 'messaging/mismatched-credential' || c === 'messaging/invalid-argument'; // a refusal by the push service (not a timeout, a 5xx or a rate limit): counted per subscription
const ldId = () => Array.from({ length: 12 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
const ldClean = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
const ldPair = (a, b) => [a, b].sort().join('_');
const msOf = v => typeof v === 'number' ? v : v && typeof v.toMillis === 'function' ? v.toMillis() : 0; // friends.since is a Firestore Timestamp (a number in the mock)
const ldDay = t => new Date(t - 7 * 3600000).toLocaleDateString('en-CA', { timeZone: 'Europe/Brussels' }); // the game day for counted wins starts at 07:00 Belgian time (Pieter's decision)
const ldFruit = v => LD_FRUITS.includes(String(v || '')) ? String(v) : 'appel';
const ldPw = v => (Array.isArray(v) ? v : []).map(k => String(k).replace(/[^a-z0-9]/g, '').slice(0, 16)).filter(Boolean).slice(0, 12); // the power kinds a client knows (none in v0.32.5)
const ldQuietAt = (tz, now) => { const h = new Date(now + clampInt(tz, -840, 840) * 60000).getUTCHours(); return h >= LD_QUIET_FROM || h < LD_QUIET_TO; }; // 21:00-08:00 on the player's own phone
const ldHere = (p, now) => (p.ldSeen || 0) > now - LD_HERE_MS || (!!p.ldBusy && (p.ldSeen || 0) > now - LD_BUSY_HERE_MS); // the app is open (a menu, or a run that pings less often)
const ldOnline = (p, now) => (p.lv || 0) >= 1 && !p.ldHide && (p.ldSeen || 0) > now - LD_ON_MS; // what friends may see: never for a player who hides it
const ldPushable = (p, now) => (p.lv || 0) >= 1 && (p.ldPuUntil || 0) > now && !ldQuietAt(p.ldTz, now);
const ldPuOf = subs => subs.filter(s => s.inv !== false).reduce((m, s) => Math.max(m, s.until || 0), 0);
function ldShift(p, now) { const day = ldDay(now); let b = p.actBits || 0; if (p.actDay !== day) { const sh = p.actDay ? Math.round((Date.parse(day) - Date.parse(p.actDay)) / 86400000) : 14; b = sh >= 14 || sh < 0 ? 0 : (b << sh) & 0x3fff; } return { day, b }; } // the 14 game days of real play, bit 0 = today
function ldPlayed(p, now) { const x = ldShift(p, now); if (p.actDay === x.day && (x.b & 1)) return null; return Object.assign({ actDay: x.day, actBits: x.b | 1 }, p.actFrom ? {} : { actFrom: x.day }); } // the fields to merge, or null when today is already marked; actFrom: the game day this profile's record began
function ldActive(p, now) { let b = ldShift(p, now).b, n = 0; for (; b; b &= b - 1) n++; return n; } // played game days among the last 14
function ldActNeed(p, now) { const d = p.actFrom ? Math.round((Date.parse(ldDay(now)) - Date.parse(p.actFrom)) / 86400000) + 1 : 1; return Math.max(1, Math.min(LD_ACT_DAYS, d)); } // the played days exist only since v0.32.5: on a profile's first and second recorded day 1 and 2 played days are enough (else no win could count right after the update)
async function ldMark(uid) { try { const ref = db.doc(`profiles/${uid}`), p = (await ref.get()).data(); if (!p) return; const f = ldPlayed(p, Date.now()); if (f) await ref.set(f, { merge: true }); } catch (e) {} } // real play only: a duel, a tournament run, a live final, a profile whose runs rose; never hello
async function ldFirstMs(uid, now) { try { const u = await admin.auth().getUser(uid), t = Date.parse(u.metadata.creationTime); return t > 0 && t <= now ? t : 0; } catch (e) { return 0; } } // when the anonymous Firebase account was made; 0 = unknown (retried later)
function ldPowerOk(l, meI, k, have, now) { return false; } // reserved: the duel-powers build checks here that the sender owns power k (the server's own record), its stars, charge and cooldown; until then no event is accepted
let ldWebPush = null; try { ldWebPush = require('web-push'); } catch (e) {} // optional: without it (or without the secret) only the app's FCM pushes go out
let ldVapidV = null;
function ldVapid() { // the VAPID key pair from the Firebase secret LIVEDUEL_VAPID (the JSON of `web-push generate-vapid-keys --json`); null when not set
  if (ldVapidV) return ldVapidV; let v = ''; try { v = LIVEDUEL_VAPID.value(); } catch (e) {}
  try { const j = JSON.parse(String(v || '').trim()); if (j && j.publicKey && j.privateKey) ldVapidV = { publicKey: String(j.publicKey), privateKey: String(j.privateKey) }; } catch (e) {}
  return ldVapidV;
}
// -- the lobby: a seat's state comes from its timestamps only
function ldSeat(l, s, now) { // in, since when it is away, and whether the 2-minute rule removes it now
  const isIn = !s.left && !!s.joined && now - (s.seen || 0) <= LD_IN_MS;
  const pushed = s.pushAt && (l.pn || {})[s.uid] !== 0 ? s.pushAt : 0; // a push that went out (or is going out: pn not written yet); 0 when no device took it
  const from = s.left ? (s.leftAt || now) : Math.max(s.joined ? (s.seen || 0) + LD_IN_MS : (l.created || 0), pushed); // never joined (the inviter): from the lobby's creation; a push that went out later restarts the 2 minutes, so "Je hebt 2 minuten" is always true
  return { isIn, from, gone: s.left ? 'left' : !isIn && now - from >= LD_RETURN_MS ? 'late' : '' };
}
function ldEval(l, now, ro) { // mutates l; returns true when it changed. ro (read-only callers): only the removals and the closing, never a countdown or a start
  if (l.res || !['wait', 'count'].includes(l.state)) return false; let ch = false;
  if (now - (l.created || 0) > LD_LOBBY_MAX_MS) { l.state = 'closed'; l.closedWhy = 'late'; l.closedAt = now; return true; }
  const gone = l.m.map(s => [s, ldSeat(l, s, now).gone]).filter(g => g[1]);
  if (gone.length) { l.m = l.m.filter(s => !gone.some(g => g[0] === s)); l.kicked = (l.kicked || []).concat(gone.map(([s, why]) => ({ uid: s.uid, name: s.name, why, at: now }))); ch = true; // Pieter: after 2 minutes whoever has not (re)joined is removed
    if (l.m.length < (l.min || 2)) { l.state = 'closed'; l.closedWhy = gone.some(g => g[1] === 'left') ? 'left' : 'late'; l.closedAt = now; return true; } } // 1-on-1: closes for both; a later pool keeps going with whoever is left
  if (ro) return ch;
  const allIn = l.m.every(s => ldSeat(l, s, now).isIn);
  if (l.state === 'wait' && allIn) { l.state = 'count'; l.countEnd = now + ((l.countLeft || 0) > 0 ? Math.max(LD_RESUME_MIN_MS, l.countLeft) : LD_COUNT_MS); l.countLeft = 0; ch = true; } // v0.32.8: a count that was interrupted resumes with its time left (at least 20 s), never a fresh 90 s
  else if (l.state === 'count' && !allIn) { l.state = 'wait'; l.countLeft = Math.max(1, (l.countEnd || 0) - now); l.countEnd = 0; ch = true; }
  if (l.state === 'count' && (now >= l.countEnd || l.m.every(s => (s.rd || 0) > 0))) { /* v0.32.8: the time is up, or every seat tapped Klaar */ const same = String((l.opts && l.opts.fruit) || '').startsWith('same:') ? ldFruit(l.opts.fruit.slice(5)) : '';
    l.state = 'go'; l.startAt = now + LD_GO_MS; l.seed = 'L' + ldId().slice(0, 10); for (const s of l.m) s.fruit = same || ldFruit(s.fruit); ch = true; } // the fruits are locked here
  return ch;
}
const ldRo = (l, now) => { const c = Object.assign({}, l, { m: (l.m || []).map(s => Object.assign({}, s)), kicked: (l.kicked || []).slice() }); ldEval(c, now, true); return c; };
const ldAlive = (l, now) => !!l && !l.res && (['wait', 'count'].includes(l.state) || (l.state === 'go' && now < (l.startAt || 0) + LD_SEAT_MAX_MS + LD_LATE_MS + LD_GRACE_MS)); // call on an evaluated copy (ldRo)
const LD_TEXT = { // the push text: only the friend's display name, no other personal data (FCM needs it on the server; the web gets the same keys and builds it in sw.js)
  nl: { ldinv: n => [`${n} daagt je uit voor een live duel`, 'Tik om te antwoorden. De uitnodiging loopt 10 minuten.'], ldlobby: n => [`${n} zit in de lobby!`, 'Je hebt 2 minuten om terug te komen.'] },
  en: { ldinv: n => [`${n} challenges you to a live duel`, 'Tap to answer. The invite is open for 10 minutes.'], ldlobby: n => [`${n} is in the lobby!`, 'You have 2 minutes to come back.'] } };
async function ldPushTo(uid, msg) { // msg { k: 'ldinv' | 'ldlobby', n, id, exp }; every allowed device at once, waiting at most LD_PUSH_WAIT_MS; returns how many the push services accepted
  const ref = db.doc(`ldpush/${uid}`), d = (await ref.get()).data(), now = Date.now(), all = d && Array.isArray(d.subs) ? d.subs : [];
  const subs = all.filter(s => (s.until || 0) > now && !(msg.k === 'ldinv' && (s.inv === false || ldQuietAt(s.tz, now)))); if (!subs.length) return 0; // no invite pushes at night on that phone
  if (msg.k === 'ldinv' && !(await rateOk(`ldpushin_${uid}`, LD_PUSH_IN_HOUR, HOUR_MS))) return 0; // at most 3 invite pushes an hour to one player, from all friends together
  const ttl = Math.max(30, Math.min(600, Math.round(((msg.exp || now + 120000) - now) / 1000))), v = ldVapid(), dead = [], bad = [], good = []; let n = 0;
  const one = async s => { const lang = s.lang === 'en' ? 'en' : 'nl', L = LD_TEXT[lang][msg.k](playerName(msg.n));
    try {
      if (s.kind === 'web') { if (!ldWebPush || !v) return; await ldWebPush.sendNotification({ endpoint: s.ep, keys: s.keys }, JSON.stringify({ v: 1, k: msg.k, n: playerName(msg.n), id: msg.id, exp: msg.exp, lang }), { TTL: ttl, urgency: 'high', topic: 'ld' + msg.id, timeout: LD_PUSH_WAIT_MS, vapidDetails: { subject: LD_PUSH_SUBJECT, publicKey: v.publicKey, privateKey: v.privateKey } }); n++; if (s.fail) good.push(s); }
      else if (s.kind === 'fcm') { await admin.messaging().send({ token: s.tok, notification: { title: L[0], body: L[1] }, data: { k: msg.k, id: msg.id, n: playerName(msg.n), exp: String(msg.exp || 0) }, android: { priority: 'high', ttl: ttl * 1000, collapseKey: 'ld' + msg.id, notification: { tag: 'ld' + msg.id, channelId: 'liveduel' } } }); n++; if (s.fail) good.push(s); }
    } catch (e) { const c = e && (e.statusCode || (e.errorInfo && e.errorInfo.code) || e.code); if (LD_DEAD.has(c)) dead.push(s); else { if (LD_BAD(c)) bad.push(s); console.error('ldpush', c || e); } } };
  await Promise.race([Promise.allSettled(subs.map(one)), new Promise(r => setTimeout(r, LD_PUSH_WAIT_MS))]); // the reply never waits longer than 2.5 s (the client waits 5-6 s); a late answer is not counted
  const got = n, drop = dead.concat(bad.filter(s => (s.fail || 0) + 1 >= LD_PUSH_FAILS)); // answers that came in time only
  if (drop.length || bad.length || good.length) { const keep = all.filter(s => !drop.includes(s)).map(s => bad.includes(s) ? Object.assign({}, s, { fail: (s.fail || 0) + 1 }) : good.includes(s) ? Object.assign({}, s, { fail: 0 }) : s); // a push service that keeps refusing this subscription (a changed key pair: 403): dropped after LD_PUSH_FAILS in a row, so friends stop reading "krijgt een melding"
    await Promise.all([ref.set({ subs: keep, expireAt: new Date(keep.reduce((m, s) => Math.max(m, s.until || 0), now)) })].concat(drop.length ? [db.doc(`profiles/${uid}`).set({ ldPuUntil: ldPuOf(keep) }, { merge: true })] : [])); }
  return got;
}
function ldView(l, uid, now, started) { // what a member sees of the lobby: seats by name (the other one's uid only because you are friends), never a uid of anyone else
  const meI = (l.m || []).findIndex(s => s.uid === uid), kicked = (l.kicked || []).find(k => k.uid === uid), pn = l.pn || {}, go = ['go', 'done'].includes(l.state) || !!l.res, duo = (l.cap || 2) <= 2; // duo: a 1-on-1 lobby exists only between friends; a later pool sends no uid until it checks the friendship per seat
  return { v: 2, id: l.id || '', state: l.res ? 'done' : l.state, host: l.host === uid, me: meI, cap: l.cap || 2, min: l.min || 2, opts: Object.assign({ powers: false, fruit: 'any', level: 10, ms: LD_RUN_MS }, l.opts || {}), countEnd: l.countEnd || 0, startAt: l.startAt || 0, seed: go ? l.seed || '' : '',
    why: l.closedWhy || '', kickedMe: kicked ? kicked.why : '', gone: (l.kicked || []).filter(k => k.uid !== uid).map(k => ({ name: k.name, why: k.why, fid: duo ? k.uid : '' })), started: !!started,
    m: (l.m || []).map((s, i) => { const st = ldSeat(l, s, now); return { name: s.name, fruit: s.fruit || '', role: s.role, me: i === meI, fid: i === meI || !duo ? '' : s.uid, in: st.isIn, away: st.isIn ? 0 : st.from + LD_RETURN_MS, joined: !!s.joined, left: !!s.left, pushed: (pn[s.uid] || 0) > 0, nopush: !!s.pushAt && pn[s.uid] === 0, rd: (s.rd || 0) > 0, v: s.v || 0 }; }), // v0.32.8: rd = tapped Klaar; v = the seat's client protocol (2: has Klaar)
    res: l.res ? ldResView(l.res, meI) : null };
}
const ldStatOf = S => ({ won: S.won || 0, wins: S.wins || 0, losses: S.losses || 0, draws: S.draws || 0, played: S.played || 0, distinct: S.distinct || 0 });
function ldResView(r, meI) { // the result for one member: me / them, my verdict, the record from my side, whether my win counted, my stats after it
  if (r.kind === 'noshow') return { r: 'noshow', who: r.who === -1 ? 'both' : r.who === meI ? 'me' : 'them', chal: !!r.chal };
  const me = meI === 1 ? r.b : r.a, them = meI === 1 ? r.a : r.b, win = r.win === -1 ? 'draw' : r.win === meI ? 'win' : 'loss', st = ldStatOf((meI === 1 ? r.stB : r.stA) || {});
  return { r: win, me, them, counted: win === 'win' && !!r.counted, why: win === 'win' ? r.why || '' : '', rec: meI === 1 ? { w: r.rec.bw, l: r.rec.aw, d: r.rec.d } : { w: r.rec.aw, l: r.rec.bw, d: r.rec.d }, won: st.won, st };
}
const ldStatView = d => ldStatOf((d && d.data && d.data()) || {});
// -- record and counted wins, for every friend duel (live and the 24 h challenge); inside a transaction: 7 reads first, then the writes
async function ldRecordTx(tx, a, b, fa, fb, kind, now) { // f = { s, t, quit?, cut?, forfeit? }
  const refs = [db.doc(`h2h/${ldPair(a, b)}`), db.doc(`duelstats/${a}`), db.doc(`duelstats/${b}`), db.doc(`profiles/${a}`), db.doc(`profiles/${b}`), db.doc(`friends/${a}/of/${b}`), db.doc(`friends/${b}/of/${a}`)], docs = [];
  for (const r of refs) docs.push(await tx.get(r));
  const P = docs[0].data() || {}, SA = docs[1].data() || {}, SB = docs[2].data() || {}, PA = docs[3].data() || {}, PB = docs[4].data() || {}, first = [a, b].sort()[0] === a, sa = fa.s || 0, sb = fb.s || 0;
  const win = sa > sb ? 0 : sb > sa ? 1 : -1, W = win === 0 ? a : win === 1 ? b : '', fl = win === 0 ? fb : fa, pl = win === 0 ? PB : PA, SW = win === 0 ? SA : SB, fr = win === 0 ? docs[5] : docs[6];
  const day = ldDay(now), pairN = P.day === day ? P.dayN || 0 : 0, winN = SW.day === day ? SW.dayN || 0 : 0, since = fr.exists ? msOf((fr.data() || {}).since) : 0;
  const why = win === -1 ? 'draw' : fl.forfeit ? 'forfeit' : fl.quit || fl.cut ? 'quit' : (fl.t || 0) < LD_MIN_T ? 'short' : (fl.s || 0) < LD_MIN_SCORE ? 'low'
    : !fr.exists || now - since < LD_FRIEND_MS ? 'fresh' : !(pl.firstMs > 0) || now - pl.firstMs < LD_NEW_MS ? 'new' : (pl.level || 1) < LD_MIN_LEVEL ? 'level'
    : ldActive(pl, now) < ldActNeed(pl, now) ? 'idle' : pairN >= LD_PAIR_DAY ? 'pair' : winN >= LD_WIN_DAY ? 'day' : '';
  const counted = win !== -1 && !why;
  const aw = (first ? P.aw : P.bw) || 0, bw = (first ? P.bw : P.aw) || 0, ac = (first ? P.ac : P.bc) || 0, bc = (first ? P.bc : P.ac) || 0; // the stored pair is ordered by uid; a/b are the caller's order
  const rec = { aw: aw + (win === 0 ? 1 : 0), bw: bw + (win === 1 ? 1 : 0), d: (P.d || 0) + (win === -1 ? 1 : 0) }, acN = ac + (counted && win === 0 ? 1 : 0), bcN = bc + (counted && win === 1 ? 1 : 0);
  tx.set(refs[0], Object.assign({ a: first ? a : b, b: first ? b : a, d: rec.d, day, dayN: pairN + (counted ? 1 : 0), last: { at: now, kind, sa: first ? sa : sb, sb: first ? sb : sa } }, first ? { aw: rec.aw, bw: rec.bw, ac: acN, bc: bcN } : { aw: rec.bw, bw: rec.aw, ac: bcN, bc: acN }));
  const stat = (S, me, mine) => ({ won: (S.won || 0) + (counted && W === me ? 1 : 0), wins: (S.wins || 0) + (W === me ? 1 : 0), losses: (S.losses || 0) + (W && W !== me ? 1 : 0), draws: (S.draws || 0) + (win === -1 ? 1 : 0), played: (S.played || 0) + 1,
    distinct: (S.distinct || 0) + (counted && W === me && mine === 0 ? 1 : 0), day, dayN: (S.day === day ? S.dayN || 0 : 0) + (counted && W === me ? 1 : 0) }); // distinct: a first counted win against this friend
  const stA = stat(SA, a, ac), stB = stat(SB, b, bc); tx.set(refs[1], stA); tx.set(refs[2], stB);
  if (docs[5].exists) tx.set(refs[5], { w: rec.aw, l: rec.bw, d: rec.d }, { merge: true }); // the mirror on the friendship (never creates one)
  if (docs[6].exists) tx.set(refs[6], { w: rec.bw, l: rec.aw, d: rec.d }, { merge: true });
  return { win, counted, why, rec, stA: ldStatOf(stA), stB: ldStatOf(stB) };
}
// -- the run: when a seat is decided, and the settle (exactly once)
function ldSeatEnd(l, s, x, now) { // 'fin' | 'dead' (its last beat counts) | 'none' (never started) | 'wait' (may still start) | 'play'
  if (x && x.fin) return 'fin';
  if (x && x.go) return now - (x.go || 0) > LD_SEAT_MAX_MS || now - (x.at || 0) > Math.max(0, LD_PAUSE_MS - (x.pause || 0)) + LD_GRACE_MS ? 'dead' : 'play';
  return s.left || now > (l.startAt || 0) + LD_LATE_MS ? 'none' : 'wait';
}
async function ldSettle(id, now) {
  const lref = db.doc(`ldlobby/${id}`);
  const out = await db.runTransaction(async tx => {
    const l = (await tx.get(lref)).data(); if (!l) return null; if (l.res) return { l };
    if (l.state !== 'go' || (l.m || []).length !== 2) return null;
    const [A, B] = l.m, a = (await tx.get(db.doc(`ldlobby/${id}/live/${A.uid}`))).data() || null, b = (await tx.get(db.doc(`ldlobby/${id}/live/${B.uid}`))).data() || null;
    const ea = ldSeatEnd(l, A, a, now), eb = ldSeatEnd(l, B, b, now); if (['wait', 'play'].includes(ea) || ['wait', 'play'].includes(eb)) return null; // somebody can still start or is still playing
    let res, note = null;
    if (ea === 'none' || eb === 'none') { // the approved rule: the one who played gets his run sent as an ordinary 24 h challenge
      const who = ea === 'none' && eb === 'none' ? -1 : ea === 'none' ? 0 : 1; let chal = '';
      if (who >= 0) { const P = who === 0 ? B : A, N = who === 0 ? A : B, x = who === 0 ? b : a;
        if (x && x.fin && !x.fin.quit && x.gh) { const cid = `${P.uid}-${N.uid}`, cref = db.doc(`challenges/${cid}`), cur = (await tx.get(cref)).data(), fd = await tx.get(db.doc(`friends/${P.uid}/of/${N.uid}`));
          if (fd.exists && !(cur && chalLive(cur, now))) { tx.set(cref, { from: P.uid, to: N.uid, fromName: P.name, toName: N.name, seed: l.seed, ghost: x.gh, t: x.gt || x.fin.t, fromScore: x.fin.s, fromFruit: P.fruit, level: 10, status: 'open', created: now, expires: now + CHALLENGE_MS, live: 1, lobby: id }); chal = cid; note = { to: N.uid, by: P.name, id: cid }; } } }
      res = { kind: 'noshow', who, chal: !!chal };
    } else {
      const fin = x => x.fin ? { s: x.fin.s, t: x.fin.t, quit: !!x.fin.quit, died: !!x.fin.died } : { s: x.s || 0, t: x.t || 0, cut: true }, fa = fin(a), fb = fin(b), r = await ldRecordTx(tx, A.uid, B.uid, fa, fb, 'live', now);
      res = { kind: 'live', a: Object.assign({ name: A.name }, fa), b: Object.assign({ name: B.name }, fb), win: r.win, counted: r.counted, why: r.why, rec: r.rec, stA: r.stA, stB: r.stB };
    }
    tx.update(lref, { res, state: 'done', doneAt: now }); return { l: Object.assign({}, l, { res, state: 'done', doneAt: now }), note, fresh: res.kind };
  });
  if (out && out.fresh) await statBump(out.fresh === 'live' ? { ldFin: 1 } : { ldNo: 1 }); // v0.32.8 stats: only the call that wrote the result counts
  if (out && out.note) { try { await noteTo(out.note.to, { type: 'challenge', v: 2, by: out.note.by, id: out.note.id }); } catch (e) {} } // the friend's existing challenge card (v0.32.3)
  return out ? out.l : null;
}
function ldPts(p) { const a = (Array.isArray(p) ? p : []).slice(0, LD_PTS * 3).map(v => Math.round(Number(v) || 0)); for (let i = 0; i < a.length; i += 3) { a[i] = Math.max(-50, Math.min(410, a[i])); a[i + 1] = Math.max(-50, Math.min(1050, a[i + 1])); a[i + 2] = Math.max(0, Math.min(1e6, a[i + 2] || 0)); } return a.slice(0, a.length - a.length % 3); }
function ldEvents(l, meI, mine, body, now) { // reserved for duel powers: an accepted event is stamped on the shared duel clock (server time since startAt) and relayed to the other phone
  const have = Array.isArray(mine.ev) ? mine.ev.slice() : [], ok = [], no = [];
  for (const e of (Array.isArray(body.ev) ? body.ev : []).slice(0, LD_EV_MAX * 2)) {
    if (!e || typeof e !== 'object') continue;
    const i = clampInt(e.i, 1, 99), k = String(e.k || '').replace(/[^a-z0-9]/g, '').slice(0, 16), lead = clampInt(e.lead, 0, 60000), dur = clampInt(e.dur, 0, 60000), P = LD_POWERS.find(x => x.k === k);
    if (have.some(x => x.i === i)) { if (!ok.includes(i)) ok.push(i); continue; } // a retried beat repeats an accepted event: no duplicate
    const why = !(l.opts && l.opts.powers === true) ? 'off' : !P || !l.m.every(s => ldPw(s.pw).includes(k)) ? 'kind' : !ldPowerOk(l, meI, k, have, now) ? 'own' : have.length >= LD_EV_MAX ? 'max'
      : lead < LD_EV_LEAD_MIN || lead > LD_EV_LEAD_MAX ? 'lead' : dur < 500 || dur > P.maxDur ? 'dur' : mine.fin || mine.dead || body.dead ? 'dead' : '';
    if (why) no.push({ i, why }); else { have.push({ i, k, at: (now - (l.startAt || 0)) + lead, dur, to: e.to === 'self' ? 'self' : 'opp', sAt: now, got: 0 }); ok.push(i); } } // got: reserved (when the target first received it, for the 5 s lapse rule)
  return { ev: have, ok, no };
}
const ldOther = (o, s, l, now) => Object.assign({ name: s.name, fruit: s.fruit || 'appel', left: !!s.left }, o && o.go ? { go: o.go, k0: o.k0 || 0, p: Array.isArray(o.p) ? o.p : [], t: o.t || 0, s: o.s || 0, dead: !!o.dead, pz: !!o.pz, fin: o.fin || null, at: o.at || 0, ev: Array.isArray(o.ev) ? o.ev : [], late: false } : { go: 0, k0: 0, p: [], t: 0, s: 0, dead: false, pz: false, fin: null, at: 0, ev: [], late: now > (l.startAt || 0) + LD_LATE_MS });
async function ldAction(action, uid, body, req, res, rawUid) { // every live-duel action; returns false for an action that is not ours. Every reply carries the server time (now)
  const now = Date.now(), J = o => { res.json(Object.assign({ now }, o)); return true; }, NO = (error, x) => J(Object.assign({ ok: false, error }, x || {}));
  if (['ldcancel', 'ldanswer', 'ldlobby', 'ldset', 'ldbeat', 'ldend', 'ldres'].includes(action) && !ldClean(body.id)) return NO('gone'); // an empty id is no document path
  if (action === 'ldpoll') { // { busy, lang, hide } -> { inv, out, lobby }: presence (written at most every LD_SEEN_WRITE_MS), my invite inbox, my invite, my lobby
    const pref = db.doc(`profiles/${uid}`), p = (await pref.get()).data() || {}, busy = !!body.busy, hide = !!body.hide, upd = {};
    if (!((p.ldSeen || 0) > now - LD_SEEN_WRITE_MS) || !!p.ldBusy !== busy || !!p.ldHide !== hide) Object.assign(upd, { ldSeen: now, ldBusy: busy, ldHide: hide });
    if ((p.lv || 0) < 1) upd.lv = 1;
    let inv = null, out = null, lobby = null;
    if (p.ldIn && p.ldIn.id) { if ((p.ldIn.exp || 0) > now) inv = { id: p.ldIn.id, name: playerName(p.ldIn.name), exp: p.ldIn.exp, again: !!p.ldIn.again, fid: p.ldIn.from || '' }; else upd.ldIn = null; }
    if (p.ldOut) { const x = (await db.doc(`ldinv/${p.ldOut}`).get()).data(); if (!x) upd.ldOut = ''; else { const st = x.state === 'open' && (x.exp || 0) <= now ? 'gone' : x.state; out = { id: p.ldOut, name: playerName(x.toName), fid: x.to, state: st, exp: x.exp || 0, lobby: x.lobby || '' }; if (st !== 'open') upd.ldOut = ''; } }
    if (p.ldLobby) { const id = p.ldLobby; let l = (await db.doc(`ldlobby/${id}`).get()).data();
      if (l && l.state === 'go' && !l.res && (l.m || []).some(s => s.uid === uid) && now >= (l.startAt || 0) + LD_SETTLE_POLL_MS) { const s2 = await ldSettle(id, now); if (s2) l = s2; } // a duel nobody reports any more is settled by a member's poll
      if (l) { const c = ldRo(l, now); c.id = id; let started = false; if (c.state === 'go' && !c.res && c.m.some(s => s.uid === uid)) started = (await db.doc(`ldlobby/${id}/live/${uid}`).get()).exists;
        lobby = ldView(c, uid, now, started); if (c.res && c.res.kind === 'live') { const o = c.m.find(s => s.uid !== uid); if (o) upd.ldDone = { with: o.uid, at: now }; } }
      if (!l || !ldAlive(ldRo(l, now), now)) upd.ldLobby = ''; } // a dead, done or closed lobby is reported once, then the pointer clears
    if (Object.keys(upd).length) await pref.set(upd, { merge: true });
    return J({ ok: true, inv, out, lobby });
  }
  if (action === 'ldfriends') { // -> { on: [{ uid, lv, on, busy, pu }] }: the green dots while Vrienden is open (friends only)
    const list = await db.collection(`friends/${uid}/of`).get(), docs = list.docs.length ? await db.getAll(...list.docs.map(d => db.doc(`profiles/${d.id}`))) : [];
    return J({ ok: true, on: docs.filter(d => d.exists).map(d => { const p = d.data(); return { uid: d.id, lv: (p.lv || 0) >= 1, on: ldOnline(p, now), busy: !!p.ldBusy && ldOnline(p, now), pu: ldPushable(p, now) }; }) });
  }
  if (action === 'ldinvite') { // { to, again } -> { id, exp, here, pushed } | { ok: false, error, ... }; one transaction, so crossing or simultaneous invites can never both pass
    const to = String(body.to || '').slice(0, 128); if (!to || to === uid || to.includes('/')) { res.status(400).json({ error: 'uid', now }); return true; }
    const mref = db.doc(`profiles/${uid}`), oref = db.doc(`profiles/${to}`), lim = db.doc(`limits/ldinv_${uid}`);
    const out = await db.runTransaction(async tx => {
      const fd = await tx.get(db.doc(`friends/${uid}/of/${to}`)), md = await tx.get(mref), od = await tx.get(oref), L = (await tx.get(lim)).data() || {}, mp = md.data() || {}, op = od.data() || {};
      const xo = mp.ldOut ? (await tx.get(db.doc(`ldinv/${mp.ldOut}`))).data() : null, lm = mp.ldLobby ? (await tx.get(db.doc(`ldlobby/${mp.ldLobby}`))).data() : null, lo = op.ldLobby ? (await tx.get(db.doc(`ldlobby/${op.ldLobby}`))).data() : null;
      const ms = (mp.ldMiss || {})[to] || null, px = ms && ms.id ? (await tx.get(db.doc(`ldinv/${ms.id}`))).data() : null; // my previous invite to this friend
      const missN = !ms ? 0 : !px ? 0 : px.state === 'open' && (px.exp || 0) <= now ? (ms.n || 0) + 1 : px.state === 'cancel' ? (ms.n || 0) : 0; // unanswered invites in a row (Niet nu or no reaction); an accept or a refusal ends the row, a cancel leaves it
      const myLobby = !!lm && ldAlive(ldRo(lm, now), now), day = ldDay(now), no = (mp.ldNo || {})[to];
      if (!fd.exists) return { error: 'notfriend' };
      if (!((op.lv || 0) >= 1)) return { error: 'oldapp' };
      if (mp.ldIn && mp.ldIn.from === to && (mp.ldIn.exp || 0) > now) return { error: 'theyasked', id: mp.ldIn.id }; // both tapped Live duel: the client accepts the friend's invite
      if (myLobby) return { error: 'inlobby', lobby: mp.ldLobby };
      if (xo && xo.state === 'open' && (xo.exp || 0) > now) return { error: 'open', id: mp.ldOut, name: playerName(xo.toName) };
      const inLobby = !!lo && ldAlive(ldRo(lo, now), now);
      if (inLobby && !op.ldHide) return { error: 'busy' }; // a friend in a lobby is busy, never "offline" (a hidden friend keeps the order below)
      if (!ldOnline(op, now) && !ldPushable(op, now)) return { error: 'offline' };
      if ((op.ldIn && op.ldIn.id && (op.ldIn.exp || 0) > now) || inLobby) return { error: 'busy' };
      if (no && no.day === day && (no.n || 0) >= LD_NO_DAY) return { error: 'noday' };
      if (no && now - (no.at || 0) < LD_NO_MS) return { error: 'soon', why: 'no', wait: Math.ceil((no.at + LD_NO_MS - now) / 1000) };
      const again = !!body.again && !!mp.ldDone && mp.ldDone.with === to && now - (mp.ldDone.at || 0) < LD_AGAIN_MS;
      if (!again && mp.ldLast && mp.ldLast.to === to && now - (mp.ldLast.at || 0) < LD_SAME_MS) return { error: 'soon', why: 'same', wait: Math.ceil((mp.ldLast.at + LD_SAME_MS - now) / 1000) };
      if (missN >= LD_MISS_MAX && now - (ms.at || 0) < LD_MISS_MS) return { error: 'soon', why: 'miss', wait: Math.ceil((ms.at + LD_MISS_MS - now) / 1000) }; // two invites in a row without an answer: the next one 30 minutes after the last (the friend can still invite me)
      let start = L.start || 0, n = L.n || 0; if (!(now >= start && now - start < HOUR_MS)) { start = now; n = 0; } if (n >= LD_INV_HOUR) return { error: 'slow' }; // 10 an hour; an accepted invite gives its count back (ldanswer), so rematches are unlimited
      const id = ldId(), exp = now + LD_INV_MS, fromName = playerName(mp.name), toName = playerName(op.name);
      tx.set(lim, { start, n: n + 1 });
      tx.set(db.doc(`ldinv/${id}`), { from: uid, to, fromName, toName, created: now, exp, state: 'open', lobby: '', again, answered: 0, expireAt: new Date(exp + LD_KEEP_MS) });
      tx.set(oref, { ldIn: { id, from: uid, name: fromName, exp, again } }, { merge: true });
      tx.set(mref, Object.assign({ ldOut: id, ldLast: { to, at: now }, ldMiss: Object.assign({}, mp.ldMiss || {}, { [to]: { id, n: missN, at: now } }) }, lm && !myLobby ? { ldLobby: '' } : {}), { merge: true });
      return { id, exp, fromName, here: ldHere(op, now), hid: !!op.ldHide };
    });
    if (out.error) return J(Object.assign({ ok: false }, out));
    await statBump({ ldInv: 1 }); // v0.32.8 stats
    const pushed = out.here ? 0 : await ldPushTo(to, { k: 'ldinv', n: out.fromName, id: out.id, exp: out.exp }); // push only when the friend's app is not open
    return J({ ok: true, id: out.id, exp: out.exp, here: out.here && !out.hid, pushed: out.hid && out.here ? 1 : pushed }); // a friend who hides her online status: the reply is the same whether her game is open (the card) or closed (the push)
  }
  if (action === 'ldcancel') { // { id }: the inviter takes it back (one transaction: the invite, the friend's inbox, my pointer)
    const id = ldClean(body.id), iref = db.doc(`ldinv/${id}`);
    const done = await db.runTransaction(async tx => { const d = (await tx.get(iref)).data(); if (!d || d.from !== uid || d.state !== 'open') return false; const oref = db.doc(`profiles/${d.to}`), op = (await tx.get(oref)).data() || {};
      tx.update(iref, { state: 'cancel', answered: now }); if (op.ldIn && op.ldIn.id === id) tx.set(oref, { ldIn: null }, { merge: true }); tx.set(db.doc(`profiles/${uid}`), { ldOut: '' }, { merge: true }); return true; });
    return J({ ok: true, cancelled: done });
  }
  if (action === 'ldanswer') { // { id, yes, fruit, v, pw } -> yes: { lobby }; no: { refused: true } | { ok: false, error: 'gone' | 'cancel' | 'busy' | 'inlobby' }
    const id = ldClean(body.id), iref = db.doc(`ldinv/${id}`), mref = db.doc(`profiles/${uid}`), lid = ldId();
    const out = await db.runTransaction(async tx => {
      const x = (await tx.get(iref)).data(); if (!x || x.to !== uid) return { error: 'gone' };
      const ipref = db.doc(`profiles/${x.from}`), ip = (await tx.get(ipref)).data() || {}, mp = (await tx.get(mref)).data() || {};
      if (x.state === 'yes' && x.lobby) { const l = (await tx.get(db.doc(`ldlobby/${x.lobby}`))).data(); return l ? { l: Object.assign(l, { id: x.lobby }), again: true } : { error: 'gone' }; } // a second tap or a second device: the same lobby, no write
      const li = ip.ldLobby ? (await tx.get(db.doc(`ldlobby/${ip.ldLobby}`))).data() : null, lm = mp.ldLobby ? (await tx.get(db.doc(`ldlobby/${mp.ldLobby}`))).data() : null;
      const limRef = db.doc(`limits/ldinv_${x.from}`), LM = body.yes ? (await tx.get(limRef)).data() : null;
      if (x.state !== 'open' || (x.exp || 0) <= now) { if (mp.ldIn && mp.ldIn.id === id) tx.set(mref, { ldIn: null }, { merge: true }); return { error: x.state === 'cancel' ? 'cancel' : 'gone' }; }
      if (!body.yes) { const old = (ip.ldNo || {})[uid] || {}, day = ldDay(now); tx.update(iref, { state: 'no', answered: now }); tx.set(mref, { ldIn: null }, { merge: true });
        tx.update(ipref, { ['ldNo.' + uid]: { at: now, day, n: (old.day === day ? old.n || 0 : 0) + 1 } }); return { refused: true }; }
      if (li && ldAlive(ldRo(li, now), now)) return { error: 'busy' }; // the inviter is in another lobby meanwhile
      if (lm && ldAlive(ldRo(lm, now), now)) return { error: 'inlobby', lobby: mp.ldLobby };
      const here = ldHere(ip, now), L = { kind: 'duel', cap: 2, min: 2, host: x.from, inv: id, created: now, state: 'wait', opts: { powers: false, fruit: 'any', level: 10, ms: LD_RUN_MS }, countEnd: 0, startAt: 0, seed: '', res: null, kicked: [], closedWhy: '', closedAt: 0, doneAt: 0, pn: {}, expireAt: new Date(now + LD_KEEP_MS),
        m: [{ uid: x.from, name: playerName(x.fromName), fruit: ldFruit(ip.fruit), role: 'host', joined: false, seen: 0, left: false, leftAt: 0, dev: '', v: 0, pw: [], pushAt: here ? 0 : now, chk: now },
          { uid, name: playerName(mp.name || x.toName), fruit: ldFruit(body.fruit), role: 'guest', joined: true, seen: now, left: false, leftAt: 0, dev: rawUid || uid, v: clampInt(body.v, 0, 99), pw: ldPw(body.pw), pushAt: 0, chk: now }] };
      if (LM && (LM.n || 0) > 0 && now - (LM.start || 0) < HOUR_MS) tx.set(limRef, { start: LM.start, n: LM.n - 1 }); // Pieter: friend duels are unlimited; only invites nobody accepted count toward the 10 an hour
      tx.update(iref, { state: 'yes', answered: now, lobby: lid }); tx.set(db.doc(`ldlobby/${lid}`), L); tx.set(mref, { ldIn: null, ldLobby: lid }, { merge: true }); tx.set(ipref, { ldLobby: lid }, { merge: true }); // the inviter's ldOut stays: his next ldpoll reports 'yes' once and clears it
      return { l: Object.assign({}, L, { id: lid }), push: here ? null : { uid: x.from, n: L.m[1].name } };
    });
    if (out.error) return NO(out.error, out.lobby ? { lobby: out.lobby } : null);
    if (out.refused) return J({ ok: true, refused: true });
    const l = out.l;
    if (out.push) { const n = await ldPushTo(out.push.uid, { k: 'ldlobby', n: out.push.n, id: l.id, exp: now + LD_RETURN_MS }); l.pn = Object.assign({}, l.pn, { [out.push.uid]: n }); try { await db.doc(`ldlobby/${l.id}`).update({ ['pn.' + out.push.uid]: n }); } catch (e) {} }
    return J({ ok: true, lobby: ldView(l, uid, now, false) });
  }
  if (action === 'ldlobby') { // { id, fruit?, leave?, start?, act?, v?, pw? } -> { lobby } | { ok: false, error: 'gone' | 'otherdevice', lobby }; one transaction (reads first, then writes)
    const id = ldClean(body.id), ref = db.doc(`ldlobby/${id}`);
    const out = await db.runTransaction(async tx => {
      const l = (await tx.get(ref)).data(); if (!l) return { err: 'gone' }; l.id = id;
      let me = l.m.find(s => s.uid === uid); if (!me) { if (!(l.kicked || []).some(k => k.uid === uid)) return { err: 'gone' }; tx.set(db.doc(`profiles/${uid}`), { ldLobby: '' }, { merge: true }); return { err: 'gone', l }; } // the view only for a seat that was removed, never for somebody who merely knows the id
      if (me.dev && rawUid && me.dev !== rawUid) return { err: 'otherdevice' }; // another device of mine holds this seat
      let ch = false, started = false, pres = false, went = false; const pushes = [];
      if (!me.dev && rawUid) { me.dev = rawUid; ch = true; }
      if (['wait', 'count'].includes(l.state) && !l.res) {
        if (ldEval(l, now, true)) ch = true; me = l.m.find(s => s.uid === uid); // first the removals as they stand: a seat back after its 2:00 is still removed
        if (me && ['wait', 'count'].includes(l.state)) {
          if (body.leave) { me.left = true; me.leftAt = now; ch = true; }
          else { if (body.act && !me.joined) { me.joined = true; ch = true; } if (me.joined && now - (me.seen || 0) >= LD_SEEN_LOBBY_MS) { me.seen = now; ch = true; }
            if (me.joined && now - (me.ps || 0) >= LD_SEEN_WRITE_MS) { me.ps = now; ch = true; pres = true; } // a joined seat keeps the player's presence fresh (the client sends no ldpoll while the lobby is open)
            if (body.v !== undefined && clampInt(body.v, 0, 99) !== (me.v || 0)) { me.v = clampInt(body.v, 0, 99); ch = true; } if (body.pw !== undefined) { const pw = ldPw(body.pw); if (JSON.stringify(pw) !== JSON.stringify(me.pw || [])) { me.pw = pw; ch = true; } }
            if (body.fruit !== undefined) { const f = ldFruit(body.fruit); if (f !== me.fruit) { me.fruit = f; me.rd = 0; ch = true; } } // v0.32.8: another fruit takes Klaar back
            if (body.ready !== undefined && me.joined) { const rd = body.ready === true ? (me.rd || now) : 0; if (rd !== (me.rd || 0)) { me.rd = rd; ch = true; } } } // v0.32.8: Klaar (v2 clients send it until it is confirmed)
          if (body.start && l.host === uid && ['wait', 'count'].includes(l.state) && !body.leave && me.joined && !me.rd) { me.rd = now; ch = true; } // v0.32.8: Start nu of an older host (v0.32.5-0.32.7) = the host is Klaar; it never ends the guest's 90 s
          { const st0 = l.state; if (ldEval(l, now)) ch = true; if (st0 !== 'go' && l.state === 'go') went = true; } me = l.m.find(s => s.uid === uid); // v0.32.8 stats: went = this call fixed the start
          if (['wait', 'count'].includes(l.state)) for (const s of l.m) { // the push decision: one push per seat that is away while another is in
            const st = ldSeat(l, s, now), w = l.m.find(o => o !== s && ldSeat(l, o, now).isIn); if (st.isIn || s.pushAt || !w || s.left) continue;
            if (s.joined) { if (now - st.from < LD_PUSH_AFTER_MS) continue; }
            else { if (now - (s.chk || 0) < LD_CHK_MS) continue; s.chk = now; ch = true; const sp = (await tx.get(db.doc(`profiles/${s.uid}`))).data() || {}; if (ldHere(sp, now)) continue; } // a never-joined seat: only when its app is not open
            s.pushAt = now; ch = true; pushes.push({ uid: s.uid, n: w.name, exp: now + LD_RETURN_MS }); } // the seat's 2 minutes count from this push (ldSeat)
        }
      } else if (l.state === 'go' && !l.res) {
        const x = await tx.get(db.doc(`ldlobby/${id}/live/${uid}`)); started = x.exists;
        if (body.leave && !x.exists && !me.left) { me.left = true; me.leftAt = now; ch = true; } // after the start was fixed: a no-show, the other plays on
      }
      const mine = l.m.find(s => s.uid === uid);
      if (ch) { const keep = Object.assign({}, l); delete keep.id; tx.set(ref, keep); }
      const pf = Object.assign(!mine || l.state === 'closed' ? { ldLobby: '' } : {}, pres ? { ldSeen: now, ldBusy: false } : {}); if (Object.keys(pf).length) tx.set(db.doc(`profiles/${uid}`), pf, { merge: true });
      return { l, pushes, started, gone: !mine, went };
    });
    if (out.err === 'otherdevice') return NO('otherdevice');
    if (out.err) return NO('gone', { lobby: out.l ? ldView(out.l, uid, now, false) : null });
    const l = out.l; if (out.went) await statBump({ ldGo: 1 }); // v0.32.8 stats
    for (const p of out.pushes) { const n = await ldPushTo(p.uid, { k: 'ldlobby', n: p.n, id, exp: p.exp }); l.pn = Object.assign({}, l.pn, { [p.uid]: n }); try { await ref.update({ ['pn.' + p.uid]: n }); } catch (e) {} }
    if (out.gone) return NO('gone', { lobby: ldView(l, uid, now, false) });
    return J({ ok: true, lobby: ldView(l, uid, now, out.started) });
  }
  if (action === 'ldset') { // { id, powers?, fruit? }: the host's settings before the start; powers refused while no power exists (or a seat does not know it)
    const id = ldClean(body.id), ref = db.doc(`ldlobby/${id}`);
    const r = await db.runTransaction(async tx => { const l = (await tx.get(ref)).data(); if (!l || l.host !== uid || l.res || !['wait', 'count'].includes(l.state)) return 'gone';
      const o = Object.assign({ powers: false, fruit: 'any' }, l.opts || {});
      if (body.powers !== undefined) { if (body.powers && (!LD_POWERS.length || !l.m.every(s => LD_POWERS.every(P => ldPw(s.pw).includes(P.k))))) return 'nopowers'; o.powers = !!body.powers; }
      if (body.fruit !== undefined) { const f = String(body.fruit || ''); if (f !== 'any' && !(f.startsWith('same:') && LD_FRUITS.includes(f.slice(5)))) return 'fruit'; o.fruit = f; }
      const was = JSON.stringify(Object.assign({ powers: false, fruit: 'any' }, l.opts || {})); if (JSON.stringify(o) === was) return ''; // v0.32.8: nothing changed: no Klaar cleared, the count as it is
      const upd = { opts: o }; if ((l.m || []).some(s => s.rd)) upd.m = l.m.map(s => Object.assign({}, s, { rd: 0 })); // v0.32.8: new options: everybody taps Klaar again
      if (l.state === 'count') upd.countEnd = Math.max(l.countEnd || 0, now + LD_OPT_MIN_MS); else if ((l.countLeft || 0) > 0) upd.countLeft = Math.max(l.countLeft, LD_OPT_MIN_MS); tx.update(ref, upd); return ''; }); // at least 30 s left, never less than before
    return r ? NO(r) : J({ ok: true });
  }
  if (action === 'ldbeat' || action === 'ldend' || action === 'ldres') { // the live run: { id, t, s, k0, p, dead, pz, pause, lag, ev } (ldend: + quit, died, ghost, gt) -> { startAt, started, o, evOk, evNo, res, wait }
    const id = ldClean(body.id), lref = db.doc(`ldlobby/${id}`), mref = db.doc(`ldlobby/${id}/live/${uid}`);
    let l = (await lref.get()).data(); if (!l) return NO('gone'); l.id = id;
    const meI = l.m.findIndex(s => s.uid === uid), me = l.m[meI], other = l.m.find(s => s.uid !== uid); if (meI < 0 || !other) return NO('gone');
    if (me.dev && rawUid && me.dev !== rawUid) return NO('otherdevice');
    const resOnce = async () => { if (!l.res) return; const mine = (await mref.get()).data(); if (!(mine && mine.doneSeen)) { await mref.set({ doneSeen: true, expireAt: new Date(now + LD_KEEP_MS) }, { merge: true }); await db.doc(`profiles/${uid}`).set(Object.assign({ ldLobby: '' }, l.res.kind === 'live' ? { ldDone: { with: other.uid, at: now } } : {}), { merge: true }); } };
    const resReply = async () => { await resOnce(); return J({ ok: true, startAt: l.startAt, started: true, o: ldOther((await db.doc(`ldlobby/${id}/live/${other.uid}`).get()).data() || null, other, l, now), evOk: [], evNo: [], res: ldResView(l.res, meI), wait: 0 }); };
    if (l.res) return resReply();
    if (l.state !== 'go') return NO('gone');
    let evr = { ok: [], no: [] }, first = false, mineTx = null;
    if (action !== 'ldres') {
      if (now < (l.startAt || 0) - 1500) return NO('early', { startAt: l.startAt });
      const r = await db.runTransaction(async tx => {
        const x = (await tx.get(mref)).data() || null;
        if (!x || !x.go || action === 'ldend') { const lx = (await tx.get(lref)).data(); if (!lx || lx.res) return { err: 'done' }; } // a first beat or a final never slips past a settle that is being written
        if (!x || !x.go) { if (me.left) return { err: 'left' }; if (now > (l.startAt || 0) + LD_LATE_MS) return { err: 'late' }; }
        if (x && x.fin) return { mine: x }; // a final is never changed again
        const m = Object.assign({ go: now, t: 0, s: 0, k0: 0, p: [], at: 0, pAt: 0, dead: false, pz: false, pause: 0, lag: 0, ev: [], fin: null, gh: '', gt: 0 }, x || {}, { expireAt: new Date(now + LD_KEEP_MS) });
        if (!m.go) m.go = now;
        if (action === 'ldend' || now - (m.pAt || 0) >= 1000) { // positions at most once a second (events and the rest in every beat)
          if (!m.dead || action === 'ldend') { const t = Math.max(m.t || 0, Math.min(clampInt(body.t, 0, LD_RUN_MS + 500), Math.max(0, now - m.go + 3000))); m.t = t; m.s = Math.max(m.s || 0, Math.min(clampInt(body.s, 0, 1e6), Math.floor(t / 1000 * DUEL_MAX_PER_SEC) + 50)); } // only rises, never above 15 sap a second + 50 (like every duel); frozen after the cut
          if (body.p !== undefined) { m.k0 = clampInt(body.k0, 0, 5000); m.p = ldPts(body.p); } m.pAt = now; }
        const e = ldEvents(l, meI, m, body, now); m.ev = e.ev; evr = e;
        m.at = now; m.dead = !!m.dead || !!body.dead; m.pz = !!body.pz; m.pause = Math.max(m.pause || 0, clampInt(body.pause, 0, 65000)); m.lag = clampInt(body.lag, -600000, 600000);
        if (action === 'ldend') { m.fin = { s: m.s, t: m.t, quit: !!body.quit, died: !!body.died, at: now }; m.gh = body.quit ? '' : String(body.ghost || '').replace(/[^0-9,\-]/g, '').slice(0, GHOST_MAX * 8); m.gt = clampInt(body.gt, 0, DUEL_T_MAX); }
        const pr = now - (m.ps || 0) >= LD_SEEN_WRITE_MS; if (pr) m.ps = now; tx.set(mref, m); return { mine: m, fin: action === 'ldend', pr };
      });
      if (r.err === 'done') { l = Object.assign((await lref.get()).data() || {}, { id }); if (l.res) return resReply(); return NO('gone'); }
      if (r.err) return NO(r.err);
      first = !!r.fin; mineTx = r.mine; if (r.pr) await db.doc(`profiles/${uid}`).set({ ldSeen: now, ldBusy: action !== 'ldend' }, { merge: true }); // presence at most every 25 s during the run (friends see the dot, a third friend's invite says busy)
    }
    if (first) await ldMark(uid); // a played day (counted friend-duel wins need an active loser)
    const mine = mineTx || (await mref.get()).data() || null;
    const od = (await db.doc(`ldlobby/${id}/live/${other.uid}`).get()).data() || null, open = e => ['wait', 'play'].includes(e); // the other seat first: while somebody can still start or play, a settle cannot succeed (and would cost three reads every time the game-over asks)
    if (((mine && mine.fin) || action === 'ldres' || now > (l.startAt || 0) + LD_RUN_MS) && !open(ldSeatEnd(l, me, mine, now)) && !open(ldSeatEnd(l, other, od, now))) { const s2 = await ldSettle(id, now); if (s2) { l = Object.assign(s2, { id }); if (l.res) await resOnce(); } }
    const o = ldOther(od, other, l, now), oe = od && od.go ? ldSeatEnd(l, other, od, now) : '';
    const wait = l.res || (o.fin || oe === 'dead') ? 0 : !o.go ? 3000 : Math.min(60000, Math.max(0, LD_RUN_MS - (o.t || 0)) + 3000);
    return J({ ok: true, startAt: l.startAt, started: !!(mine && mine.go), o, evOk: evr.ok, evNo: evr.no, res: l.res ? ldResView(l.res, meI) : null, wait });
  }
  if (action === 'ldpush') { // { kind: 'web' | 'fcm', sub: { endpoint, keys: { p256dh, auth } } | tok, lang, inv, off, tz } -> { n }
    const kind = body.kind === 'fcm' ? 'fcm' : 'web', ref = db.doc(`ldpush/${uid}`), d = (await ref.get()).data() || {}; let subs = Array.isArray(d.subs) ? d.subs : [];
    let key = '', entry = null;
    if (kind === 'web') { const s = body.sub || {}, ep = String(s.endpoint || ''), k = s.keys || {}; let host = ''; try { const u = new URL(ep); host = u.protocol === 'https:' ? u.hostname : ''; } catch (e) {}
      if (!LD_PUSH_HOSTS.test(host) || ep.length > 800) return NO('endpoint'); key = ep; // the server never posts anywhere else
      entry = { kind, ep, keys: { p256dh: String(k.p256dh || '').replace(/[^A-Za-z0-9_\-=]/g, '').slice(0, 120), auth: String(k.auth || '').replace(/[^A-Za-z0-9_\-=]/g, '').slice(0, 40) } }; }
    else { const tok = String(body.tok || '').replace(/[^A-Za-z0-9_:\-.]/g, '').slice(0, 300); if (tok.length < 20) return NO('token'); key = tok; entry = { kind, tok }; }
    subs = subs.filter(s => (s.until || 0) > now && (s.ep || s.tok) !== key);
    if (!body.off) subs.push(Object.assign(entry, { lang: body.lang === 'en' ? 'en' : 'nl', inv: body.inv !== false, tz: clampInt(body.tz, -840, 840), at: now, until: now + LD_PUSH_DAYS * 86400000 }));
    subs = subs.slice(-4); // at most 4 devices, the newest
    const invs = subs.filter(s => s.inv !== false), tz = invs.length ? invs[invs.length - 1].tz || 0 : 0;
    await Promise.all([ref.set({ subs, expireAt: new Date(subs.reduce((m, s) => Math.max(m, s.until || 0), now)) }), db.doc(`profiles/${uid}`).set({ ldPuUntil: ldPuOf(subs), ldTz: tz }, { merge: true })]);
    return J({ ok: true, n: subs.length });
  }
  return false;
}

exports.tourney = onRequest({ region: 'europe-west1', cors: true, secrets: [LIVEDUEL_VAPID] }, async (req, res) => {
  const rawUid = await uidFrom(req); if (!rawUid) { res.status(401).json({ error: 'auth' }); return; }
  // A device that was linked with a link code acts as the identity it joined (devices/{uid}.primary).
  let uid = rawUid; try { const dev = (await db.doc(`devices/${rawUid}`).get()).data(); if (dev && dev.primary) uid = dev.primary; } catch (e) {}
  const body = req.body || {}, action = body.action, week = isoWeek(new Date());
  try {
    if (/^ld[a-z]+$/.test(String(action || '')) && await ldAction(action, uid, body, req, res, rawUid)) return; // v0.32.5 live duels (rawUid: the device, for the seat binding)
    if (action === 'hello') { // v0.32: what this server can do, and what waits for me (friend requests, friend duels); v0.32.3: and how many notes and rewards wait (friends hands them out)
      const [rin, cin, mine] = await Promise.all([freshRequests(uid), db.collection('challenges').where('to', '==', uid).where('status', '==', 'open').limit(10).get(), db.doc(`profiles/${uid}`).get()]);
      const now = Date.now(), p = mine.data() || {}, notes = (Array.isArray(p.notes) ? p.notes.length : 0) + (Array.isArray(p.pending) ? p.pending.length : 0);
      if (p.code && !p.firstMs) { const f = await ldFirstMs(uid, now); if (f) await db.doc(`profiles/${uid}`).set({ firstMs: f }, { merge: true }); } // v0.32.5: the account's age from Firebase Auth, once
      if (p.lastStatDay !== statDay(now)) await statActive(uid, body.pf); // v0.32.8 stats: active today (pf app / web)
      const vk = ldVapid(), wp = !!(vk && ldWebPush); res.json({ ok: true, v: SERVER_V, caps: CAPS.concat(['live'], wp ? ['push'] : [], LD_POWERS.length ? ['ldpow'] : []), vapid: wp ? vk.publicKey : '', inbox: { req: rin.length, duel: cin.docs.filter(d => (d.data().expires || 0) > now).length, notes } });
    } else if (action === 'submit') { // { ev, score, seconds, level, division, name }
      const ev = String(body.ev); if (!EVENTS.includes(ev) || ev !== eventOfWeek(week)) { res.status(400).json({ error: 'event' }); return; } await ldMark(uid); // v0.32.5: a played day (counted friend-duel wins need an active loser)
      const score = Math.max(0, Math.floor(Number(body.score) || 0)), seconds = Math.max(1, Number(body.seconds) || 1);
      if (score > seconds * MAX_PER_SEC[ev] + 50) { res.status(400).json({ error: 'implausible' }); return; }
      const { group, div } = await groupFor(week, uid, Number(body.level) || 1, body.division);
      const ref = db.doc(`groups/${group}/scores/${uid}`), cur = (await ref.get()).data();
      if (!cur || score > cur.score) await ref.set({ score, name: String(body.name || 'Fruit').slice(0, 20), level: Number(body.level) || 1, updated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      await statBump({ tr: 1 }); res.json({ ok: true, group, division: div, week }); // v0.32.8 stats
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
      if (typeof body.findable === 'boolean') { data.findable = body.findable; data.nameKey = body.findable ? nameKeyOf(data.name) : ''; data.cv = CLIENT_V; data.pv = clampInt(body.pv, 0, 999); data.lv = clampInt(body.lv, 0, 9); } /* v0.32.5: lv 1 = this client plays live duels (an older one resets it to 0) */ // v0.32: only a client that can show requests and friend duels v2 sends findable; v0.32.3: pv 33 = it polls (an older one resets it to 0)
      if (body.fruit) data.fruit = String(body.fruit).slice(0, 24);
      { const curP = (await db.doc(`profiles/${uid}`).get()).data() || {}, nowP = Date.now(); if (!curP.firstMs) { const f = await ldFirstMs(uid, nowP); if (f) data.firstMs = f; } if (data.runs > (curP.runs || 0)) Object.assign(data, ldPlayed(curP, nowP) || {}); if (curP.lastStatDay !== statDay(nowP)) await statActive(uid, body.pf); } // v0.32.5: account age (Firebase Auth) and a played day when the run count rose; v0.32.8 stats: active today, new player
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
      const recOf = new Map(list.docs.map(d => [d.id, d.data() || {}])), nowF = Date.now(); const friends = docs.map(d => { const v = profileView(d.id, d.data()); if (v) { const r = recOf.get(d.id) || {}, p = d.data() || {}; Object.assign(v, { rec: { w: r.w || 0, l: r.l || 0, d: r.d || 0 }, lv: (p.lv || 0) >= 1, on: ldOnline(p, nowF), busy: !!p.ldBusy && ldOnline(p, nowF), pu: ldPushable(p, nowF) }); } return v; }).filter(Boolean); // v0.32.5: the record and the green dot (friends only, never in rivals)
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
      const ld = ldStatView(await db.doc(`duelstats/${uid}`).get()); res.json({ ok: true, code: me.code || '', friends, rewards, notes, challenges, requests, duels2, ld }); // v0.32.5: my counted wins
    } else if (action === 'duelfind' && body.v === 2) { // v0.32 { v: 2, day, level, seen: [seed], challenge? } -> { opp: { id, seed, name, fruit, level, score, t, ghost } } or null
      const now = Date.now(), cid = String(body.challenge || '').slice(0, 300);
      if (cid) { const cref = db.doc(`challenges/${cid}`); // the first fetch starts the friend duel (playing); only a second tap within CHALLENGE_GRACE_MS gets it again, so nobody replays known knives
        const got = await db.runTransaction(async tx => { const x = (await tx.get(cref)).data(); if (!x || x.to !== uid) return { gone: 'gone' };
          if (x.status === 'open' && (x.expires || 0) > now) { tx.update(cref, { status: 'playing', startedAt: now }); return { x }; }
          if (x.status === 'playing' && now - (x.startedAt || 0) < CHALLENGE_GRACE_MS) return { x };
          return { gone: x.status === 'playing' ? 'playing' : 'gone' }; });
        if (got.gone === 'playing') await settleStale(cref);
        if (!got.x) { res.json({ ok: true, opp: null, gone: true, error: got.gone }); return; }
        const c = got.x; res.json({ ok: true, opp: { id: '', seed: c.seed, name: c.fromName || 'Vriend', fruit: c.fromFruit || 'appel', level: c.level || 1, score: c.fromScore || 0, t: c.t || 0, ghost: c.ghost || '', same: c.live === 1 ? 1 : 0 }, challenge: cid }); return; } /* v0.32.5: a challenge made from a live no-show is played with the live engine */
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
      const cid = String(body.challenge || '').slice(0, 300), to = String(body.challengeTo || '').slice(0, 128), friendly = !!cid || !!(to && to !== uid); // v0.32.3: a friend duel (one you send or play) is unlimited and never a public ghost
      const slot = friendly ? { ok: true, k: -1 } : await duelSlot(uid, now - t, !!ghost); // a random duel counts on the day of its start, like the client's
      let ghostId = '', settled = 0, challenge = '', error = '', ldRep = null; await ldMark(uid); // v0.32.5: a played day; ldRep = my stats when this call settles a 24 h challenge
      if (slot.ok && !friendly) {
        if (ghost) { ghostId = `${ghostKey(uid)}_${slot.k}`; await db.doc(`ghosts/${ghostId}`).set({ uid, name, fruit, level, band: ghostBand(level), seed, score, t, ghost, createdMs: now, expireAt: new Date(now + GHOST_DAYS * 86400000), picked: 0, wins: 0, losses: 0 }); } // a fixed slot: the oldest of the player's GHOST_KEEP ghosts is replaced, no trim query
        if (seed === body.day && ghost) { const ref = db.doc(`duels/${body.day}/entries/${uid}`); if (!(await ref.get()).exists) { await ref.set({ score, level, band: bandOf(level), fruit, name, ghost, t, picked: 0, updatedMs: now });
          const [asFrom, asTo] = await Promise.all([db.collection(`duels/${body.day}/challenges`).where('from', '==', uid).get(), db.collection(`duels/${body.day}/challenges`).where('to', '==', uid).get()]); for (const d of asFrom.docs.concat(asTo.docs)) { const c = d.data(); if (!c.resolved) await settleChallenge(body.day, c, d.ref); } } }
        if (body.vsGhost) { try { await ghostPlayed(body.vsGhost, seed, body.day, score); } catch (e) {} }
      }
      if (cid) { const cref = db.doc(`challenges/${cid}`); const c = await db.runTransaction(async tx => { const x = (await tx.get(cref)).data(); if (!x || x.to !== uid || x.seed !== seed || !chalLive(x, now)) return null; tx.update(cref, { status: 'done', toScore: score, settled: now }); return x; }); // a reply is a friend duel: never limited, it was started from duelfind
        if (c) { const theirs = c.fromScore || 0; try { const r = await db.runTransaction(tx => ldRecordTx(tx, c.from, uid, { s: theirs, t: c.t || 0 }, { s: score, t, quit }, 'chal', now)); ldRep = Object.assign({}, r.stB, { r: r.win === 1 ? 'win' : r.win === 0 ? 'loss' : 'draw', rec: { w: r.rec.bw, l: r.rec.aw, d: r.rec.d }, counted: r.win === 1 && r.counted, why: r.win === 1 ? r.why : '' }); } catch (e) { console.error('ldrecord', e); } /* v0.32.5: the 24 h challenge writes the record and may count */ await Promise.all([noteTo(c.from, { type: 'duel', ch: 'from', vs: c.toName || name, won: theirs > score, tie: theirs === score, score: theirs, theirs: score, hat: LOSER_HAT, day: body.day }), noteTo(uid, { type: 'duel', ch: 'to', vs: c.fromName || 'vriend', won: score > theirs, tie: theirs === score, score, theirs, hat: LOSER_HAT, day: body.day })]); settled = 1; } } // the result reaches the challenger as a note (ch: 'from'); hello counts it
      if (to && to !== uid) { if (quit || !ghost) error = 'quit'; else { const [isFriend, op, seenG, seenD] = await Promise.all([db.doc(`friends/${uid}/of/${to}`).get(), db.doc(`profiles/${to}`).get(), db.collection('ghosts').where('uid', '==', to).where('seed', '==', seed).limit(1).get(), seed === body.day ? db.doc(`duels/${body.day}/entries/${to}`).get() : Promise.resolve(null)]);
        const o = op.data() || {};
        if (!isFriend.exists) error = 'notfriend'; else if (!((o.cv || 0) >= CLIENT_V)) error = 'oldapp'; else if (!seenG.empty || (seenD && seenD.exists)) error = 'seen'; // an older app cannot play a v2 challenge; never knives the friend already played
        else { const id = `${uid}-${to}`, cref = db.doc(`challenges/${id}`), [cur, old] = (await Promise.all([cref.get(), db.doc(`challenges/${[uid, to].sort().join('_')}`).get()])).map(s => s.data()); // v0.32.3: one open challenge per direction; a uid has no '-', a v0.32 pair id has '_'
          if ((cur && chalLive(cur, now)) || (old && old.from === uid && chalLive(old, now))) error = 'already';
          else { await cref.set({ from: uid, to, fromName: name, toName: String(o.name || 'vriend').slice(0, 16), seed, ghost, t, fromScore: score, fromFruit: fruit, level, status: 'open', created: now, expires: now + CHALLENGE_MS }); await noteTo(to, { type: 'challenge', v: 2, by: name, id }); challenge = id; } } } } // the note reaches the friend's next hello (inbox.notes) and its card plays this id
      await statBump({ du: slot.ok && !friendly ? 1 : 0, fdSent: challenge ? 1 : 0, fdPlay: settled ? 1 : 0 }); // v0.32.8 stats
      res.json(Object.assign(slot.ok ? { ok: true, stored: true, settled, challenge, error } : { ok: true, stored: false, limit: true, settled, challenge, error }, ldRep ? { ld: ldRep } : {}));
    } else if (action === 'duel') { // { day, score, seconds, level, fruit, name, ghost, t, vs, vsScore }: my finished duel; settles friend challenges that are complete now
      if (!dayOk(body.day)) { res.status(400).json({ error: 'day' }); return; }
      const score = clampInt(body.score, 0, 1e6), dt = clampInt(body.t === undefined ? Number(body.seconds) * 1000 : body.t, 0, DUEL_T_MAX), seconds = Math.max(1, Math.min(Number(body.seconds) || 1, dt / 1000 + 2, DUEL_T_MAX / 1000)); if (score > seconds * DUEL_MAX_PER_SEC + 50) { res.status(400).json({ error: 'implausible' }); return; } // v0.32: seconds bounded by t and 95 s
      const ref = db.doc(`duels/${body.day}/entries/${uid}`); if ((await ref.get()).exists) { res.json({ ok: true, dup: true }); return; }
      const name = String(body.name || 'Fruit').replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16) || 'Fruit';
      await ref.set({ score, level: clampInt(body.level, 1, 500), band: bandOf(body.level), fruit: String(body.fruit || 'appel').slice(0, 24), name, ghost: String(body.ghost || '').replace(/[^0-9,\-]/g, '').slice(0, GHOST_MAX * 8), t: clampInt(body.t, 0, 120000), picked: 0, updatedMs: Date.now() });
      const vs = String(body.vs || '').slice(0, 128); if (vs && vs !== uid) { try { await noteTo(vs, { type: 'picked', by: name, won: score > clampInt(body.vsScore, 0, 1e6), score, theirs: clampInt(body.vsScore, 0, 1e6), day: body.day }); } catch (e) {} }
      const [asFrom, asTo] = await Promise.all([db.collection(`duels/${body.day}/challenges`).where('from', '==', uid).get(), db.collection(`duels/${body.day}/challenges`).where('to', '==', uid).get()]);
      let settled = 0; for (const d of asFrom.docs.concat(asTo.docs)) { const c = d.data(); if (!c.resolved && await settleChallenge(body.day, c, d.ref)) settled++; }
      await statBump({ du: 1 }); res.json({ ok: true, settled }); // v0.32.8 stats (an older client's day duel)
    } else if (action === 'challenge') { // { uid, day }: challenge a friend to today's duel; the loser pays CHALLENGE_SAP and wears the pan for a day
      const other = String(body.uid || '').slice(0, 128); if (!other || other === uid || !dayOk(body.day)) { res.status(400).json({ error: 'uid' }); return; }
      const [isFriend, mp, op] = await Promise.all([db.doc(`friends/${uid}/of/${other}`).get(), db.doc(`profiles/${uid}`).get(), db.doc(`profiles/${other}`).get()]);
      if (!isFriend.exists) { res.json({ ok: false, error: 'notfriend' }); return; }
      if (((op.data() || {}).cv || 0) >= CLIENT_V) { res.json({ ok: false, error: 'newapp' }); return; } // v0.32: that friend plays friend duels v2; an old challenge would never be settled
      const id = [uid, other].sort().join('_'), ref = db.doc(`duels/${body.day}/challenges/${id}`); if ((await ref.get()).exists) { res.json({ ok: true, already: true }); return; }
      const fromName = String((mp.data() || {}).name || 'Een vriend').slice(0, 16), toName = String((op.data() || {}).name || 'vriend').slice(0, 16);
      await ref.set({ from: uid, to: other, fromName, toName, resolved: false, created: Date.now() }); await noteTo(other, { type: 'challenge', by: fromName, day: body.day });
      const c = { from: uid, to: other, fromName, toName }; const settled = await settleChallenge(body.day, c, ref); await statBump({ fdSent: 1 }); res.json({ ok: true, settled }); // v0.32.8 stats
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
      const st = statBuys(body.buy); // v0.32.8 stats: purchases a client reports (optional; none does yet)
      if ((cur.rev || 0) > rev && (cur.level || 0) >= level && (cur.runs || 0) >= runs) { await statBump(st); res.json({ ok: true, rev: cur.rev, kept: true }); return; }
      const histDay = new Date(Date.now()).toISOString().slice(0, 10);
      await ref.set({ data, rev, level, runs, histDay, updatedMs: Date.now(), updated: admin.firestore.FieldValue.serverTimestamp() });
      { const dr = cur.data ? runs - (cur.runs || 0) : 0, dl = cur.data ? level - (cur.level || 0) : 0, k = statPf(body.pf); // v0.32.8 stats: the rise since the stored save (none on the first save; a jump above the caps is not counted)
        if (dr > 0 && dr <= STAT_RUNS_MAX) Object.assign(st, { runs: dr, ['runs_' + k]: dr }); if (dl > 0 && dl <= STAT_LVL_MAX) st.lvUp = dl;
        await statBump(st, { lvl: dl > 0 && dl <= STAT_LVL_MAX ? level : 0 }); }
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
