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
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('</body>')) { console.error('index.html has no </body>'); process.exit(1); }
html = html.replace('</body>', '<script src="bridge.js"></script>\n</body>');
const bytes = files.reduce((a, [f]) => a + fs.statSync(path.join(root, f)).size, 0) + html.length + bridge.length;
if (check) { console.log('would copy:', ['index.html (+ bridge.js tag)', 'bridge.js'].concat(files.map(f => f[1])).join(', ')); console.log('about', (bytes / 1048576).toFixed(1), 'MB'); process.exit(0); }
fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www, { recursive: true });
for (const [from, to] of files) { fs.mkdirSync(path.dirname(path.join(www, to)), { recursive: true }); fs.copyFileSync(path.join(root, from), path.join(www, to)); }
fs.writeFileSync(path.join(www, 'index.html'), html); fs.writeFileSync(path.join(www, 'bridge.js'), bridge);
console.log('www ready:', fs.readdirSync(www).join(', '), '(' + (bytes / 1048576).toFixed(1) + ' MB)');
