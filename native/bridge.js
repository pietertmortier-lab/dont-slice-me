// Don't Slice Me! native bridge: AdMob videos and RevenueCat purchases for the Capacitor app.
// The game only talks to window.FV_NATIVE; without it (the web version) everything stays a simulation.
// Fill in the real IDs from ../UITROL-STAPPEN.md. The AdMob IDs below are Google's official test IDs.
(async () => {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;
  const ADMOB = { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712', testing: true };
  const REVENUECAT = { apiKey: 'goog_FJgTybHYfqFWbkGXAXfgEJleTju' }; // public SDK key of the Google Play app in RevenueCat (safe to ship; it only allows client-side calls)
  const { AdMob, RewardAdPluginEvents, InterstitialAdPluginEvents } = window.Capacitor.Plugins.AdMob ? await import('@capacitor-community/admob') : {};
  const Purchases = window.Capacitor.Plugins.Purchases ? (await import('@revenuecat/purchases-capacitor')).Purchases : null;
  let adsReady = false, iapReady = false;
  try { await AdMob.initialize({ initializeForTesting: ADMOB.testing }); const c = await AdMob.requestConsentInfo(); if (c.isConsentFormAvailable && c.status === 'REQUIRED') await AdMob.showConsentForm(); adsReady = true; } catch (e) { console.warn('AdMob init', e); }
  try { if (Purchases) { await Purchases.configure({ apiKey: REVENUECAT.apiKey }); iapReady = true; } } catch (e) { console.warn('RevenueCat init', e); }
  const once = (plugin, ev) => new Promise(res => { const h = plugin.addListener(ev, v => { h.remove(); res(v); }); });
  window.FV_NATIVE = {
    // kind: 'rewarded' | 'interstitial'. Resolves true when the player may receive the reward (or the interstitial ended).
    async showAd(kind, placement) {
      if (!adsReady) return kind === 'interstitial'; // no ads loaded: do not block the player, do not pay a reward
      try {
        if (kind === 'interstitial') { await AdMob.prepareInterstitial({ adId: ADMOB.interstitial, isTesting: ADMOB.testing }); await AdMob.showInterstitial(); return true; }
        await AdMob.prepareRewardVideoAd({ adId: ADMOB.rewarded, isTesting: ADMOB.testing }); let rewarded = false; const h = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; });
        await AdMob.showRewardVideoAd(); await once(AdMob, RewardAdPluginEvents.Dismissed); h.remove(); return rewarded;
      } catch (e) { console.warn('ad', placement, e); return false; }
    },
    // sku: the Google Play product or subscription id. Resolves true on a completed purchase.
    async buy(sku) {
      if (!iapReady) return false;
      try { const { products } = await Purchases.getProducts({ productIdentifiers: [sku] }); if (!products.length) return false; const r = await Purchases.purchaseStoreProduct({ product: products[0] }); return !!r.customerInfo; }
      catch (e) { if (e && e.userCancelled) return false; console.warn('buy', sku, e); return false; }
    },
    async restore() { if (!iapReady) return []; try { const { customerInfo } = await Purchases.restorePurchases(); return Object.keys(customerInfo.entitlements.active || {}); } catch (e) { return []; } },
  };
})();

// ---- Online features (tournament submissions, the player profile, friends) are handled by the game itself: see NET in
// index.html, which signs in anonymously to Firebase and talks to the function in native/tourney. Nothing to configure here.

// v0.32.5 live duel: push notifications in the app (Firebase Cloud Messaging through @capacitor/push-notifications). OFF until Pieter has
// added google-services.json and the plugin (native/tourney/README.md, "Live friend duels and push"); then he sets FCM_READY = true and
// rebuilds. This block has its own global window.FV_PUSH and never creates or changes the ad and purchase bridge above: the game treats
// that object as "the store is ready".
(async () => {
  const FCM_READY = false; // Pieter: true only after google-services.json is in android/app and @capacitor/push-notifications is installed
  const C = window.Capacitor; if (!FCM_READY || !C || !C.isNativePlatform || !C.isNativePlatform() || !(C.isPluginAvailable && C.isPluginAvailable('PushNotifications'))) return;
  let PN = null; try { PN = (await import('@capacitor/push-notifications')).PushNotifications; } catch (e) { return; } if (!PN) return;
  let token = '', reg = null; const waiters = [], got = v => { token = v || ''; waiters.splice(0).forEach(w => w(token)); if (!token) reg = null; };
  PN.addListener('registration', t => got(t && t.value)); PN.addListener('registrationError', () => got(''));
  PN.addListener('pushNotificationActionPerformed', a => { const d = (a && a.notification && a.notification.data) || {}, v = { k: String(d.k || ''), id: String(d.id || '') }; window.FV_PUSH_OPEN = v; window.dispatchEvent(new CustomEvent('fvpushopen', { detail: v })); });
  PN.addListener('pushNotificationReceived', () => { window.dispatchEvent(new CustomEvent('fvpushopen', { detail: { k: 'poll' } })); }); // the app is open: no system notification, the game asks the server now and shows its own card
  const register = () => reg || (reg = new Promise(ok => { waiters.push(ok); setTimeout(() => { ok(token); if (!token) reg = null; }, 10000); PN.register().catch(() => got('')); })); // a failed or slow registration may be tried again
  try { await PN.createChannel({ id: 'liveduel', name: 'Live duels', description: 'Een vriend daagt je uit of wacht in de lobby', importance: 4, visibility: 1, vibration: true }); } catch (e) {}
  window.FV_PUSH = { supported: true,
    async enable() { try { let p = await PN.checkPermissions(); if (p.receive === 'prompt' || p.receive === 'prompt-with-rationale') p = await PN.requestPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } }, // after the game's own card
    async token() { try { const p = await PN.checkPermissions(); return p.receive === 'granted' ? await register() : ''; } catch (e) { return ''; } } }; // silent: never asks
  try { if ((await PN.checkPermissions()).receive === 'granted') register(); } catch (e) {} // after a restart: the token exists again, so refresh and off keep working
})();
