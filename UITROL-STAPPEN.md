# Don't Slice Me! - uitrolstappen (bijgewerkt 23 oktober 2026, versie 0.24.2)

Dit is de volledige, actuele lijst: wat al klaar is, hoe je vandaag een testpubliek toelaat op de webversie, en
daarna de weg naar de Play Store. Alles wat ik kon voorbereiden staat in deze repository. Per fase staat alleen wat
jij zelf moet doen, omdat het accounts, betalingen of jouw pc vraagt.

## 0. Stand van zaken

- Naam: **Don't Slice Me!** in alle talen. App-id (pakketnaam): `com.dontsliceme.app`.
- Webversie: https://pietertmortier-lab.github.io/dont-slice-me/ . Elke push naar `main` zet binnen een minuut een
  nieuwe versie online; het versienummer staat onderaan het menu.
- In de repository: `index.html` (het hele spel, één bestand), `sw.js`, `manifest.webmanifest` en `icons/`
  (installeerbaar op het beginscherm, werkt offline), `music/` (zeven muziekstukken), `privacy.html` (online op
  https://pietertmortier-lab.github.io/dont-slice-me/privacy.html), `store/winkelteksten.md`, `promo/` (twee
  promovideo's, twaalf schermafbeeldingen, twee feature graphics en de advertentievarianten), `native/` (de
  Android-schil: Capacitor, AdMob, RevenueCat) en `native/tourney/` (de server voor het Keukentoernooi, nog niet
  uitgerold).
- Gesimuleerd in de webversie: aankopen (geen echt geld; de teller "Simulatie" in de winkel), advertenties (een
  scherm van drie seconden) en de toernooiladder (49 vaste tegenstanders). Echte advertenties, aankopen en ladders
  komen pas met de Android-app (fase 3 en 4) en de Firebase-server (fase 6).
- Sinds 0.24.2 staan de testparcoursen van level 80 en level 100 niet meer in de hulptab. De automatische tests
  gebruiken ze nog via een verborgen haak; spelers zien ze niet.

## 1. Vandaag: de webversie openzetten voor je testpubliek

1. Deel de link https://pietertmortier-lab.github.io/dont-slice-me/ via WhatsApp of mail. Werkt in Chrome, Samsung
   Internet, Edge, Firefox en Safari op telefoon en tablet. Op een pc werkt het ook, maar het spel is voor een
   telefoon gemaakt (staand, met de vinger).
2. Raad testers aan om de pagina op het beginscherm te zetten. Android Chrome: menu met drie puntjes, "Toevoegen aan
   startscherm" (soms een knop "Installeren"). iPhone Safari: deelknop, "Zet op beginscherm". Daarna opent het
   schermvullend, zonder adresbalk, en werkt het ook zonder internet.
3. Vertel ze vooraf:
   - de voortgang staat alleen in de browser van hun toestel; een andere browser is opnieuw beginnen. Met Hulp >
     "Kopieer opslagcode" nemen ze hun voortgang mee naar een ander toestel;
   - alles wat op betalen lijkt is een simulatie, er wordt niets afgerekend;
   - reclame is een nepscherm van drie seconden; de tegenstanders in het toernooi zijn gesimuleerd;
   - de deelknop deelt nu de weblink; later de Play Store-link.
4. Vraag bij elke melding: toestel, Android- of iOS-versie, browser, wat er precies gebeurde en een schermafbeelding.
   Na een snee maakt het spel zelf een deelfoto die ze kunnen doorsturen. Eén WhatsApp-groep of een gratis Google
   Formulier volstaat.
5. Geef deze checklist mee:
   - naam kiezen, intro, de eerste vijf pogingen met de appel: is de uitleg duidelijk?
   - level 10: de eerste keukengevaren (vork, deegrol, blender, pan, rasp): begrijp je de waarschuwingen?
   - Vandaag: rad, dagreeks, opdrachten, Plus-kist; Spellen: Mes van de dag, weekendspel, Keukentoernooi;
   - een tweede fruit kopen zodra sap en level dat toelaten; het verschil voelen;
   - Winkel en Plus eens proberen (simulatie);
   - taal wisselen naar Engels (vlagknop) en terug;
   - hoe de afstand tussen vinger en fruit aanvoelt, en of het spel vloeiend blijft op hun toestel;
   - geluid en muziek aan en uit; wisselt de muziek per keuken?
