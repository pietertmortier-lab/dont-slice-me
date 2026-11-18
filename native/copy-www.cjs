// Copies the web game into www/ and appends the native bridge. Run before every `npx cap sync android` (npm run sync does both).
// What goes into the app: index.html (+ bridge.js), manifest.webmanifest, icons/ and the music (mp3 only).
// Not copied: sw.js (a service worker is useless inside the app and could serve an old bridge.js from its cache),
// privacy.html (Google Play and the game link to the web address), promo/, store/ and the text files in music/.
// `node copy-www.cjs --check` only lists what would be copied and checks that bridge.js parses; it writes nothing.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), www = path.join(__dirname, 'www'), check = process.argv.includes('--check');
const files = [], add = (from, to) => files.push([from, to]);
if (!fs.existsSync(path.join(root, 'index.html'))) { console.error('index.html not found in ' + root); process.exit(1); }
for (const f of ['manifest.webmanifest']) if (fs.existsSync(path.join(root, f))) add(f, f);
for (const d of ['icons', 'music']) { const dir = path.join(root, d); if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) { if (d === 'music' && !/\.mp3$/i.test(f)) continue; if (fs.statSync(path.join(dir, f)).isFile()) add(path.join(d, f), path.join(d, f)); } }
const bridge = fs.readFileSync(path.join(__dirname, 'bridge.js'), 'utf8');
try { new Function(bridge); } catch (e) { console.error('bridge.js does not parse: ' + e.message); process.exit(1); }
// v0.33.2: app push (FCM) only when Firebase is really in the build. google-services.json in android/app must exist, parse and name this app;
// then www/bridge.js starts with window.FV_FCM_FILE = true. Without it the bridge never calls PushNotifications.register() (that call would
// crash the app natively) and the game simply has no app push (Settings say so).
const gsPath = path.join(__dirname, 'android', 'app', 'google-services.json'); let fcm = false, fcmWhy = 'android/app/google-services.json not found';
try { if (fs.existsSync(gsPath)) { const j = JSON.parse(fs.readFileSync(gsPath, 'utf8')), ok = Array.isArray(j.client) && j.client.some(c => c && c.client_info && c.client_info.android_client_info && c.client_info.android_client_info.package_name === 'com.dontsliceme.app');
  fcm = ok; fcmWhy = ok ? 'google-services.json found (com.dontsliceme.app)' : 'google-services.json has no Android app com.dontsliceme.app'; } } catch (e) { fcm = false; fcmWhy = 'google-services.json does not parse: ' + e.message; }
const bridgeOut = `window.FV_FCM_FILE = ${fcm}; // v0.33.2: written by copy-www.cjs (${fcm ? 'app push ON' : 'app push OFF'})\n` + bridge;
console.log('app push (FCM): ' + (fcm ? 'ON' : 'OFF') + ' - ' + fcmWhy);
// v0.33.2 push332 review: the phone's own reminders are inexact (bridge.js schedules them with isExactNotification: false), so the app needs no
// exact-alarm permission. The local-notifications plugin's own manifest declares SCHEDULE_EXACT_ALARM anyway; native/README.md removes it with one
// tools:node="remove" line in android/app/src/main/AndroidManifest.xml (the android folder is not in GitHub). This line says whether that is done.
const amPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'); let am = '';
try { am = fs.existsSync(amPath) ? fs.readFileSync(amPath, 'utf8') : ''; } catch (e) { am = ''; }
const amTags = am.match(/<uses-permission\b[^>]*SCHEDULE_EXACT_ALARM[^>]*>/g) || [], amGone = amTags.some(t => /tools:node\s*=\s*["']remove["']/.test(t)), amNs = /xmlns:tools\s*=\s*["']http:\/\/schemas\.android\.com\/tools["']/.test(am);
console.log('exact alarms (SCHEDULE_EXACT_ALARM): ' + (!am ? 'no android/app/src/main/AndroidManifest.xml yet (do the step in native/README.md once the android folder exists)' : amGone && amNs ? 'removed' : amGone ? 'WARNING - the <manifest> line has no xmlns:tools (see native/README.md)' : 'NOT removed - add the line from native/README.md to android/app/src/main/AndroidManifest.xml'));
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('</body>')) { console.error('index.html has no </body>'); process.exit(1); }
html = html.replace('</body>', '<script src="bridge.js"></script>\n</body>');
const bytes = files.reduce((a, [f]) => a + fs.statSync(path.join(root, f)).size, 0) + html.length + bridgeOut.length;
if (check) { console.log('would copy:', ['index.html (+ bridge.js tag)', 'bridge.js'].concat(files.map(f => f[1])).join(', ')); console.log('about', (bytes / 1048576).toFixed(1), 'MB'); process.exit(0); }
fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www, { recursive: true });
for (const [from, to] of files) { fs.mkdirSync(path.dirname(path.join(www, to)), { recursive: true }); fs.copyFileSync(path.join(root, from), path.join(www, to)); }
fs.writeFileSync(path.join(www, 'index.html'), html); fs.writeFileSync(path.join(www, 'bridge.js'), bridgeOut);
console.log('www ready:', fs.readdirSync(www).join(', '), '(' + (bytes / 1048576).toFixed(1) + ' MB)');
