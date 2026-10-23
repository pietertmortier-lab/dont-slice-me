# Don't Slice Me! - jouw stappen naar de Play Store (exact, in volgorde)

Alles wat ik kon voorbereiden staat in deze repository: het spel (`index.html`), het privacybeleid
(`privacy.html`, online op https://pietertmortier-lab.github.io/fruitvlucht/privacy.html), de winkelteksten
(`store/winkelteksten.md`), de Android-schil (`native/`) en de promovideo (`promo/`). Hieronder staat alleen wat
jij zelf moet doen, omdat het accounts, betalingen of jouw PC vraagt. Reken op drie dagdelen werk plus de
verplichte wachttijd van veertien dagen voor de gesloten test.

## De app-id (pakketnaam) is `be.pietertmortier.dontsliceme`

De pakketnaam staat in `native/capacitor.config.json` en wordt bij `npx cap add android` in het Android-project gezet. Hij is definitief zodra de eerste app-bundle in de Play Console is geupload; tot dan kan hij vrij veranderen. Had je al een map `native/android` gemaakt met de oude naam, verwijder die dan en voer `npx cap add android` opnieuw uit. AdMob, Firebase en RevenueCat vragen dezelfde pakketnaam; vul overal de nieuwe in.

## Stap 1: accounts (een avond)

1. **Google Play Console** (verplicht): ga naar https://play.google.com/console en meld je aan met je
   Google-account. Kies "persoonlijk" (of maak een eenmanszaak-account als je dat liever zakelijk houdt).
   Betaal de eenmalige 25 dollar en doorloop de identiteitscontrole (ID-kaart, adres; duurt soms enkele
   dagen). Nieuw sinds 2023: een persoonlijk account moet voor de eerste publieke release een gesloten test
   doen met minstens 20 testers gedurende 14 dagen.
2. **AdMob** (advertenties): https://admob.google.com, zelfde Google-account. Maak een app aan
   ("Don't Slice Me!", Android, nog niet in de store). Maak twee advertentieblokken: *Beloning* (rewarded) en
   *Interstitial*. Noteer drie codes: de app-ID (`ca-app-pub-…~…`) en de twee blok-ID's (`ca-app-pub-…/…`).
   Vul ook je betaalgegevens in (IBAN) en de belastinginfo, anders wordt er niet uitbetaald.
3. **RevenueCat** (aankopen en abonnement, gratis tot 2.500 dollar omzet per maand): https://app.revenuecat.com.
   Maak een project "Don't Slice Me!", voeg een Play Store-app toe. Je hebt hiervoor straks de Google
   service-account-sleutel uit stap 3 nodig; RevenueCat legt het stap voor stap uit. Noteer de **public
   Google API key** (`goog_…`).
4. **Firebase** (alleen statistieken en crashes, gratis): https://console.firebase.google.com, project
   "Don't Slice Me!", Android-app met pakketnaam `be.pietertmortier.dontsliceme`. Download `google-services.json`.
   Dit mag ook later.

## Stap 2: op je PC (een middag)

1. Installeer Android Studio (https://developer.android.com/studio), Java 17 en Node 20 (https://nodejs.org).
2. Haal deze repository binnen (`git clone https://github.com/pietertmortier-lab/fruitvlucht`) en open de map
   `native` in een terminal.
3. `npm install`, dan `npm run www`, dan `npx cap add android`, dan `npx cap open android`.
4. Open in Android Studio `android/app/src/main/AndroidManifest.xml` en zet binnen `<application>` deze regel
   met jouw AdMob app-ID:
   `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXX~YYYY"/>`
5. Open `native/bridge.js` en vul in: de twee AdMob blok-ID's, de RevenueCat-sleutel, en zet `testing: false`
   pas vlak voor de echte release (met `true` zie je testadvertenties, dat is verplicht tijdens ontwikkelen).
6. Zet `google-services.json` in `android/app/` (als je Firebase gebruikt).
7. Bouw: in Android Studio *Build > Generate Signed Bundle / APK > Android App Bundle*. Maak de eerste keer een
   keystore aan (bewaar het bestand en de wachtwoorden op twee plaatsen; zonder keystore kun je nooit meer
   updaten). Resultaat: een `.aab`-bestand.

## Stap 3: Play Console invullen (een avond)

1. *Alle apps > App maken*: naam "Don't Slice Me!", standaardtaal Nederlands (Vlaanderen) of Engels, app, gratis.
2. *Instellen van je app*: privacybeleid-URL (hierboven), app-toegang (geen login), advertenties: ja,
   contentbeoordeling (IARC-vragenlijst: geen echt geweld, geen gokken, 13+), doelgroep 13+, nieuwsapp: nee,
   data safety: "verzamelt advertentie-ID en aankoopgeschiedenis via Google; geen accountgegevens".
3. *Winkelvermelding*: teksten uit `store/winkelteksten.md` (NL en EN), icoon 512 (`icons/icon-512.png`),
   feature graphic 1024 x 500 (`promo/feature-graphic.png`), schermafbeeldingen (`promo/screens/`), promovideo
   (upload `promo/dont-slice-me-promo-30s-nl.mp4` (en de EN-versie) naar YouTube als "niet vermeld" en plak de link).
4. *Monetisatie > Producten*: maak de producten aan met exact deze ID's (dezelfde staan in `index.html` onder
   `PRODUCTS`): `sap_3000` 0,99 · `sap_10000` 2,49 · `hearts_5` 0,99 · `unlimited_24h` 1,99 · `unlimited_30m`
   0,49 · `key` 0,99 · `doubler_1h` 0,99 · `coins_5` 0,99 · `boost_5` 0,49 · `shield` 0,99 · `pass` 4,99 ·
   `noads` 3,99 · `fruit_<naam>` 0,99 tot 2,99 (één per fruit, prijs zoals in het spel) · `bundle_<familie>`
   en `bundle_all` 9,99 · hoedje `hat_hoed` 1,49. Abonnementen: `plus_month` 2,99 per maand met 7 dagen
   gratis proef en `plus_year` 19,99 per jaar.
5. *Service-account koppelen aan RevenueCat*: in Play Console *Gebruikers en machtigingen* een service-account
   uitnodigen met financiële rechten; RevenueCat geeft je het e-mailadres. Daarna in RevenueCat dezelfde
   product-ID's toevoegen en koppelen aan "entitlements" (Plus, noads, en één voor elk eenmalig product).
6. *Testen > Interne test*: upload de `.aab`, voeg jezelf en vrienden toe als testers (e-mailadressen), deel de
   link. Hier test je advertenties (test-ID's) en aankopen (licentietesters betalen niet).
7. *Testen > Gesloten test*: nieuwe release met dezelfde `.aab`, minstens 20 testers, 14 dagen laten lopen.
   Vraag ze om echt te spelen; na 14 dagen verschijnt de knop *Toegang tot productie aanvragen*.
8. *Productie*: zet `testing: false` in `bridge.js`, bouw opnieuw, upload, gefaseerde uitrol 10 procent.
   Google keurt de eerste release in 1 tot 7 dagen.

## Stap 4: na de lancering

- Reageer binnen een dag op reviews (dat weegt mee in de ranking).
- Elke update: versienummer in `native/package.json` en in Android Studio (`versionCode` +1), `npm run www`,
  `npx cap sync android`, bouwen, uploaden.
- In AdMob na een week de eCPM per blok bekijken; in RevenueCat de proefweek-naar-betaald-ratio.

## Wat je mij kunt vragen

- De sleutels invullen en een nieuwe `.aab` voorbereiden (jij bouwt en uploadt).
- Feature graphic en schermafbeeldingen maken uit de promovideo-frames.
- Elke winkeltekst of review-antwoord schrijven in NL en EN.

## Stap extra: de server voor het Keukentoernooi (Firebase)

Het toernooi werkt nu met een gesimuleerde divisie (49 vaste tegenstanders), zodat alles te testen is. Voor echte ladders komt er een kleine server. De code staat klaar in `native/tourney/` (Cloud Functions + Firestore-regels). Wat jij doet:

1. Ga naar https://console.firebase.google.com, maak een project "dont-slice-me" (Analytics mag uit).
2. Zet **Authentication** aan met de aanmeldmethode "Anoniem".
3. Zet **Firestore** aan (productiemodus, regio europe-west1).
4. Installeer op je pc Node 20 en de Firebase CLI (`npm install -g firebase-tools`), log in met `firebase login`.
5. In de map `native/tourney`: `npm install`, dan `firebase use --add` (kies je project) en `firebase deploy --only functions,firestore:rules`.
6. Kopieer de URL van de functie `tourney` uit de uitvoer en zet ze in `native/bridge.js` bij `FV_TOURNEY_URL`. Vanaf dan praat de app met de server; de webversie blijft op de simulatie.

Kosten: bij 10.000 spelers een paar euro per maand (Spark/Blaze-plan). De server controleert elke score op plausibiliteit (duur van de ronde, klontjes per seconde) en rekent zondag 23 u de week af.
