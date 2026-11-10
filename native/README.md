# Don't Slice Me! - app-schil voor Android (Capacitor 8)

Deze map maakt van de webversie een Android-app met echte advertenties (AdMob) en echte aankopen
(RevenueCat op Google Play Billing). Het spel zelf blijft `index.html` in de hoofdmap; deze map voegt alleen de
schil en de brug toe. Het volledige stappenplan staat in `../UITROL-STAPPEN.md` (deel C: de app bouwen).

Bijgewerkt op 10 november 2026 (spel v0.32.6): Capacitor 8 (Google Play eist sinds 31 augustus 2026 target API 36),
de echte AdMob-codes, en een brug die in de app ook echt start.

## Eenmalig op de PC

1. Installeer Node 24 LTS (of nieuwer), Android Studio (met Android SDK 36) en kies als Gradle JDK een Java 21
   (JetBrains Runtime 21, "jbr-21"; via Download JDK als hij er niet staat). Java 17 is te oud voor Capacitor 8.
   Op Pieters pc staan Node (v24.21.0) en Android Studio al sinds 23 oktober; daar gaat het alleen om Android SDK 36
   en Java 21. Op Pieters pc moet het Norton-certificaat (`C:\Users\piete\norton-root.crt`) in die Java 21, met
   keytool (zie UITROL-STAPPEN deel C, stap 4e); anders faalt Gradle met "PKIX path building failed". Niet de
   "Embedded JDK" kiezen: die heeft het Norton-certificaat niet.
2. Had je al een map `native/android` van een oudere poging (Capacitor 6)? Verwijder die map eerst, en ook
   `node_modules`. (Op Pieters pc bestaat die map van 23 oktober, met de testcode van AdMob in het manifest.)
3. In deze map: `npm install`.
4. `npm run www` kopieert `../index.html` (met `bridge.js` erbij), `../manifest.webmanifest`, `../icons` en de mp3's uit
   `../music` naar `www/`. `sw.js`, `privacy.html`, `promo/` en `store/` gaan niet mee (niet nodig in de app).
5. `npx cap add android` (één keer; nu opnieuw, omdat de app van Capacitor 6 naar 8 gaat). Zet daarna in
   `android/app/src/main/res/values/strings.xml` een `\` voor de apostrof in de naam (`Don\'t Slice Me!`, twee
   keer): Capacitor zet de naam er zonder escape in, en een losse `'` is in een Android-tekstbestand niet geldig.
6. Zet de AdMob app-ID in `android/app/src/main/AndroidManifest.xml` (zie hieronder). Zonder deze regel crasht de app
   meteen bij het starten.
7. `npm run assets` maakt het app-icoon (ook het ronde, aanpasbare icoon) en het startscherm uit de map `assets/`
   (de appel van het spel op de bruine achtergrond `#17100b`). Zonder deze stap toont de app het logo van Capacitor.
   Opnieuw doen alleen als de beelden in `assets/` veranderen.
8. `npx cap sync android`, daarna `npx cap open android` opent Android Studio.
9. Bij elke update: `npm run sync` (= `npm run www` + `npx cap sync android`).

## De AdMob app-ID in AndroidManifest.xml (verplicht)

Open `android/app/src/main/AndroidManifest.xml`. Zet binnen `<application ...>` (bijvoorbeeld net voor `<activity`)
deze regel:

```xml
<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-9632519764252496~5730966023"/>
```

Er mag maar één zo'n regel staan, en de juiste eindigt op `~5730966023`. Kopieer niet de regel uit het oude manifest
van 23 oktober: die had de testcode van Google (`ca-app-pub-3940256099942544~3347511713`).

Zet in dezelfde file bij `<activity ... android:name=".MainActivity"` ook `android:screenOrientation="portrait"`
(het spel is staand).

## AdMob-codes van Pieter (aangemaakt op 5 november 2026, ingevuld op 10 november 2026)

Deze codes zijn geen geheimen: ze staan ook in de app zelf.

