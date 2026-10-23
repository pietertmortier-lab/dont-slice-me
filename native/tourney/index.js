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
    } else if (action === 'friends') { // -> { code, friends: [...], rewards: [{from, sap}] } (rewards are handed out once)
      const meRef = db.doc(`profiles/${uid}`), me = (await meRef.get()).data() || {}; const list = await db.collection(`friends/${uid}/of`).get();
      const refs = list.docs.map(d => db.doc(`profiles/${d.id}`)); const docs = refs.length ? await db.getAll(...refs) : [];
      const friends = docs.map(d => profileView(d.id, d.data())).filter(Boolean);
      const rewards = Array.isArray(me.pending) ? me.pending : []; if (rewards.length) await meRef.set({ pending: [] }, { merge: true });
      res.json({ ok: true, code: me.code || '', friends, rewards });
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