6. Nieuwe versie: na elke push staat ze binnen een minuut online. Testers krijgen ze bij het volgende openen (soms
   pas bij het tweede openen, de service worker vernieuwt op de achtergrond). Het versienummer onderaan het menu zegt
   welke versie ze spelen.
7. Privacy: de webversie verzamelt niets en stuurt niets door; de spelersnaam staat alleen in de browser. Dat staat
   ook zo in `privacy.html`.

## 2. Accounts voor de Play Store (een avond)

1. **Google Play Console** (verplicht): https://play.google.com/console, aanmelden met je Google-account. Kies
   "persoonlijk" of maak een zakelijk account. Eenmalig 25 dollar, identiteitscontrole (ID-kaart, adres; soms
   enkele dagen). Een persoonlijk account moet voor de eerste publieke release een gesloten test doen met minstens
   20 testers gedurende 14 dagen.
2. **AdMob** (advertenties): https://admob.google.com, zelfde Google-account. Maak een app aan ("Don't Slice Me!",
   Android, nog niet in de store, pakketnaam `com.dontsliceme.app`). Maak twee advertentieblokken: *Beloning*
   (rewarded) en *Interstitial*. Noteer drie codes: de app-ID (`ca-app-pub-…~…`) en de twee blok-ID's
   (`ca-app-pub-…/…`). Vul betaalgegevens (IBAN) en belastinginfo in, anders wordt er niet uitbetaald.
3. **RevenueCat** (aankopen en abonnement, gratis tot 2.500 dollar omzet per maand): https://app.revenuecat.com.
   Project "Don't Slice Me!", Play Store-app toevoegen met pakketnaam `com.dontsliceme.app`. Je hebt hiervoor later
   de service-account-sleutel uit fase 4 nodig; RevenueCat legt het stap voor stap uit. Noteer de **public Google API
   key** (`goog_…`).
4. **Firebase** (toernooiserver, en gratis crashrapporten): https://console.firebase.google.com, project
   "dont-slice-me", Android-app met pakketnaam `com.dontsliceme.app`. Download `google-services.json`. De
   toernooiserver zelf staat in fase 6; dit mag ook later.

## 3. Op je pc: de Android-app bouwen (een middag)

