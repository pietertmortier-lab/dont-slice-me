// Fruitvlucht native bridge: AdMob videos and RevenueCat purchases for the Capacitor app.
// The game only talks to window.FV_NATIVE; without it (the web version) everything stays a simulation.
// Fill in the real IDs from ../UITROL-STAPPEN.md. The AdMob IDs below are Google's official test IDs.
(async () => {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;
  const ADMOB = { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712', testing: true };
  const REVENUECAT = { apiKey: 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXX' }; // public SDK key from the RevenueCat dashboard
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

// ---- Keukentoernooi: the game calls window.FV_TOURNEY.submit({ week, ev, score, division }) after every round and
// FV_TOURNEY.fork({ n }) in the hunt. Without FV_TOURNEY_URL (or without Firebase in this shell) the game keeps its
// simulated division. Set FV_TOURNEY_URL to the URL of the deployed "tourney" function (native/tourney/README.md).
const FV_TOURNEY_URL = '';
if (FV_TOURNEY_URL) {
  const call = async (action, data) => {
    try {
      const auth = window.firebase && window.firebase.auth ? window.firebase.auth() : null; if (!auth) return null;
      if (!auth.currentUser) await auth.signInAnonymously(); const tok = await auth.currentUser.getIdToken();
      const r = await fetch(FV_TOURNEY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: JSON.stringify(Object.assign({ action }, data || {})) });
      return r.ok ? r.json() : null;
    } catch (e) { return null; }
  };
  window.FV_TOURNEY = { submit: d => call('submit', Object.assign({ seconds: Math.max(1, Math.round((d.seconds || 90))) }, d)), ladder: d => call('ladder', d), result: () => call('result'), meter: () => call('meter'), fork: d => call('fork', d) };
}
