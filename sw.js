// Don't Slice Me! service worker: the page itself is fetched network-first (so a new version shows up on the next
// visit) and falls back to the cached copy offline; icons, the manifest and fonts are cached on first use.
const CACHE = 'dontsliceme-v0.32.6';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  if (req.destination === 'audio' || req.destination === 'video' || req.headers.has('range')) return; // music streams straight from the network (partial responses cannot be cached)
  const nav = req.mode === 'navigate' || req.destination === 'document';
  if (nav) { e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; }).catch(() => hit)));
});

// v0.32.5 live duel: a push (Web Push with VAPID, sent by the game's server) shows a notification; tapping it opens the game into the lobby
// or the invite. The payload has only { v, k: 'ldinv' | 'ldlobby', n: the friend's display name, id: a random id, exp, lang }; the text is
// built here. Every push shows a notification (iOS revokes the permission otherwise, Chrome would show its own generic one); staleness is
// the push service's TTL, never this phone's clock. An open game window also gets a message, so it asks the server at once.
const LD_SW_TEXT = {
  nl: { ldinv: n => [`${n} daagt je uit voor een live duel`, 'Tik om te antwoorden. De uitnodiging loopt 10 minuten.'], ldlobby: n => [`${n} zit in de lobby!`, 'Je hebt 2 minuten om terug te komen.'] },
  en: { ldinv: n => [`${n} challenges you to a live duel`, 'Tap to answer. The invite is open for 10 minutes.'], ldlobby: n => [`${n} is in the lobby!`, 'You have 2 minutes to come back.'] } };
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = {}; }
  const k = d.k === 'ldlobby' ? 'ldlobby' : 'ldinv', n = String(d.n || 'Een vriend').replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16) || 'Een vriend', id = String(d.id || '').replace(/[^A-Z0-9]/g, '').slice(0, 12);
  const [title, body] = LD_SW_TEXT[d.lang === 'en' ? 'en' : 'nl'][k](n), url = './?' + (k === 'ldlobby' ? 'ld=' : 'li=') + id;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); for (const w of wins) w.postMessage({ ldpush: { k, id, n } });
    await self.registration.showNotification(title, { body, tag: 'ld' + id, renotify: true, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { k, id, url }, vibrate: [120, 60, 120] });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const d = e.notification.data || {}, url = new URL(d.url || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) if (w.url.startsWith(self.registration.scope)) { try { await w.focus(); } catch (x) {} w.postMessage({ ldopen: { k: d.k, id: d.id } }); return; }
    await self.clients.openWindow(url);
  })());
});