1. Installeer Android Studio (https://developer.android.com/studio), Java 17 en Node 20 (https://nodejs.org).
2. Haal de repository binnen (`git clone https://github.com/pietertmortier-lab/dont-slice-me`) en open de map
   `native` in een terminal.
3. `npm install`, dan `npm run www`, dan `npx cap add android`, dan `npx cap open android`. De pakketnaam
   `com.dontsliceme.app` en de naam "Don't Slice Me!" komen uit `native/capacitor.config.json`. Had je eerder al een
   map `native/android` gemaakt (met de oude naam), verwijder die eerst en voer `npx cap add android` opnieuw uit.
4. Open in Android Studio `android/app/src/main/AndroidManifest.xml` en zet binnen `<application>` deze regel met
   jouw AdMob app-ID:
   `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXX~YYYY"/>`
5. Open `native/bridge.js` en vul in: de twee AdMob blok-ID's (nu staan er de testblokken van Google) en, na
   fase 6, de URL van de toernooiserver bij `FV_TOURNEY_URL`. De RevenueCat-sleutel staat er al in. Laat
   `testing: true` staan tot vlak voor de echte release: dan zie je testadvertenties, wat verplicht is tijdens
   ontwikkelen en testen.
6. Zet `google-services.json` in `android/app/`.
7. Bouw: in Android Studio *Build > Generate Signed Bundle / APK > Android App Bundle*. Maak de eerste keer een
   keystore aan en bewaar het bestand en de wachtwoorden op twee plaatsen; zonder keystore kun je de app nooit meer
   bijwerken. Resultaat: een `.aab`-bestand.
8. Bij elke volgende versie: versienummer in `native/package.json` en `versionCode` +1 in Android Studio,
   `npm run www`, `npx cap sync android`, opnieuw bouwen.

## 4. Play Console invullen (een avond)

1. *Alle apps > App maken*: naam "Don't Slice Me!", standaardtaal Nederlands (Vlaanderen) of Engels, app, gratis.
2. *Instellen van je app*: privacybeleid-URL (zie fase 0), app-toegang (geen login), advertenties: ja,
   contentbeoordeling (IARC-vragenlijst: geen echt geweld, geen gokken, 13+), doelgroep 13+, nieuwsapp: nee, data
   safety: "verzamelt advertentie-ID en aankoopgeschiedenis via Google; geen accountgegevens".
3. *Winkelvermelding*: teksten uit `store/winkelteksten.md` (NL en EN; de titels passen in 30 tekens), icoon 512
   (`icons/icon-512.png`), feature graphic 1024 x 500 (`promo/feature-graphic-nl.png` voor de Nederlandse
   vermeldingen, `promo/feature-graphic-en.png` voor alle andere talen), zes schermafbeeldingen per taal
   (`promo/screens/nl-*.png` en `en-*.png`), promovideo (upload `promo/dont-slice-me-promo-30s-nl.mp4` en de
   EN-versie naar YouTube als "niet vermeld" en plak per taal de link). De volledige lijst van wat waar komt staat in
   fase 8.
4. *Monetisatie > Producten*: maak de producten aan met exact deze ID's (dezelfde staan in `index.html` onder
   `PRODUCTS`):
   - sap: `sap_3000` 0,99 · `sap_10000` 2,49
   - hartjes en tijd: `hearts_5` 0,99 · `unlimited_24h` 1,99 · `unlimited_30m` 0,49
   - hulpjes: `key` 0,99 · `doubler_1h` 0,99 · `coins_5` 0,99 · `boost_5` 0,49 · `shield` 0,99
   - Fruitpas `pass` 4,99 · reclamevrij `noads` 3,99 · hoedje `hat_hoed` 1,49
   - fruit: `fruit_<naam>` één per fruit, 0,99 tot 3,99 (de prijs staat op elke fruitkaart in het spel);
     fruitmanden `bundle_<familie>` (rood, tropisch, klein, zuur) en `bundle_all` 9,99
   - toernooi: `tickets_5` 0,99 · `tickets_15` 1,99 · `weekpass` 2,99
   - abonnementen: `plus_month` 2,99 per maand en `plus_year` 19,99 per jaar, **zonder** gratis proefperiode (die is
     in 0.20 uit het spel gehaald).
5. *Service-account koppelen aan RevenueCat*: in Play Console *Gebruikers en machtigingen* een service-account
   uitnodigen met financiële rechten; RevenueCat geeft je het e-mailadres. Daarna in RevenueCat dezelfde product-ID's
   toevoegen en koppelen aan "entitlements" (Plus, noads, en één per eenmalig product).
6. *Testen > Interne test*: upload de `.aab`, voeg jezelf en vrienden toe als testers (e-mailadressen), deel de
   link. Hier test je advertenties (testblokken) en aankopen (licentietesters betalen niet).
7. *Testen > Gesloten test*: nieuwe release met dezelfde `.aab`, minstens 20 testers, 14 dagen laten lopen. Vraag ze
   om echt te spelen; na 14 dagen verschijnt de knop *Toegang tot productie aanvragen*. Je webtesters van fase 1 zijn
   hiervoor de eerste kandidaten.
8. *Productie*: zet `testing: false` in `bridge.js`, bouw opnieuw, upload, gefaseerde uitrol 10 procent. Google
   keurt de eerste release in 1 tot 7 dagen.

## 5. Na de lancering

- Geef mij de Play Store-link zodra die bestaat; ik zet ze in `index.html` bij `STORE_URL`, zodat de deelknop de
  winkel meestuurt, en in de README.
