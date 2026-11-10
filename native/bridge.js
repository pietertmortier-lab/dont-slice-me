// Don't Slice Me! native bridge (Capacitor 8): AdMob videos with Google's consent form, RevenueCat purchases on Google Play,
// the Android back button and the share sheet. The game only talks to window.FV_NATIVE; without it (the web version) the
// shop shows "In de app te koop" and the ads are the game's own simulation.
//
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
  const WEB_URL = 'https://pietertmortier-lab.github.io/dont-slice-me/';
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
  const ads = { ready: false, canRequest: false, privacyRequired: false, busy: null };
  const initAds = () => ads.busy || (ads.busy = (async () => {
    if (!AdMob) return false;
    try {
      let info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') info = Object.assign({}, info, await AdMob.showConsentForm());
      ads.canRequest = !!info.canRequestAds; ads.privacyRequired = info.privacyOptionsRequirementStatus === 'REQUIRED';
      if (!ads.canRequest) return false;
      await AdMob.initialize({ initializeForTesting: ADMOB.testing, maxAdContentRating: ADMOB.maxAdContentRating });
      ads.ready = true; return true;
    } catch (e) { console.warn('AdMob consent/init', e); return false; }
    finally { if (!ads.ready) ads.busy = null; } // offline or refused: try again at the next video
  })());

  let iapReady = false;
  try { if (Purchases) { await Purchases.configure({ apiKey: REVENUECAT.apiKey }); iapReady = true; } } catch (e) { console.warn('RevenueCat init', e); }

  const openExternal = url => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }; // Capacitor hands non-app URLs to Android (Play Store app, browser)
  const plusFrom = info => { const e = info && info.entitlements && info.entitlements.active && info.entitlements.active.plus; // RevenueCat entitlement "plus"
    return e ? { active: true, until: e.expirationDate ? Date.parse(e.expirationDate) : 0, product: e.productIdentifier || '', willRenew: !!e.willRenew } : { active: false, until: 0, product: '', willRenew: false }; };

  window.FV_NATIVE = {
    platform: 'android', adsTesting: ADMOB.testing,
    // kind: 'rewarded' | 'interstitial'. Resolves true when the player may receive the reward (or the interstitial ended).
    async showAd(kind, placement) {
      const fv = window.dontsliceme; if (fv && fv.adFree && fv.adFree()) return true; // Reclamevrij or Plus: no video at all, the reward comes at once (what the shop promises)
      if (!ads.ready && !(await initAds())) return kind === 'interstitial'; // no consent or no ads: never block the player, never pay a reward
      try {
        if (kind === 'interstitial') {
          await AdMob.prepareInterstitial({ adId: ADMOB.interstitial, isTesting: ADMOB.testing });
          const end = first(AdMob, [EV.iDismissed, EV.iFailShow], 120000); await AdMob.showInterstitial(); await end; return true;
        }
        await AdMob.prepareRewardVideoAd({ adId: ADMOB.rewarded, isTesting: ADMOB.testing });
        let rewarded = false; const off = listen(AdMob, EV.reward, () => { rewarded = true; });
        const end = first(AdMob, [EV.rDismissed, EV.rFailShow], 180000);
        await AdMob.showRewardVideoAd(); await end; off(); return rewarded;
      } catch (e) { console.warn('ad', placement, e); return false; }
    },
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
        return !!(r && r.customerInfo);
      } catch (e) { if (e && (e.userCancelled || e.code === '1' || e.code === 1)) return false; console.warn('buy', sku, e); return false; }
    },
    // Entitlement ids that are active now (noads, pass, plus). One-time consumables are never restored.
    async restore() { if (!iapReady) return []; try { const { customerInfo } = await Purchases.restorePurchases(); return Object.keys((customerInfo && customerInfo.entitlements && customerInfo.entitlements.active) || {}); } catch (e) { return []; } },
    // Plus as Google Play sees it: { active, until (ms), product, willRenew }. The game should use this, not only its own clock.
    async plusStatus() { if (!iapReady) return null; try { const { customerInfo } = await Purchases.getCustomerInfo(); return plusFrom(customerInfo); } catch (e) { return null; } },
    // "Opzeggen": a Play subscription is cancelled in Google Play itself, never in the game.
    manageSubscriptions(sku) { openExternal('https://play.google.com/store/account/subscriptions' + (sku ? `?sku=${encodeURIComponent(sku)}&package=${PLAY_PACKAGE}` : '')); return true; },
    openExternal,
  };

  // ---- the share sheet: Android WebView has no navigator.share. Links to https://localhost (the app's own origin) become the web address.
  const Share = P.Share || null;
  if (Share && !navigator.share) {
    const fix = s => typeof s === 'string' ? s.replace(/https?:\/\/localhost\/?/g, WEB_URL) : s;
    try {
      navigator.share = async data => { const d = data || {}; await Share.share({ title: fix(d.title), text: fix(d.text), url: fix(d.url), dialogTitle: fix(d.title) }); };
      navigator.canShare = () => true;
    } catch (e) { console.warn('share', e); }
  }

  // ---- the Android back button: the game's own back logic (navBack in index.html: pause a run, close a pop-up or sheet, one screen up,
  // the same as the browser's back button on the web). On the main screen with nothing open, the app goes to the background.
  const App = P.App || null;
  const POPUPS = ['askbox', 'ldbox', 'reward', 'langbox', 'confirm', 'stormbox', 'prevbox', 'gearbox', 'perkbox', 'stkbox', 'compbox']; // not namebox: it has no close button, so back on it leaves the app
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

