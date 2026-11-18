// Don't Slice Me! native bridge (Capacitor 8): AdMob videos with Google's consent form, RevenueCat purchases on Google Play,
// the Android back button and the share sheet. The game only talks to window.FV_NATIVE; without it (the web version) the
// shop shows "In de app te koop" and the ads are the game's own simulation.
//
// v0.32.12 shop (15 Nov 2026): FV_NATIVE.oneTimeBuys() lists the one-time transactions RevenueCat knows; the game pays a late purchase of
//   a product it no longer sells (tickets_5, tickets_15, weekpass) once as sap. RevenueCat's customer-info listener fires 'fvbuys' so the game
//   looks again when Google completes a pending purchase. The Fruitpas (pass) is a monthly consumable and is not restored.
// v0.32.11 (13 Nov 2026, D12): ads are loaded ahead (FV_NATIVE.prepareAd, one cached per kind) and showAd(kind, placement, opt)
//   shows one only while the game still waits for it (cancel token, canShow, window.dontsliceme.adCanShow): an ad that is not
//   ready within about 4 s (reward video 10 s) is skipped and never shown later, and never over a running game.
// v0.32.6-play (10 Nov 2026):
// - Plain script, no bundler: the plugins are taken from window.Capacitor.Plugins (Capacitor Android injects them), never from
//   import('@capacitor-community/admob'), which a WebView cannot resolve.
// - Pieter's own AdMob codes (approved 10 Nov 2026). ADMOB.testing stays true until the production release: with isTesting the
//   plugin shows Google's test ads, so nobody can click a real ad by accident during the internal and closed tests.
//   For the production release Pieter sets testing: false (UITROL-STAPPEN.md, part H) and builds a new versionCode.
// - Consent first (Google's UMP form, the GDPR message Pieter published in AdMob on 5 Nov 2026), the Mobile Ads SDK only
//   when canRequestAds is true. FV_NATIVE.privacyOptions() reopens the form so a player can change or withdraw consent.
// - One-time products are fetched as NON_SUBSCRIPTION (RevenueCat fetches SUBSCRIPTION by default).
(async () => {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const P = C.Plugins || {};
  const ADMOB = {
    appId: 'ca-app-pub-9632519764252496~5730966023',          // informative only: the SDK reads it from AndroidManifest.xml (meta-data APPLICATION_ID)
    rewarded: 'ca-app-pub-9632519764252496/1676170942',
    interstitial: 'ca-app-pub-9632519764252496/9538137064',
    testing: true,                                            // Pieter: false only for the production release (Google wants test ads while testing)
    maxAdContentRating: 'ParentalGuidance',                   // no ads above the game's own rating (13+ audience, cartoon violence only)
  };
  const REVENUECAT = { apiKey: 'goog_FJgTybHYfqFWbkGXAXfgEJleTju' }; // public SDK key of the Google Play app in RevenueCat (safe to ship; client-side only)
  const SUBSCRIPTIONS = ['plus_month', 'plus_year'];          // everything else in PRODUCTS (index.html) is a one-time product
  const PLAY_PACKAGE = 'com.dontsliceme.app';
  const PLAY_URL = 'https://play.google.com/store/apps/details?id=' + PLAY_PACKAGE; // v0.32.9: shared links go to Google Play, never to the web address
  const AdMob = P.AdMob || null, Purchases = P.Purchases || null;
  const EV = { reward: 'onRewardedVideoAdReward', rDismissed: 'onRewardedVideoAdDismissed', rFailShow: 'onRewardedVideoAdFailedToShow',
    iDismissed: 'interstitialAdDismissed', iFailShow: 'interstitialAdFailedToShow' };

  // addListener on an injected plugin returns { remove } (Capacitor 8 may also return a promise of it): handle both
  const listen = (plugin, ev, fn) => { const h = plugin.addListener(ev, fn); return () => Promise.resolve(h).then(x => x && x.remove && x.remove()).catch(() => {}); };
  // resolves with the first of the events, or 'timeout'
  const first = (plugin, events, ms) => new Promise(res => { const offs = []; let done = false;
    const end = v => { if (done) return; done = true; offs.forEach(o => o()); res(v); };
    for (const ev of events) offs.push(listen(plugin, ev, () => end(ev)));
    setTimeout(() => end('timeout'), ms); });

  // ---- consent and ads: started after FV_NATIVE exists, so the shop works while the player reads the consent form
  // v0.32.11 D12 (R4 review fix): initAds(false) only asks Google whether consent is needed and never opens the form (preloads); initAds()
  // may open it (the first start, a video the player asked for). formOpen is true while the form is on screen (FV_NATIVE.consentOpen).
  const ads = { ready: false, canRequest: false, privacyRequired: false, busy: null, busyForm: false, formOpen: false };
  const initAds = (form = true) => { if (ads.busy) return ads.busyForm || !form ? ads.busy : ads.busy.then(ok => ok || initAds(true)); ads.busyForm = !!form; return (ads.busy = (async () => {
    if (!AdMob) return false;
    try {
      let info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') { if (!form) return false; ads.formOpen = true; try { info = Object.assign({}, info, await AdMob.showConsentForm()); } finally { ads.formOpen = false; } }
      ads.canRequest = !!info.canRequestAds; ads.privacyRequired = info.privacyOptionsRequirementStatus === 'REQUIRED';
      if (!ads.canRequest) return false;
      await AdMob.initialize({ initializeForTesting: ADMOB.testing, maxAdContentRating: ADMOB.maxAdContentRating });
      ads.ready = true; return true;
    } catch (e) { console.warn('AdMob consent/init', e); return false; }
    finally { if (!ads.ready) ads.busy = null; } // offline or refused: try again at the next video
  })()); };

  let iapReady = false, lastBuy = null; // v0.32.9: the last completed purchase { sku, id, at } (FV_NATIVE.lastPurchase)
  try { if (Purchases) { await Purchases.configure({ apiKey: REVENUECAT.apiKey }); iapReady = true; } } catch (e) { console.warn('RevenueCat init', e); }
  try { if (iapReady && typeof Purchases.addCustomerInfoUpdateListener === 'function') Promise.resolve(Purchases.addCustomerInfoUpdateListener(() => { try { window.dispatchEvent(new CustomEvent('fvbuys')); } catch (e) {} })).catch(() => {}); } catch (e) {} // v0.32.12: a completed pending purchase

  const openExternal = url => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }; // Capacitor hands non-app URLs to Android (Play Store app, browser)
  const plusFrom = info => { const e = info && info.entitlements && info.entitlements.active && info.entitlements.active.plus; // RevenueCat entitlement "plus"
    return e ? { active: true, until: e.expirationDate ? Date.parse(e.expirationDate) : 0, product: e.productIdentifier || '', willRenew: !!e.willRenew } : { active: false, until: 0, product: '', willRenew: false }; };

  // v0.32.11 D12 hearts and ads: one loaded (or loading) ad per kind, so the game can start loading it early (FV_NATIVE.prepareAd) and
  // showAd does not wait for a fresh load. { p: promise of true/false, ok: null while loading, at }; a loaded ad older than 50 minutes
  // (AdMob keeps one about an hour) is loaded again; a failed load is forgotten (tried again next time).
  const prep = { interstitial: null, rewarded: null };
  // R4 review fix: form = may Google's consent form open for this load (only showAd, which the game waits for; a preload never opens it)
  const prepareAd = (kind, form) => {
    const k = kind === 'interstitial' ? 'interstitial' : 'rewarded', c = prep[k];
    if (c && c.ok === null && form && !c.form) return c.p.then(ok => ok || prepareAd(kind, true)); // a preload that stopped at the consent question: ask again with the form
    if (c && (c.ok === null || Date.now() - c.at < 50 * 60000)) return c.p;
    const e = { ok: null, at: Date.now(), p: null, form: !!form };
    e.p = (async () => {
      if (!AdMob || (!ads.ready && !(await initAds(!!form)))) return false; // no consent or no ads
      try { if (k === 'interstitial') await AdMob.prepareInterstitial({ adId: ADMOB.interstitial, isTesting: ADMOB.testing }); else await AdMob.prepareRewardVideoAd({ adId: ADMOB.rewarded, isTesting: ADMOB.testing }); return true; }
      catch (err) { console.warn('ad prepare', k, err); return false; }
    })().then(ok => { e.ok = ok; e.at = Date.now(); if (!ok && prep[k] === e) prep[k] = null; return ok; });
    prep[k] = e; return e.p;
  };

  window.FV_NATIVE = {
    platform: 'android', adsTesting: ADMOB.testing,
    // kind: 'rewarded' | 'interstitial'. Resolves true when the player may receive the reward (or the interstitial ended or was skipped).
    // v0.32.11 D12: opt { token, waitMs, canShow, onShow } from the game. The ad is shown only when it is ready within waitMs (interstitial
    // 4 s, reward video 10 s) and the game still waits for it (token not cancelled, canShow() true, the game's adCanShow() true): never over
    // a running game. A late ad is never shown for that request; it stays loaded for the next one. onShow() is called right before it shows.
    async showAd(kind, placement, opt) {
      const o = opt || {}, tok = o.token || {}, fv = window.dontsliceme, inter = kind === 'interstitial';
      if (fv && fv.adFree && fv.adFree()) return true; // Reclamevrij or Plus: no video at all, the reward comes at once (what the shop promises)
      const may = () => !tok.cancelled && (typeof o.canShow !== 'function' || !!o.canShow()) && !(fv && typeof fv.adCanShow === 'function' && !fv.adCanShow());
      const wait = o.waitMs > 0 ? o.waitMs : inter ? 4000 : 10000;
      const ready = await new Promise(res => { let done = false, end = Date.now() + wait; const iv = setInterval(() => { if (ads.formOpen) end = Date.now() + wait; else if (Date.now() >= end) fin('late'); }, 100); // R4 review fix: the wait stands still while the consent form is open and starts again when it closes
        function fin(v) { if (done) return; done = true; clearInterval(iv); res(v); }
        prepareAd(kind, true).then(fin, () => fin(false)); });
      if (ready !== true) return inter; // no consent, no ad, or not ready in time: never block the player, never pay a reward (a late ad keeps loading for next time)
      if (!may()) return inter; // the game stopped waiting (it went on, or a run is going): never show
      prep[inter ? 'interstitial' : 'rewarded'] = null; // this loaded ad is used now
      try {
        if (typeof o.onShow === 'function') o.onShow();
        if (inter) { const end = first(AdMob, [EV.iDismissed, EV.iFailShow], 120000); await AdMob.showInterstitial(); await end; return true; }
        let rewarded = false; const off = listen(AdMob, EV.reward, () => { rewarded = true; });
        const end = first(AdMob, [EV.rDismissed, EV.rFailShow], 180000);
        await AdMob.showRewardVideoAd(); await end; off(); return rewarded;
      } catch (e) { console.warn('ad', placement, e); return false; }
    },
    // v0.32.11 D12: start loading an ad of this kind in the background (cached); resolves true when one is ready.
    prepareAd: kind => prepareAd(kind, false), // R4 review fix: a preload never opens Google's consent form
    // R4 review fix: true while Google's consent form (opened by a video request) is on screen; the game's own wait stands still meanwhile
    consentOpen: () => !!ads.formOpen,
    // Whether the game should show a "Privacy en advertenties" button (Google's privacy options form exists for this player).
    privacyOptionsRequired: () => ads.privacyRequired,
    async privacyOptions() { if (!AdMob) return false; try { await AdMob.showPrivacyOptionsForm(); const info = await AdMob.requestConsentInfo(); ads.canRequest = !!info.canRequestAds; return true; } catch (e) { console.warn('privacy options', e); return false; } },
    // sku: the Google Play product or subscription id. Resolves true on a completed purchase.
    async buy(sku) {
      if (!iapReady) return false;
      try {
        const type = SUBSCRIPTIONS.includes(sku) ? 'SUBSCRIPTION' : 'NON_SUBSCRIPTION';
        const { products } = await Purchases.getProducts({ productIdentifiers: [sku], type });
        const product = (products || []).find(p => p.identifier === sku || String(p.identifier).split(':')[0] === sku) || (products || [])[0];
        if (!product) { console.warn('buy: no product', sku, type); return false; }
        const r = await Purchases.purchaseStoreProduct({ product });
        if (!(r && r.customerInfo)) return false;
        const t = (r && r.transaction) || {}; lastBuy = { sku, id: String(t.transactionIdentifier || t.orderId || ''), at: Date.now() }; // v0.32.9: the game reports it once
        return true;
      } catch (e) { if (e && (e.userCancelled || e.code === '1' || e.code === 1)) return false; console.warn('buy', sku, e); return false; }
    },
    // v0.32.9: the last completed purchase { sku, id, at } or null. The game uses the id only to report a purchase once (it never leaves the phone).
    lastPurchase: () => (lastBuy ? Object.assign({}, lastBuy) : null),
    // v0.32.9: Google's price texts { sku: '€ 2,99' } for these product ids (the Plus card shows them), null when the store cannot answer.
    async prices(skus) {
      if (!iapReady) return null; const want = (Array.isArray(skus) ? skus : []).map(String), out = {};
      try {
        for (const type of ['SUBSCRIPTION', 'NON_SUBSCRIPTION']) { const ids = want.filter(s => SUBSCRIPTIONS.includes(s) === (type === 'SUBSCRIPTION')); if (!ids.length) continue;
          const { products } = await Purchases.getProducts({ productIdentifiers: ids, type });
          for (const p of products || []) { const id = String(p.identifier || '').split(':')[0]; if (ids.includes(id) && p.priceString && !out[id]) out[id] = String(p.priceString); } }
        return out;
      } catch (e) { console.warn('prices', e); return null; }
    },
    // Entitlement ids that are active now (noads, plus; v0.32.12: the entitlement pass is empty, the Fruitpas is not restored). One-time consumables are never restored.
    async restore() { if (!iapReady) return []; try { const { customerInfo } = await Purchases.restorePurchases(); return Object.keys((customerInfo && customerInfo.entitlements && customerInfo.entitlements.active) || {}); } catch (e) { return []; } },
    // v0.32.12: the one-time transactions RevenueCat knows for this player [{ sku, id, at (ms) }] (customerInfo.nonSubscriptionTransactions; fix12b: plus each subscription's first purchase), [] when
    // the store cannot answer. The game reads only the products it no longer sells (tickets_5, tickets_15, weekpass). id is RevenueCat's own
    // transaction id, NOT Google's order id that buy() gets (purchases-hybrid-common maps them differently); at is the purchase time.
    async oneTimeBuys() { if (!iapReady) return []; try { const { customerInfo } = await Purchases.getCustomerInfo(); const list = (customerInfo && customerInfo.nonSubscriptionTransactions) || [];
      const out = list.map(t => ({ sku: String((t && t.productIdentifier) || '').split(':')[0], id: String((t && (t.transactionIdentifier || t.revenueCatId)) || ''), at: Date.parse((t && t.purchaseDate) || '') || Number(t && t.purchaseDateMillis) || 0 }));
      // fix12b: also each subscription's FIRST purchase time (Plus; customerInfo.subscriptionsByProductIdentifier[].originalPurchaseDate). The game never pays
      // these; a buyNote time of a Plus purchase then pairs with it and not with a ticket purchase that stayed pending. Not the latest renewal time.
      try { const subs = (customerInfo && customerInfo.subscriptionsByProductIdentifier) || {}; for (const k of Object.keys(subs)) { const s = subs[k] || {}, at = Date.parse(s.originalPurchaseDate || '') || 0; if (at > 0) out.push({ sku: String(s.productIdentifier || k).split(':')[0], id: 'sub:' + k + ':' + at, at }); } } catch (e) {}
      return out; } catch (e) { return []; } },
    // Plus as Google Play sees it: { active, until (ms), product, willRenew }. The game should use this, not only its own clock.
    async plusStatus() { if (!iapReady) return null; try { const { customerInfo } = await Purchases.getCustomerInfo(); return plusFrom(customerInfo); } catch (e) { return null; } },
    // "Opzeggen": a Play subscription is cancelled in Google Play itself, never in the game.
    manageSubscriptions(sku) { openExternal('https://play.google.com/store/account/subscriptions' + (sku ? `?sku=${encodeURIComponent(sku)}&package=${PLAY_PACKAGE}` : '')); return true; },
    openExternal,
    // v0.32.9: the Google Play install referrer: 'f=K7F4QX' when a friend's Play link installed the app, else null (no referrer, not
    // installed from Google Play, an app build without the plugin, or no answer twice in 5 s). Never throws. The game reads it once per
    // install at the first start (index.html refBoot). Plugin: @capawesome/capacitor-install-referrer (getInstallReferrer -> referrerUrl);
    // @capgo/capacitor-install-referrer (getReferrer -> referrer) has the same plugin name and works too.
    async installReferrer() {
      const IR = P.InstallReferrer || null; if (!IR) return null;
      let alt = typeof IR.getInstallReferrer !== 'function'; const ask = () => !alt ? IR.getInstallReferrer() : typeof IR.getReferrer === 'function' ? IR.getReferrer() : Promise.resolve(null);
      for (let i = 0; i < 2; i++) {
        try {
          const r = await Promise.race([Promise.resolve(ask()), new Promise((ok, no) => setTimeout(() => no(new Error('timeout')), 5000))]);
          const s = r ? String(r.referrerUrl || r.referrer || '') : ''; return s || null;
        } catch (e) { const why = String((e && (e.code || e.message)) || ''); const unimpl = /UNIMPLEMENTED|not implemented/i.test(why); if (unimpl && !alt) { alt = true; continue; } if (unimpl || /NOT_SUPPORTED|DEVELOPER/i.test(why)) return null; console.warn('install referrer', why); }
        await new Promise(z => setTimeout(z, 1500)); // the Play service was busy or not connected: once more
      }
      return null;
    },
  };

  // ---- the share sheet: Android WebView has no navigator.share. Links to https://localhost (the app's own origin) become the Google Play page (v0.32.9).
  const Share = P.Share || null;
  if (Share && !navigator.share) {
    const fix = s => typeof s === 'string' ? s.replace(/https?:\/\/localhost\/?/g, PLAY_URL) : s;
    try {
      navigator.share = async data => { const d = data || {}; await Share.share({ title: fix(d.title), text: fix(d.text), url: fix(d.url), dialogTitle: fix(d.title) }); };
      navigator.canShare = () => true;
    } catch (e) { console.warn('share', e); }
  }

  // ---- the Android back button: the game's own back logic (navBack in index.html: pause a run, close a pop-up or sheet, one screen up,
  // the same as the browser's back button on the web). On the main screen with nothing open, the app goes to the background.
  const App = P.App || null;
  const POPUPS = ['askbox', 'ldbox', 'reward', 'langbox', 'confirm', 'stormbox', 'prevbox', 'gearbox', 'perkbox', 'stkbox', 'compbox', 'pnbox'] /* v0.33.2: the notification card */; // not namebox: it has no close button, so back on it leaves the app
  if (App) listen(App, 'backButton', () => {
    const fv = window.dontsliceme, vis = id => { const e = document.getElementById(id); return !!(e && !e.hidden && e.getClientRects().length); };
    if (window.FV_BACK && window.FV_BACK() === true) return;       // the game may take over later
    try {
      if (!fv) { App.minimizeApp(); return; }
      const open = POPUPS.some(vis), firstStart = fv.state === 'intro' && !(fv.save && fv.save.seen && fv.save.seen.intro);
      if ((fv.state === 'menu' || firstStart) && !open) { App.minimizeApp(); return; }
      if (fv.navBack) { fv.navBack(); return; }
      // an older game without navBack
      if (fv.state === 'play') { fv.pause(); return; }
      if (fv.askOpen && fv.askOpen()) { fv.askDone(false); return; }
      if (vis('reward')) { fv.closeReward(); return; }
      if (fv.closeSheets && fv.closeSheets()) return;
      if (fv.state !== 'menu' && fv.state !== 'dying' && fv.state !== 'pause') { fv.openMenu(); return; }
      App.minimizeApp();
    } catch (e) { try { App.minimizeApp(); } catch (e2) {} }
  });

  initAds(); // Belgium/EEA: Google's consent form shows on the first start, before any ad is requested
})();

