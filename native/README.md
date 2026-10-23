# Don't Slice Me! - app-schil voor Android (Capacitor)

Deze map maakt van de webversie een Android-app met echte advertenties (AdMob) en echte aankopen
(RevenueCat op Google Play Billing). Het spel zelf blijft `index.html` in de hoofdmap; deze map voegt alleen de
schil en de brug toe. Alles hier is geschreven zonder Android Studio bij de hand: bouw het op de PC en meld
wat vastloopt.

## Eenmalig op de PC

1. Installeer de LTS-versie van Node (24 of nieuwer), Android Studio (met SDK 35) en Java 17.
2. In deze map: `npm install`.
3. `npm run www` kopieert `../index.html`, `../sw.js`, `../manifest.webmanifest`, `../icons` en `../music` naar
   `www/` en voegt `bridge.js` toe (dat is de brug naar AdMob en RevenueCat).
4. `npx cap add android` (één keer), daarna bij elke update `npm run www && npx cap sync android`.
5. `npx cap open android` opent Android Studio; bouw daar de App Bundle (Build > Generate Signed Bundle).

## Sleutels invullen (zie ../UITROL-STAPPEN.md)

- `bridge.js`: `ADMOB.appId`, `ADMOB.rewarded`, `ADMOB.interstitial` (nu de officiële test-ID's van Google),
  `REVENUECAT.apiKey` (public SDK key van RevenueCat) en de product-ID's in `PRODUCTS` die je in Play Console
  aanmaakt.
- `android/app/src/main/AndroidManifest.xml`: de AdMob app-ID als meta-data (`com.google.android.gms.ads.APPLICATION_ID`).

## Hoe de brug werkt

- Het spel roept `window.FV_NATIVE.showAd(kind, placement)` aan als die bestaat; anders toont het zijn eigen
  simulatiescherm. De brug toont een AdMob-video en belooft `true` als de speler ze afmaakte.
- Elke betaalde knop in het spel heeft een product-ID (`PRODUCTS` in `index.html`). Bestaat
  `window.FV_NATIVE.buy(sku)`, dan koopt de brug via RevenueCat en pas bij succes voert het spel de aankoop
  uit. Don't Slice Me! Plus is een abonnement (maand en jaar).
- `window.FV_NATIVE.restore()` herstelt eerdere aankopen (knop Aankopen herstellen in de winkel).
- Zonder internet of zonder sleutels doet de brug niets en blijft alles een simulatie, zodat testen altijd kan.