// v0.32.5 live duel: push notifications in the app (Firebase Cloud Messaging through @capacitor/push-notifications). OFF until Pieter has
// added google-services.json (native/tourney/README.md, "Live friend duels and push"); then he sets FCM_READY = true and rebuilds.
// This block has its own global window.FV_PUSH and never creates or changes the ad and purchase bridge above: the game treats
// that object as "the store is ready".
(async () => {
  const FCM_READY = false; // Pieter: true only after google-services.json is in android/app (the plugin itself is in package.json)
  const C = window.Capacitor; if (!FCM_READY || !C || !C.isNativePlatform || !C.isNativePlatform() || !(C.isPluginAvailable && C.isPluginAvailable('PushNotifications'))) return;
  const PN = C.Plugins && C.Plugins.PushNotifications; if (!PN) return;
  let token = '', reg = null; const waiters = [], got = v => { token = v || ''; waiters.splice(0).forEach(w => w(token)); if (!token) reg = null; };
  PN.addListener('registration', t => got(t && t.value)); PN.addListener('registrationError', () => got(''));
  PN.addListener('pushNotificationActionPerformed', a => { const d = (a && a.notification && a.notification.data) || {}, v = { k: String(d.k || ''), id: String(d.id || '') }; window.FV_PUSH_OPEN = v; window.dispatchEvent(new CustomEvent('fvpushopen', { detail: v })); });
  PN.addListener('pushNotificationReceived', () => { window.dispatchEvent(new CustomEvent('fvpushopen', { detail: { k: 'poll' } })); }); // the app is open: no system notification, the game asks the server now and shows its own card
  const register = () => reg || (reg = new Promise(ok => { waiters.push(ok); setTimeout(() => { ok(token); if (!token) reg = null; }, 10000); Promise.resolve(PN.register()).catch(() => got('')); })); // a failed or slow registration may be tried again
  try { await PN.createChannel({ id: 'liveduel', name: 'Live duels', description: 'Een vriend daagt je uit of wacht in de lobby', importance: 4, visibility: 1, vibration: true }); } catch (e) {}
  window.FV_PUSH = { supported: true,
    async enable() { try { let p = await PN.checkPermissions(); if (p.receive === 'prompt' || p.receive === 'prompt-with-rationale') p = await PN.requestPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } }, // after the game's own card
    async token() { try { const p = await PN.checkPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } } }; // silent: never asks
  try { if ((await PN.checkPermissions()).receive === 'granted') register(); } catch (e) {} // after a restart: the token exists again, so refresh and off keep working
})();
