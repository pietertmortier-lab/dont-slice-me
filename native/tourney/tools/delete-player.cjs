#!/usr/bin/env node
// Don't Slice Me! - delete one player's account and all its data, for a request by e-mail (privacy.html section 14).
// The same code as the "Account verwijderen" button in the game (deleteAccount in native/tourney/index.js). A dry run by default:
// it only counts what would be deleted. Nothing is ever printed but the player's name, level, friend code and id.
//
// Once, on Pieter's PC:
//   1. In native/tourney: npm install (already done for a deploy).
//   2. Firebase console > Project settings > Service accounts > Generate new private key. Keep the .json file OUTSIDE the repo
//      (for example C:\sleutels\dont-slice-me-admin.json) and never send it to anybody.
// Each time, in PowerShell, in the folder native/tourney:
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\sleutels\dont-slice-me-admin.json"
//   node tools/delete-player.cjs K7F4QX                 a friend code (or a player name in quotes: "Lotte")
//   node tools/delete-player.cjs K7F4QX --yes           really delete
//   node tools/delete-player.cjs --uid <id> --yes       when a name matches several players (the dry run lists them)
'use strict';
const path = require('path');
const USAGE = 'Usage: node tools/delete-player.cjs <friend code | "player name" | --uid ID> [--yes]   (without --yes: a dry run, nothing is deleted)';
function parse(argv) {
  const a = { q: '', uid: '', yes: false }; const rest = [];
  for (let i = 0; i < argv.length; i++) { const v = String(argv[i]); if (v === '--yes') a.yes = true; else if (v === '--uid') a.uid = String(argv[++i] || ''); else rest.push(v); }
  a.q = rest.join(' ').trim(); return a;
}
const day = ms => ms > 0 ? new Date(ms).toISOString().slice(0, 10) : '?';
async function main(argv, T, log) { // T: the _admin export of native/tourney/index.js { deleteAccount, findPlayers }; returns the exit code
  log = log || console.log; const a = parse(argv);
  if ((!a.q && !a.uid) || a.uid.includes('/')) { log(USAGE); return 2; }
  let uid = a.uid;
  if (!uid) {
    const list = await T.findPlayers(a.q);
    if (!list.length) { log(`No player found for ${JSON.stringify(a.q)} (a friend code has 6 characters; a name must be written as in the game).`); return 1; }
    if (list.length > 1) { log(`${list.length} players match ${JSON.stringify(a.q)}. Ask the player for the friend code, or run again with --uid:`);
      for (const p of list) log(`  --uid ${p.uid}   name ${p.name || '?'}   level ${p.level}   code ${p.code || '?'}   last active ${day(p.last)}`); return 1; }
    uid = list[0].uid; log(`Player: ${list[0].name || '?'} (level ${list[0].level}, friend code ${list[0].code || '?'}, last active ${day(list[0].last)}), id ${uid}`);
  }
  const c = await T.deleteAccount(uid, { dryRun: !a.yes });
  log(`${a.yes ? 'DELETED' : 'Dry run, nothing deleted. Would delete'}: ${c.docs} documents, ${c.fields} fields in other players' profiles that pointed at this player, ${c.auth} sign-in identities.`);
  for (const k of Object.keys(c.kinds).sort()) log(`  ${k}: ${c.kinds[k]}`);
  log(a.yes ? 'Done. Answer the player that the account and its data are deleted.' : 'Run the same command with --yes to delete for real.');
  return 0;
}
module.exports = { main, parse };
if (require.main === module) {
  if (!process.env.GCLOUD_PROJECT && !process.env.GOOGLE_CLOUD_PROJECT) process.env.GCLOUD_PROJECT = 'dont-slice-me';
  let T = null; try { T = require(path.join(__dirname, '..', 'index.js'))._admin; } catch (e) { console.error('Could not load native/tourney/index.js (run npm install in native/tourney first): ' + ((e && e.message) || e)); process.exit(1); }
  main(process.argv.slice(2), T).then(code => process.exit(code), e => { console.error('FAILED: ' + ((e && e.message) || e)); process.exit(1); });
}