// ---- Online features (tournament submissions, the player profile, friends) are handled by the game itself: see NET_CONFIG and
// NET_URL in index.html, which sign in anonymously to Firebase and talk to the function in native/tourney. Nothing to configure here.

// v0.32.5 live duel, v0.33.2 push332 all notifications (Pieter, 17 Nov 2026, 7B). This block has its own globals and never creates or changes
// the ad and purchase bridge above (the game treats window.FV_NATIVE as "the store is ready").
// - window.FV_PUSH (Firebase Cloud Messaging through @capacitor/push-notifications) exists only when Firebase is really in this build:
//   copy-www.cjs writes `window.FV_FCM_FILE = true` at the top of www/bridge.js only when native/android/app/google-services.json exists,
//   parses and names com.dontsliceme.app. Without that file PushNotifications.register() would crash the app natively (no FirebaseApp),
//   so it is never called then: push simply stays off and the game's Settings say so. Nothing to switch by hand any more.
// - window.FV_LOCAL (@capacitor/local-notifications) exists only when that plugin is in the build (Capacitor.isPluginAvailable); the
//   game plans hearts / kitchen / tournament / Fruitpas / daily-knife reminders with it when the app goes to the background and cancels
//   them when it comes back. Inexact times: every reminder is scheduled with isExactNotification: false (plugin 8.3 schedules exact alarms by
//   default and then, on Android 12+ without the exact-alarm permission, opens Android's "Wekkers en herinneringen" screen on schedule()). The
//   plugin's own manifest still declares SCHEDULE_EXACT_ALARM; native/README.md removes it with one tools:node="remove" line (npm run sync
//   checks it). Every call is wrapped: a missing plugin never throws. When FV_LOCAL is ready the bridge sends the window event 'fvlocalready'
//   (a cold start: the game, loaded before this file, then cancels and books what was planned while it was closed).
// - Android channels (their pop-up and sound are fixed once a phone has them): liveduel "Live duels" (pop-up), vrienden "Vrienden"
//   (pop-up, 3A; private on the lock screen: no name there), spel "Herinneringen" (sound, no pop-up).
(async () => {
  const C = window.Capacitor; if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const has = n => { try { return !!(C.isPluginAvailable && C.isPluginAvailable(n)); } catch (e) { return false; } };
  const FCM_READY = window.FV_FCM_FILE === true; // written by copy-www.cjs (google-services.json found); the plugin itself is in package.json
  const PN = has('PushNotifications') && C.Plugins ? C.Plugins.PushNotifications || null : null, LN = has('LocalNotifications') && C.Plugins ? C.Plugins.LocalNotifications || null : null;
  const open = v => { window.FV_PUSH_OPEN = v; try { window.dispatchEvent(new CustomEvent('fvpushopen', { detail: v })); } catch (e) {} };
  const CH = [{ id: 'liveduel', name: 'Live duels', description: 'Een vriend daagt je uit of wacht in de lobby', importance: 4, visibility: 1, vibration: true },
    { id: 'vrienden', name: 'Vrienden', description: 'Een vriend begint te spelen, daagt je uit of wil je vriend worden', importance: 4, visibility: 0, vibration: true },
    { id: 'spel', name: 'Herinneringen', description: 'Hartjes vol, keuken vol, toernooi en Fruitpas', importance: 3, visibility: 1, vibration: false }];
  const chans = async P => { for (const c of CH) { try { await P.createChannel(c); } catch (e) {} } };
  if (FCM_READY && PN) {
    let token = '', reg = null; const waiters = [], got = v => { token = v || ''; waiters.splice(0).forEach(w => w(token)); if (!token) reg = null; };
    try {
      PN.addListener('registration', t => got(t && t.value)); PN.addListener('registrationError', () => got(''));
      PN.addListener('pushNotificationActionPerformed', a => { const d = (a && a.notification && a.notification.data) || {}; open({ k: String(d.k || ''), id: String(d.id || ''), n: String(d.n || ''), c: String(d.c || '') }); });
      PN.addListener('pushNotificationReceived', () => { try { window.dispatchEvent(new CustomEvent('fvpushopen', { detail: { k: 'poll' } })); } catch (e) {} }); // the app is open: no system notification, the game asks the server now
    } catch (e) { console.warn('push listeners', e); }
    const register = () => reg || (reg = new Promise(ok => { waiters.push(ok); setTimeout(() => { ok(token); if (!token) reg = null; }, 10000); try { Promise.resolve(PN.register()).catch(() => got('')); } catch (e) { got(''); } })); // a failed or slow registration may be tried again
    await chans(PN);
    window.FV_PUSH = { supported: true,
      async enable() { try { let p = await PN.checkPermissions(); if (p.receive === 'prompt' || p.receive === 'prompt-with-rationale') p = await PN.requestPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } }, // after the game's own card
      async token() { try { const p = await PN.checkPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } }, // silent: never asks
      async perm() { try { return String((await PN.checkPermissions()).receive || ''); } catch (e) { return ''; } } }; // 'granted' | 'denied' | 'prompt'
    try { if ((await PN.checkPermissions()).receive === 'granted') register(); } catch (e) {} // after a restart: the token exists again, so refresh and off keep working
  } else if (LN) await chans(LN); // no Firebase: the channels for the local reminders only
  if (LN) {
    try { LN.addListener('localNotificationActionPerformed', a => { const x = (a && a.notification && a.notification.extra) || {}; open({ k: String(x.k || ''), id: '' }); }); } catch (e) {}
    const perm = async () => { try { return String((await LN.checkPermissions()).display || ''); } catch (e) { return ''; } };
    window.FV_LOCAL = { supported: true, perm,
      async enable() { try { let p = await LN.checkPermissions(); if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await LN.requestPermissions(); return p.display === 'granted'; } catch (e) { return false; } }, // the same Android permission as push
      async schedule(list) { try { if ((await perm()) !== 'granted') return 0; const now = Date.now(), n = (Array.isArray(list) ? list : []).filter(x => x && x.id > 0 && x.at > now).slice(0, 10)
          .map(x => ({ id: Math.floor(x.id), title: String(x.title || '').slice(0, 80), body: String(x.body || '').slice(0, 160), schedule: { at: new Date(x.at), allowWhileIdle: false }, channelId: 'spel', extra: { k: String(x.k || '') }, isExactNotification: false })); // inexact: never the exact-alarm screen
        if (!n.length) return 0; await LN.schedule({ notifications: n }); return n.length; } catch (e) { console.warn('local schedule', e); return 0; } },
      async cancel(ids) { try { const n = (Array.isArray(ids) ? ids : []).filter(x => x > 0).map(id => ({ id: Math.floor(id) })); if (n.length) await LN.cancel({ notifications: n }); return true; } catch (e) { return false; } } };
    try { window.dispatchEvent(new CustomEvent('fvlocalready')); } catch (e) {} // the game (loaded before this file) books and cancels what was planned now
  }
})();