- Reageer binnen een dag op reviews (dat weegt mee in de ranking); ik schrijf antwoorden in NL en EN als je wilt.
- Elke update: zie fase 3 punt 8, dan uploaden in de Play Console.
- In AdMob na een week de eCPM per blok bekijken; in RevenueCat de verhouding maand- en jaarabonnementen.

## 6. De server voor het Keukentoernooi (Firebase)

Het toernooi werkt nu met een gesimuleerde divisie (49 vaste tegenstanders), zodat alles te testen is. Voor echte
ladders komt er een kleine server. De code staat klaar in `native/tourney/` (Cloud Functions en Firestore-regels).

1. Firebase-project "dont-slice-me" (fase 2 punt 4). Analytics mag uit.
2. Zet **Authentication** aan met de aanmeldmethode "Anoniem".
3. Zet **Firestore** aan (productiemodus, regio europe-west1).
4. Installeer op je pc Node 20 en de Firebase CLI (`npm install -g firebase-tools`), log in met `firebase login`.
5. In de map `native/tourney`: `npm install`, dan `firebase use --add` (kies je project) en
   `firebase deploy --only functions,firestore:rules`.
6. Kopieer de URL van de functie `tourney` uit de uitvoer en zet ze in `native/bridge.js` bij `FV_TOURNEY_URL`. Vanaf
   dan praat de app met de server; de webversie blijft op de simulatie.

Kosten: bij 10.000 spelers een paar euro per maand (Spark/Blaze-plan). De server controleert elke score op
plausibiliteit en rekent zondag 23 u de week af.

## 7. Wat je mij kunt vragen

- Fouten uit de webtest oplossen en een nieuwe versie online zetten (binnen een minuut na de push).
- De sleutels invullen en de `.aab` voorbereiden (jij bouwt en uploadt).
- Winkelteksten, release notes en review-antwoorden in NL en EN.
- Nieuwe promovideo's of schermafbeeldingen na een grotere wijziging; ze worden uit het spel zelf gerenderd.

## 8. Waar komt wat: elk bestand en elke sleutel op zijn plaats

