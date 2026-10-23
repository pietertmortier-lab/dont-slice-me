// Don't Slice Me! Keukentoernooi: the small server behind the weekly ladders.
// One HTTPS Cloud Function ("tourney"): tournament actions, player profiles and friends. Firestore as storage, anonymous
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
const DUEL_MAX_PER_SEC = 15, CHALLENGE_SAP = 200, LOSER_HAT = 'pannetje', GHOST_MAX = 2400, DAY_RX = /^\d{4}-\d{2}-\d{2}$/;
const bandOf = level => Math.floor(Math.max(1, Number(level) || 1) / 15);
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
const profileView = (id, p) => p ? ({ uid: id, name: String(p.name || 'Fruit').slice(0, 16), level: p.level || 1, best: p.best || 0, fruits: Array.isArray(p.fruits) ? p.fruits : [], hat: p.hat || 'none', streak: p.streak || 0, runs: p.runs || 0, stamps: p.stamps || 0, division: p.division || '', weekKey: p.weekKey || '', weekEv: p.weekEv || '', weekScore: p.weekScore || 0, last: p.updatedMs || 0 }) : null;
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
    if (action === 'submit') { // { ev, score, seconds, level, division, name }
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
        stamps: clampInt(body.stamps, 0, 100000), division: DIVISIONS.includes(body.division) ? body.division : '', weekKey: String(body.weekKey || '').slice(0, 12), weekEv: EVENTS.includes(body.weekEv) ? body.weekEv : '', weekScore: clampInt(body.weekScore, 0, 1e6),
        updatedMs: Date.now(), updated: admin.firestore.FieldValue.serverTimestamp() };
      const code = await ensureCode(uid, data); await db.doc(`profiles/${uid}`).set(data, { merge: true }); res.json({ ok: true, code });
    } else if (action === 'befriend') { // { code } -> both players become friends; the first time, both get FRIEND_SAP
      const code = cleanCode(body.code); if (code.length !== 6) { res.status(400).json({ error: 'code' }); return; }
      const c = (await db.doc(`codes/${code}`).get()).data(); if (!c) { res.json({ ok: false, error: 'unknown' }); return; }
      const other = c.uid; if (other === uid) { res.json({ ok: false, error: 'self' }); return; }
      const [mine, theirs, otherProfile, myProfile] = await Promise.all([db.collection(`friends/${uid}/of`).get(), db.collection(`friends/${other}/of`).get(), db.doc(`profiles/${other}`).get(), db.doc(`profiles/${uid}`).get()]);
      const op = otherProfile.data() || {}, mp = myProfile.data() || {};
      if (mine.docs.some(d => d.id === other)) { res.json({ ok: true, already: true, friend: profileView(other, op) }); return; }
      if (mine.size >= MAX_FRIENDS || theirs.size >= MAX_FRIENDS) { res.json({ ok: false, error: 'full' }); return; }
      const now = admin.firestore.FieldValue.serverTimestamp(), rewardOk = (op.inviteRewards || 0) < MAX_INVITE_REWARDS, batch = db.batch();
      batch.set(db.doc(`friends/${uid}/of/${other}`), { since: now }); batch.set(db.doc(`friends/${other}/of/${uid}`), { since: now });
      if (rewardOk) { batch.set(db.doc(`profiles/${other}`), { inviteRewards: admin.firestore.FieldValue.increment(1), pending: admin.firestore.FieldValue.arrayUnion({ from: String(mp.name || 'Een vriend').slice(0, 16), sap: FRIEND_SAP }) }, { merge: true }); }
      await batch.commit(); res.json({ ok: true, friend: profileView(other, op), reward: rewardOk ? FRIEND_SAP : 0 });
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
      res.json({ ok: true, code: me.code || '', friends, rewards, notes, challenges });
    } else if (action === 'duelfind') { // { day, level } -> an opponent of a similar level who already played today's duel (with ghost), or null
      if (!dayOk(body.day)) { res.status(400).json({ error: 'day' }); return; }
      const band = bandOf(body.level); let snap = await db.collection(`duels/${body.day}/entries`).where('band', '==', band).limit(30).get();
      if (snap.docs.filter(d => d.id !== uid).length === 0) snap = await db.collection(`duels/${body.day}/entries`).limit(30).get(); // nobody of my level yet: anyone will do
      const cands = snap.docs.filter(d => d.id !== uid).map(d => Object.assign({ uid: d.id }, d.data())).sort((a, b) => (a.picked || 0) - (b.picked || 0)).slice(0, 5);
      if (!cands.length) { res.json({ ok: true, opp: null }); return; }
      const o = cands[Math.floor(Math.random() * cands.length)]; await db.doc(`duels/${body.day}/entries/${o.uid}`).set({ picked: admin.firestore.FieldValue.increment(1) }, { merge: true });
      res.json({ ok: true, opp: { uid: o.uid, name: o.name, fruit: o.fruit, level: o.level, score: o.score, t: o.t, ghost: o.ghost || '' } });
    } else if (action === 'duel') { // { day, score, seconds, level, fruit, name, ghost, t, vs, vsScore }: my finished duel; settles friend challenges that are complete now
      if (!dayOk(body.day)) { res.status(400).json({ error: 'day' }); return; }
      const score = clampInt(body.score, 0, 1e6), seconds = Math.max(1, Number(body.seconds) || 1); if (score > seconds * DUEL_MAX_PER_SEC + 50) { res.status(400).json({ error: 'implausible' }); return; }
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
    } else if (action === 'passed') { // { uid }: tell a rival I passed them
      const other = String(body.uid || '').slice(0, 128); if (!other || other === uid) { res.status(400).json({ error: 'uid' }); return; }
      const mp = (await db.doc(`profiles/${uid}`).get()).data() || {}; await noteTo(other, { type: 'passed', by: String(mp.name || 'Een speler').slice(0, 16), level: mp.level || 1 }); res.json({ ok: true });
    } else if (action === 'unfriend') { // { uid }
      const other = String(body.uid || '').slice(0, 128); if (!other) { res.status(400).json({ error: 'uid' }); return; }
      const batch = db.batch(); batch.delete(db.doc(`friends/${uid}/of/${other}`)); batch.delete(db.doc(`friends/${other}/of/${uid}`)); await batch.commit(); res.json({ ok: true });
    } else if (action === 'save') { // { data, rev, level, runs }: the save blob (the game's own FV1 code), kept unless the stored one is ahead
      const data = String(body.data || ''); if (!data.startsWith('FV1.') || data.length > 300000) { res.status(400).json({ error: 'data' }); return; }
      const rev = clampInt(body.rev, 0, 1e9), level = clampInt(body.level, 1, 500), runs = clampInt(body.runs, 0, 1e6), ref = db.doc(`saves/${uid}`), cur = (await ref.get()).data() || {};
      if ((cur.rev || 0) > rev && (cur.level || 0) >= level && (cur.runs || 0) >= runs) { res.json({ ok: true, rev: cur.rev, kept: true }); return; }
      await ref.set({ data, rev, level, runs, updatedMs: Date.now(), updated: admin.firestore.FieldValue.serverTimestamp() }); res.json({ ok: true, rev });
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