| Wat | Code | Waar |
|---|---|---|
| App-ID | `ca-app-pub-9632519764252496~5730966023` | `AndroidManifest.xml` (verplicht) en `capacitor.config.json` (ter info) |
| Beloning (rewarded) | `ca-app-pub-9632519764252496/1676170942` | `bridge.js`: `ADMOB.rewarded` |
| Tussenreclame (interstitial) | `ca-app-pub-9632519764252496/9538137064` | `bridge.js`: `ADMOB.interstitial` |

`bridge.js` heeft `testing: true`. Zo toont de app alleen testadvertenties van Google, ook met jouw echte codes. Dat
moet zo blijven tijdens de interne en de gesloten test. Pas voor de productieversie zet je `testing: false`
(UITROL-STAPPEN.md, deel H).

Gedaan in AdMob (5 november 2026): het AVG-toestemmingsbericht is gepubliceerd (Privacy en berichten > Europese
regelgeving) met de privacy-URL https://pietertmortier-lab.github.io/dont-slice-me/privacy.html. Pieters telefoon is
als testapparaat toegevoegd ("GSM Pieter").

## Hoe de brug werkt (`bridge.js`)

- De brug gebruikt de plugins die Capacitor zelf in de app zet (`window.Capacitor.Plugins.AdMob`, `.Purchases`,
  `.Share`, `.App`, `.PushNotifications`). Er is geen bundler nodig.
- Bij de eerste start in België toont Google eerst het toestemmingsformulier. Pas als advertenties mogen
  (`canRequestAds`), start de advertentie-SDK. Advertenties zijn hoogstens "ParentalGuidance" (geschikt voor 13+).
- `FV_NATIVE.showAd(kind, placement)`: toont een AdMob-video en geeft `true` als de speler ze afmaakte.
- `FV_NATIVE.buy(sku)`: koopt via RevenueCat. Abonnementen (`plus_month`, `plus_year`) en eenmalige producten (alle
  andere) worden elk op hun eigen manier opgevraagd.
- `FV_NATIVE.restore()`: geeft de actieve entitlements terug (`noads`, `pass`, `plus`).
- Nieuw, nog niet gebruikt door het spel (index.html moet ze nog aanroepen):
  `FV_NATIVE.privacyOptions()` (toestemming wijzigen of intrekken), `FV_NATIVE.privacyOptionsRequired()`,
  `FV_NATIVE.plusStatus()` (Plus zoals Google Play het ziet), `FV_NATIVE.manageSubscriptions(sku)` (opzeggen in
  Google Play).
- Delen: Android WebView kent `navigator.share` niet. De brug voegt het toe met de Capacitor-deelknop en verandert
  `https://localhost/`-links in het webadres van het spel.
- De terugknop van Android volgt de terugknop van het spel zelf (`navBack` in index.html, dezelfde als de terugknop
  van de browser): een poging pauzeert, een venster of blad sluit, een scherm gaat één stap terug. Op het
  hoofdscherm met niets open zet hij de app op de achtergrond.
- Met Reclamevrij of Plus (`adFree()` in het spel) toont `showAd` geen video: de beloning komt meteen, zoals de
  winkel belooft.
- Pushmeldingen staan uit (`FCM_READY = false`) tot `google-services.json` in `android/app` staat
  (zie `tourney/README.md`).
- Zonder internet of zonder sleutels doet de brug niets; het spel blijft speelbaar.

## Wat niet in GitHub hoort

`native/.gitignore` houdt `node_modules/`, `www/`, de bouwmappen van `android/`, `google-services.json`, de
`.aab`/`.apk` en elke sleutel (`.jks`, `.keystore`) buiten GitHub. De rest van `android/` (manifest, `build.gradle`,
`strings.xml`, iconen) mag in GitHub. Pieter zet zelf niets vanaf zijn pc naar GitHub (hij gebruikt `git pull`); wil
hij dat Claude zijn Android-instellingen nakijkt, dan plakt hij `android/variables.gradle` en
`android/app/src/main/AndroidManifest.xml` in het gesprek (UITROL-STAPPEN deel C, stap 21b).

## Wat alleen op de PC of een echte telefoon te bewijzen is

Dat het project bouwt met target API 36, de 16 KB-paginagrootte (Build > Analyze APK), het toestemmingsformulier,
testadvertenties, een testaankoop, de terugknop, de deelknop en de rand van het scherm (statusbalk en
gebarenbalk over het spel).
