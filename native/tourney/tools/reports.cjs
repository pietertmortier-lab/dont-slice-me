// v0.32.9 player names: Pieter's tool for name reports (run on Pieter's PC, in native/tourney, after `npm install`).
// Login once: `gcloud auth application-default login` (the Google account of the Firebase project), or set GOOGLE_APPLICATION_CREDENTIALS
// to a service-account key file of the project (never in the repo). Project: dont-slice-me (or GCLOUD_PROJECT).
//   node tools/reports.cjs list                    open reports per player and every hidden name: name, reports, hidden or not
//                                                  (v0.32.9 fixer (review of the integration): once a week is enough)
//   node tools/reports.cjs approve <who> [--yes]   the name is fine: shown again, never hidden for these reports again, reports closed
//   node tools/reports.cjs rename <who> [--yes]    hide the name now (shown as Speler), ask the player for a new name, reports closed
//   node tools/reports.cjs clear <who> [--yes]     remove the reports of this player, the name stays as it is
// <who>: a friend code (6 letters), a search handle (10 letters), a uid, or the exact player name. Without --yes nothing is written (dry run).
const admin = require('firebase-admin');
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'dont-slice-me' });
const db = admin.firestore(), HID = 'Speler';
const nameKeyOf = v => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16); // as the server
const [cmd, who] = process.argv.slice(2), yes = process.argv.includes('--yes');
async function find(w) {
  const v = String(w || '').trim(); if (!v) return null; const up = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (up.length === 6) { const c = (await db.doc(`codes/${up}`).get()).data(); if (c && c.uid) return c.uid; }
  if (up.length === 10) { const s = await db.collection('profiles').where('ref', '==', up).limit(1).get(); if (!s.empty) return s.docs[0].id; }
  if (/^[A-Za-z0-9_\-]{6,128}$/.test(v) && (await db.doc(`profiles/${v}`).get()).exists) return v;
  for (const f of ['name', 'nameReal']) { const s = await db.collection('profiles').where(f, '==', v).limit(2).get(); if (s.size === 1) return s.docs[0].id; if (s.size > 1) { console.log('More than one player with this name: use the friend code or the uid.'); return null; } }
  return null;
}
(async () => {
  if (cmd === 'list') {
    const [s1, s2] = await Promise.all([db.collection('repsum').where('n', '>', 0).limit(200).get(), db.collection('repsum').where('hidden', '==', true).limit(200).get()]); // hidden: also when no report is left
    const docs = [...new Map(s1.docs.concat(s2.docs).map(d => [d.id, d])).values()]; if (!docs.length) { console.log('No open reports and no hidden names.'); return; }
    for (const d of docs) { const r = d.data(), p = (await db.doc(`profiles/${d.id}`).get()).data() || {}, rs = await db.collection('reports').where('reportedUid', '==', d.id).get();
      const why = {}; for (const x of rs.docs) if (x.data().open) why[x.data().reason] = (why[x.data().reason] || 0) + 1;
      console.log(`${d.id}  code ${p.code || '-'}  name "${r.name}"  shown as "${p.name || ''}"  reports ${r.n} (${JSON.stringify(why)})  ${r.hidden ? 'HIDDEN' : 'visible'}  last ${new Date(r.at || 0).toISOString()}`); }
    return; }
  if (!['approve', 'rename', 'clear'].includes(cmd)) { console.log('Usage: node tools/reports.cjs list | approve <who> | rename <who> | clear <who>  [--yes]'); process.exitCode = 2; return; }
  const uid = await find(who); if (!uid) { console.log('Player not found: ' + who); process.exitCode = 1; return; }
  const pref = db.doc(`profiles/${uid}`), p = (await pref.get()).data() || {}, real = String(p.nameReal || p.name || ''), key = nameKeyOf(real);
  const rs = await db.collection('reports').where('reportedUid', '==', uid).get();
  console.log(`${cmd}: ${uid} "${real}" (shown as "${p.name || ''}"), ${rs.size} report(s)${yes ? '' : ' - dry run, add --yes to do it'}`); if (!yes) return;
  const b = db.batch();
  if (cmd === 'approve') { b.set(pref, Object.assign({ nameOk: admin.firestore.FieldValue.arrayUnion(key), nameHid: admin.firestore.FieldValue.arrayRemove(key), nameAsk: false, nameReal: '' }, p.name === HID && real && real !== HID ? { name: real, nameKey: p.findable === true ? key : '' } : {}), { merge: true }); }
  if (cmd === 'rename') b.set(pref, { name: HID, nameReal: real, nameAsk: true, nameKey: '', nameHid: admin.firestore.FieldValue.arrayUnion(key) }, { merge: true });
  for (const d of rs.docs) b.delete(d.ref); b.delete(db.doc(`repsum/${uid}`)); // handled: the reports go (rename: the name stays hidden through the profile's nameHid)
  await b.commit(); console.log('done');
})().catch(e => { console.error(e && e.message || e); process.exitCode = 1; });