| Wat | Waar het nu staat | Waar jij het plaatst |
|-----|-------------------|----------------------|
| Promovideo NL en EN (30 s, staand) | `promo/dont-slice-me-promo-30s-nl.mp4`, `-en.mp4` | Upload elk op je eigen YouTube-kanaal als "Niet vermeld". Play Console > *Winkelvermelding* (per taal) > veld *Videolink*: NL-link bij Nederlands (België) en Nederlands (Nederland), EN-link bij Engels en de standaardvermelding. Dezelfde YouTube-links gebruik je in Google Ads (App-campagne), want die neemt alleen YouTube-video's aan. |
| Advertentievarianten (15 s, vijf scripts) | `promo/ADVERTENTIES.md` (scripts en teksten; de filmpjes zelf maak ik op vraag uit het spel) | TikTok: TikTok Ads Manager > Advertentiegroep > video uploaden (mp4 staand). Instagram/Facebook Reels: Meta Ads Manager > Advertentie > video uploaden. YouTube Shorts: upload op je kanaal, en koppel in Google Ads > App-campagne. Organisch: dezelfde mp4's rechtstreeks posten op je TikTok-, Instagram- en YouTube-account. |
| Feature graphic 1024 x 500 | `promo/feature-graphic-nl.png`, `-en.png` | Play Console > *Winkelvermelding* (per taal) > *Afbeelding voor functies*: NL-versie bij de Nederlandse vermeldingen, EN-versie bij alle andere. |
| Schermafbeeldingen 1080 x 1920 (zes per taal) | `promo/screens/nl-1-menu.png` … `nl-6-kaart.png`, `en-1-…` … `en-6-…` | Play Console > *Winkelvermelding* (per taal) > *Schermafbeeldingen voor telefoon*, in volgorde 1 tot 6 (minimaal 2, maximaal 8). |
| App-icoon 512 x 512 | `icons/icon-512.png` | Play Console > *Winkelvermelding* > *App-pictogram*. Het icoon in de app zelf komt automatisch mee uit `native/` bij het bouwen. |
| Winkelteksten (titel, korte en lange omschrijving, NL en EN) | `store/winkelteksten.md` | Play Console > *Winkelvermelding*: maak de talen aan (Nederlands (België), Nederlands (Nederland), Engels (Verenigde Staten), Engels (Verenigd Koninkrijk)) en plak per taal *Appnaam*, *Korte beschrijving* en *Volledige beschrijving*. |
| Releaseopmerkingen ("Wat is er nieuw") | onderaan elke taal in `store/winkelteksten.md` | Play Console > *Release maken* > *Releaseopmerkingen*, per taal. |
| Privacybeleid | `privacy.html`, online op https://pietertmortier-lab.github.io/dont-slice-me/privacy.html | Play Console > *App-content* > *Privacybeleid* (de URL). Dezelfde URL vraagt AdMob bij *App-instellingen* en vraagt Google in de IARC-vragenlijst. |
| Contact-e-mail | `store/winkelteksten.md` onder "Vaste gegevens" | Play Console > *Winkelvermelding* > *Contactgegevens* > E-mailadres (verplicht, wordt publiek getoond). |
| AdMob app-ID (`ca-app-pub-…~…`) | nog niet (jij maakt hem in fase 2) | `native/android/app/src/main/AndroidManifest.xml`, in de `<meta-data>`-regel uit fase 3 punt 4. |
| AdMob blok-ID's (rewarded en interstitial, `ca-app-pub-…/…`) | `native/bridge.js`, regel `const ADMOB = { rewarded: …, interstitial: …, testing: true }` (nu de testblokken van Google) | Vervang de twee waarden; laat `testing: true` tot de productierelease. |
| RevenueCat public key (`goog_…`) | `native/bridge.js`, regel `const REVENUECAT = { apiKey: 'goog_…' }` | **Ingevuld op 23 oktober 2026.** Het is een publieke sleutel; die mag in de app staan. |
| `google-services.json` (Firebase) | download uit de Firebase-console | `native/android/app/google-services.json`. Niet nodig voor de webversie. |
| Keystore (handtekening van de app) | maak je in Android Studio (fase 3 punt 7) | **Niet in de repository.** Bewaar het `.jks`-bestand en de twee wachtwoorden op twee plaatsen buiten GitHub (bijvoorbeeld je NAS en een wachtwoordmanager). |
| Product-ID's en prijzen | `index.html` onder `PRODUCTS`; de lijst in fase 4 punt 4 | Play Console > *Monetisatie* > *Producten* > *In-app-producten* (eenmalige producten) en > *Abonnementen* (`plus_month`, `plus_year`). Daarna dezelfde ID's in RevenueCat > *Products* en *Entitlements*. |
| Toernooiserver-URL | fase 6 geeft ze; `native/bridge.js`, regel `const FV_TOURNEY_URL = ''` | Vul de URL van de functie `tourney` in. |
| Play Store-link van de app | bestaat pas na de eerste release | Stuur ze naar mij: ik zet ze in `index.html` bij `STORE_URL` (deelknop) en in `README.md`. Zet ze ook in de beschrijving van je YouTube-video's en je socialemediaprofielen. |
| Testers | fase 1: je WhatsApp-groep of formulier | Play Console > *Testen* > *Interne test* > *Testers*: een lijst e-mailadressen (Google-accounts). Voor de gesloten test: dezelfde lijst, minstens 20 adressen. |
| Webtestlink | https://pietertmortier-lab.github.io/dont-slice-me/ | Rechtstreeks delen; staat ook bovenaan `README.md`. |
| Muziek | `music/` (zeven mp3's en de Suno-prompts) | Niets te doen; de app en de webversie laden ze uit deze map. |

Wat je zelf niet hoeft te plaatsen: de AdMob-plugin, RevenueCat en de Capacitor-instellingen staan al in `native/package.json` en `native/capacitor.config.json`; `npm install` haalt alles binnen.
