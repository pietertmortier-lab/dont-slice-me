// Copies the web game into www/ and appends the native bridge. Run before every `npx cap sync android`.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), www = path.join(__dirname, 'www');
fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www, { recursive: true });
for (const f of ['sw.js', 'manifest.webmanifest']) if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(www, f));
for (const d of ['icons', 'music']) if (fs.existsSync(path.join(root, d))) fs.cpSync(path.join(root, d), path.join(www, d), { recursive: true });
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace('</body>', '<script src="bridge.js"></script>\n</body>');
fs.writeFileSync(path.join(www, 'index.html'), html); fs.copyFileSync(path.join(__dirname, 'bridge.js'), path.join(www, 'bridge.js'));
console.log('www ready:', fs.readdirSync(www).join(', '));
