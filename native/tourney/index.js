// Don't Slice Me! Keukentoernooi: the small server behind the weekly ladders.
// One HTTPS Cloud Function ("tourney") with four actions, Firestore as storage, anonymous Firebase Auth for identity.
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
  const uid = await uidFrom(req); if (!uid) { res.status(401).json({ error: 'auth' }); return; }
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
