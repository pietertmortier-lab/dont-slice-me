# Don't Slice Me! - het stappenplan naar Google Play (15 november 2026, spel v0.32.10 in de interne test, v0.32.11 uitgebracht in je repo, v0.32.12 in aanbouw)

Dit is het enige actuele stappenplan. Het vervangt de versie van 23 oktober (v0.24.2). Elke stap is één handeling;
onder de stap staat wat je dan ziet. Stappen met **[GEDAAN]** zijn al klaar (stand 13 november 2026, 's nachts; de delen
over v0.32.12 zijn van 15 november).
Wat met **NIET NAGEKEKEN** gemarkeerd staat, kon Claude niet zelf controleren.
Wat al gedaan is, staat in deel 0 hieronder. Claude houdt daarnaast een volledig overzicht bij (niet in deze
repository) en leest dat eerst, voor hij je iets vraagt. Log bij Google altijd in met het spelaccount `dont.slice.me@gmail.com` (in Play Console is dat `/u/2/` in het
adres; Google Cloud-links openen anders met je persoonlijke account).

Wat erbij hoort, in deze repository:
- `PLAY-FORMULIEREN.md`: alle formulieren van Play Console, met de antwoorden.
- `store/winkelteksten.md`: titel, korte en lange beschrijving (NL en EN) en "Wat is er nieuw".
- `store/producten-play.md`: de producten met ID, prijs en soort.
- `PLAY-CONSOLE-v0.32.12.md`: wat je in Play Console doet bij v0.32.12 (de drie ticketproducten op inactief).
- `promo/screens/nl-1.png` ... `nl-6.png` en `en-1.png` ... `en-6.png`: de nieuwe schermafbeeldingen (v0.32.6).
- `promo/feature-graphic-nl.png` en `-en.png`: bijgewerkt (28 fruitsoorten, live vriendenduel).
- `native/`: de Android-schil (Capacitor 8) met je AdMob-codes, `native/README.md` voor de technische details,
  `native/assets/` (icoon en startscherm) en `native/.gitignore` (houdt bouwbestanden en sleutels uit GitHub).

Bronnen bij de regels van Google (opgezocht op 10 november 2026):
- "Meet Google Play's target API level requirement" (developer.android.com): sinds 31 augustus 2026 moeten nieuwe
  apps en updates **Android 16 (API 36)** targetten; uitstel kon tot 1 november 2026.
- "Support 16 KB page sizes" (developer.android.com): updates zonder 16 KB-ondersteuning worden vanaf
  **1 februari 2027** geweigerd.
- "App testing requirements for new personal developer accounts" (Play Console Help 14151465, gelezen via
  zoekresultaten): een persoonlijk account van na 13 november 2023 heeft een gesloten test nodig met **minstens 12
  testers die 14 dagen onafgebroken ingeschreven zijn**, voor je productie mag aanvragen.
- De hulppagina's op support.google.com kon ik niet rechtstreeks openen; waar een knop anders heet, kies wat
  hetzelfde betekent.

---

## 0. Stand van zaken

| Dienst | Gedaan | Nog te doen |
|---|---|---|
| Google Play Console | persoonlijk account "Don't Slice Me!" (eigenaar dont.slice.me@gmail.com); identiteit geverifieerd (26 oktober); handelaarsstatus Handelaar en telefoonnummer geverifieerd (10 november); app "Don't Slice Me!" aangemaakt als Game, kosteloos, pakketnaam `com.dontsliceme.app`, standaardtaal Engels (VS) en-US, voorwaarden Play App Signing aanvaard (10 november); formulier Advertenties ingevuld (10 november); de andere formulieren van App-content ingevuld (11 november, 's nachts); winkelvermelding Engels met Nederlandse vertaling (11 november); interne test met de lijst "intern" (8 testers): 0.32.7 (versionCode 1, 11 november), 0.32.8 (2, 11 november) en **0.32.10 (versionCode 4, 12 november, "Beschikbaar voor interne testers")**; betalingsprofiel gekoppeld, 11 eenmalige producten en 2 abonnementen actief (12 november, deel G); serviceaccount van RevenueCat met accountrechten (12 november, deel G); realtime meldingen (RTDN) aan (12 november, deel G) | de regel onder FAIR PLAY / EERLIJK SPELEN in de winkelbeschrijving (v0.32.9, zie hieronder); bij v0.32.11 de beschrijving van `hearts_5` (zie hieronder); bij v0.32.12 `tickets_5`, `tickets_15` en `weekpass` op inactief, pas als v0.32.12 in de test staat (zie hieronder); formulier Advertentie-ID (verscheen nog niet, NIET NAGEKEKEN of het er nu staat); gesloten test (deel F); productie (deel H) |
| Licentietests (Play Console, alle apps > Instellingen > Licentietests) | nieuwe lijst **"licentietesters"** (jij en je vriendin) aangevinkt; de lijst "intern" (8 testers) **niet** meer aangevinkt (13 november). Alleen wie in een aangevinkte lijst staat, koopt met de testkaart en betaalt niet echt | niets. Let op: de andere interne testers betalen nu **echt** als ze iets kopen. Je eerste echte verkoop kan dus al in de test komen; `PLAY-FORMULIEREN.md`, deel 9, raadt aan om voor de eerste echte verkoop met je boekhouder te praten |
| Google Cloud (voor RevenueCat) | organisatie `dont-slice-me-org`; project hernoemd naar **"Don't Slice Me!"** (het project-ID staat in je Google Cloud-console); API's aan: Google Play Android Developer API, Google Play Developer Reporting API, Cloud Pub/Sub API; serviceaccount `revenuecat@...` (het volledige adres staat in je Google Cloud-console) met de rollen **Pub/Sub Admin** en **Monitoring Viewer**; JSON-sleutel gemaakt en in RevenueCat gezet (12 november). Over de organisatieregel: de regel `iam.disableServiceAccountKeyCreation` verbood een sleutel. Je gaf jezelf de rol Organization Policy Administrator, zette de regel tijdelijk uit voor alleen dit project, maakte de sleutel, en zette de regel daarna terug op "overnemen van bovenliggend" (inherit) | niets. Bewaar het JSON-bestand buiten GitHub en stuur het naar niemand. Dit is een **ander** project dan het Firebase-project `dont-slice-me`: deze sleutel werkt **niet** voor de twee hulpscripts (zie hieronder) |
| Firebase | project `dont-slice-me`, web-app, anonieme login, Firestore, Blaze en Google Cloud betaald account (9 november), regels en functies uitgerold (9 november, alle functies), opruimregel `ghosts` actief (9 november), geheim `LIVEDUEL_VAPID` en live duel (10 november); Realtime Database in België (11 november); server, Firestore-regels en Realtime Database-regels van v0.32.10 uitgerold (12 november, `firebase deploy --only functions,firestore,database`; dat dekt ook de server van v0.32.9) | sleutel voor de twee hulpscripts en, optioneel, de TTL-regel (zie "Wat jij nog moet doen voor v0.32.9" hieronder); pushmeldingen in de app: later, deel A |
| AdMob | account en betalingsprofiel geverifieerd, account goedgekeurd, app met twee blokken (Beloning, Tussenreclame), AVG-toestemmingsbericht gepubliceerd, je telefoon "GSM Pieter" als testapparaat (5 november); de echte codes staan in `native/bridge.js` en `capacitor.config.json` en zitten in de app (sinds 0.32.7) | belastinggegevens, inhoudsclassificatie PG, app-ads.txt, later koppelen aan Google Play, eventueel "Alternatieve toestemmingsverzameling" (deel B) |
| RevenueCat | project, Google Play-app, public key in `bridge.js`, entitlements `plus`, `noads`, `pass` (23 oktober); JSON van het serviceaccount geüpload: **Valid credentials**; 9 producten geïmporteerd (`bundle_all` non-consumable, de andere consumable) naast de bestaande `noads` (non-consumable, aan `noads`) en `pass`; `plus_month:monthly` en `plus_year:yearly` aan `plus`; `pass` losgekoppeld van entitlement `pass` (de entitlement blijft, leeg); `don_t_slice_me_pro` is weg; Google-ontwikkelaarsmeldingen gekoppeld (testmelding ontvangen); 2 testaankopen `sap_3000` gelukt, zichtbaar bij Customers > Sandbox (12-13 november, deel G) | testaankoop Reclamevrij en "Aankopen herstellen" (deel G, stap 11). De Fruitpas per seizoen is beslist (15 november, keuze 2A): `pass` blijft aan geen entitlement hangen; niets te doen |
| Pc | Node v24.21.0, npm, Git, firebase-tools 15.35.0, Android Studio met SDK en emulator "Medium Phone API 37.0", jbr-17 met het Norton-certificaat (23 oktober); je repo staat in `C:\Users\piete\dont-slice-me`; Capacitor 8-project, upload-sleutel (`C:\Users\piete\sleutels\dontsliceme-upload.jks`) en ondertekende bundels gebouwd (11-12 november, laatste versionCode 4) | bij elke nieuwe versie: `git pull`, `npm run sync`, `versionCode` +1 (v0.32.11 wordt versionCode 5, v0.32.12 versionCode 6) |
| GitHub | repo `dont-slice-me` met Pages (testlink), privacybeleid online (laatste versie met v0.32.10) | later de repo `pietertmortier-lab.github.io` voor app-ads.txt (deel B, stap 8) |

### Wat Claude nog in het spel moet herstellen (jij hoeft hier niets voor te doen)

Voor de **eerste interne test**:
1. **[GEDAAN in v0.32.7 en v0.32.12]** De knop "Koop de Fruitpas · € 4,99" op het Fruitpas-tabblad en de knop "Laatste
   stempel · € 0,49" gaven in de app hun inhoud gratis. De Fruitpas loopt via Google Play (v0.32.7); de stempel voor geld
   is helemaal weg (v0.32.12, keuze 4A).
2. De winkel zegt in de app "Alle aankopen zijn een simulatie". Dat moet weg.
3. Een link naar het privacybeleid in Instellingen/Hulp (Google eist dat).
4. De deellinks wijzen in de app naar `localhost`. (De nieuwe brug lost dit al op bij het delen.)
5. Reclamevrij en Plus: de winkel belooft "geen filmpjes meer, je krijgt de beloning meteen". In de app speelde toch
   een video. De nieuwe brug slaat de video nu over (getest); in het spel zelf komt dezelfde controle in `ADS.show`,
   met een eigen test.
6. Engelse versie: getallen met punt en komma zoals in het Engels (25.4 s, 12,840) en DIAMANT/GOUD/ZILVER vertaald
   (DIAMOND/GOLD/SILVER). Daarna maakt Claude de Engelse schermafbeeldingen opnieuw. Tot dan tonen `en-1` ... `en-6`
   nog "25,4 s", "12.840" en "DIAMANT". Omdat je standaardtaal Engels is, zijn dat de beelden van je hoofdvermelding.

Voor de **gesloten test** (je testers zijn echte mensen in de EU en betalen echt):
7. **[GEDAAN in v0.32.9]** Een knop "Account verwijderen" in Instellingen, met een bevestiging, en de serveractie die alles van die speler
   wist (profiel, opslag, vrienden, duels, scores, meldingsadressen, live duels). Plus een klein script voor Claude
   om verzoeken per mail uit te voeren. Google eist een manier die in de app begint; zonder deze knop alleen de
   interne test.
8. Een knop "Privacy en advertenties" in Instellingen (toestemming wijzigen of intrekken), zichtbaar als Google dat
   vraagt. De brug heeft hem al klaar (`FV_NATIVE.privacyOptions()`).
9. **[GEDAAN in v0.32.9]** Plus: voor de aankoop de tekst "Plus: € 2,99 per maand (of € 19,99 per jaar), verlengt automatisch tot je opzegt.
   Opzeggen: Google Play > Betalingen en abonnementen > Abonnementen", met de prijs van Google Play. Is Plus actief,
   dan geen knoppen "+1 maand / +1 jaar" meer maar "Beheren in Google Play". "Opzeggen" gaat naar Google Play, en
   Plus leest de echte status van Google (`FV_NATIVE.plusStatus()`).
10. **[GEDAAN in v0.32.9]** (jouw keuze: alle fruit lenen) Eerlijke duels: in de openbare duels en de duels van 24 uur krijgen beide spelers hetzelfde fruit (zoals in het
    live duel), of de fruittrucs staan uit. `bundle_all` geeft alleen fruit tot je eigen level. Zie
    `store/producten-play.md`, deel C.
11. **[GEDAAN in v0.32.9]** Spelersnamen: een filter op ongepaste namen (NL en EN) op de server, een knop "Meld deze naam" bij schimmen,
    zoekresultaten en verzoeken, een knop "Blokkeer", en `voorwaarden.html` (NL en EN) met de regels voor namen,
    gelinkt in Instellingen, bij Hulp, bij Plus en bij het kiezen van een naam (niet in de winkelvermelding: dat hoeft niet).
    Google eist dat voor inhoud die spelers zelf maken.

Wat jij nog moet doen voor v0.32.9 (stand 13 november):
- **[GEDAAN, 12 november, samen met v0.32.10]** Server en regels online zetten, **voor** de nieuwe app bij testers komt:
  `cd native/tourney`, dan `firebase deploy --only functions,firestore`. Je deed meteen de uitrol van v0.32.10
  (`firebase deploy --only functions,firestore,database`); die bevat ook alles van v0.32.9.
- **[GEDAAN, 12 november, als v0.32.10]** De app bouwen: in `native` eerst `npm install` (nieuwe plugin voor
  uitnodigingen via Google Play), dan `npm run sync`. v0.32.9 zelf hoefde niet meer apart in de test: je zette meteen
  **v0.32.10 (versionCode 4, versionName "0.32.10")** in de interne test ("Beschikbaar voor interne testers"). Of
  versionCode 3 (0.32.9) ooit geüpload werd: NIET NAGEKEKEN, en het maakt niet uit: de volgende versie wordt versionCode 5.
  Alles over de uitnodigingen staat ook in `native/UITNODIGEN-VIA-GOOGLE-PLAY.md`.
- **[NOG TE DOEN]** Eén keer een sleutel voor de twee hulpscripts (verwijderverzoeken per mail en meldingen van namen).
  Let op: de JSON-sleutel die je op 12 november voor RevenueCat maakte, is een **andere** sleutel (ander project, andere
  rechten); gebruik die hier niet. Je hebt een sleutel van het Firebase-project `dont-slice-me` nodig: Firebase-console
  > Projectinstellingen > Serviceaccounts > **Nieuwe privésleutel genereren**. Bewaar het `.json`-bestand buiten GitHub,
  bijvoorbeeld `C:\sleutels\dont-slice-me-admin.json`, en stuur het naar niemand. Daarna in PowerShell, in
  `native\tourney` (na `npm install`):
  - `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\sleutels\dont-slice-me-admin.json"`
  - `node tools/delete-player.cjs <vriendencode>` (proefdraai: er wordt niets gewist), daarna met `--yes` erachter
    om echt te wissen. Mail de speler daarna dat alles weg is.
  - `node tools/reports.cjs list` (open meldingen van namen); `node tools/reports.cjs approve <wie> --yes` (de naam is
    in orde), `rename <wie> --yes` (verbergen en om een nieuwe naam vragen), `clear <wie> --yes` (meldingen weg).
    Zonder `--yes` verandert er niets. **Elke week:** `node tools/reports.cjs list` (open meldingen en verborgen namen;
    spelers krijgen "Bedankt! We kijken het na." als ze melden, dus kijk ook echt).
- **[NOG TE DOEN, optioneel]** Eén keer: `gcloud firestore fields ttls update expireAt --collection-group=devices --enable-ttl --project=dont-slice-me`
  (de kleine merktekens van verwijderde accounts verdwijnen dan na 2 dagen; zonder blijven ze staan, er staat niets
  persoonlijks in). Voor zover Claude weet nog niet gedaan (NIET NAGEKEKEN).
- Play Console:
  - **[GEDAAN, 12 november]** De beschrijving van `bundle_all`: je maakte het product meteen met de nieuwe tekst uit
    `store/producten-play.md` (deel E, punt 4).
  - **[NOG TE DOEN]** De winkelvermelding (Engels en Nederlands) bestond al. Zet er nu de nieuwe regel van v0.32.9 bij,
    onder FAIR PLAY (Engels) en EERLIJK SPELEN (Nederlands); v0.32.10 staat in de test, dus het mag nu. De regels staan
    in `store/winkelteksten.md`:
    - EN: "In duels only skill counts: everyone may borrow any of the 20 classic fruits, and fruit bonuses do not count there."
    - NL: "In duels telt alleen hoe goed je speelt: iedereen mag elk van de 20 gewone fruitsoorten lenen, en fruitbonussen tellen daar niet."
  - Het veld Website laat je leeg.
  - **[NIET NAGEKEKEN]** Gegevensveiligheid: zie PLAY-FORMULIEREN.md, deel 8 (Aankoopgeschiedenis kreeg een zin bij).
- Testen: TESTLIJST-v0.32.9.md is vervangen door TESTLIJST-v0.32.10.md (en straks TESTLIJST-v0.32.11.md en TESTLIJST-v0.32.12.md).

Wat jij moet doen bij v0.32.11 (uitgebracht in je repo op 15 november; dit zijn de stappen van die release, doe ze vóór v0.32.12):
- **Eerst de server**, voor de nieuwe app bij testers komt: `cd native\tourney`, dan
  `firebase deploy --only functions,firestore,database`. Wacht tot er "Deploy complete!" staat. De nieuwe regels van de
  Realtime Database en de nieuwe functie horen bij elkaar; oudere apps blijven gewoon werken.
- Dan de app: in `native` eerst `npm run sync` (er zit een nieuwe `native/bridge.js` in, voor de reclame; zonder sync
  blijft de oude in de app). De app wordt **versionCode 5**, versionName "0.32.11".
- Play Console: verander de beschrijving van `hearts_5`, want vanaf v0.32.11 mogen gekochte hartjes boven je maximum
  gaan (niets wordt nog sap). **Inkomsten genereren** > **Producten** > **Eenmalige producten** > `hearts_5` >
  beschrijving vervangen > **Opslaan**. Doe dit pas als v0.32.11 in de test staat (zie `store/producten-play.md`, deel E, punt 5):
  - EN: `5 hearts at once, also above your maximum.`
  - NL: `5 hartjes meteen, ook boven je maximum.`

Wat jij moet doen bij v0.32.12 (jouw keuzes "1A, 2A, 3A, 4A" van 15 november; nog niet uitgebracht, komt na v0.32.11 en
voor de gesloten test):
- Geen server: v0.32.12 verandert niets aan de functies of regels van Firebase. Geen `firebase deploy`.
- De app: in `native` eerst `npm run sync` (er zit een nieuwe `native/bridge.js` in: hij leest een aankoop die later
  binnenkomt). De app wordt **versionCode 6**, versionName "0.32.12". Zet hem in de interne test zoals altijd (deel E,
  stap 4, 6, 7 en 8), met de releaseopmerkingen voor v0.32.12 uit `store/winkelteksten.md`.
- Pas als v0.32.12 in de interne test staat en je zelf hebt bijgewerkt: zet in Play Console `tickets_5`, `tickets_15` en
  `weekpass` op **inactief** (de stappen staan in `PLAY-CONSOLE-v0.32.12.md`). Niet eerder: een oudere versie toont de
  knoppen nog, en die doen dan niets meer. Niet verwijderen.
- In RevenueCat hoeft niets.
- Testen: `TESTLIJST-v0.32.12.md`.
Wat er in het spel verandert: toernooitickets zijn nergens meer te koop (geen pakketten, geen Weekpas, geen ticket voor sap
of na een filmpje, geen extra ticket met Plus); iedereen krijgt elke dag 10 gratis tickets; bewaarde tickets worden één keer
1.000 sap per stuk, een lopende Weekpas 9.000 sap (het fragment van zondag komt nog); een aankoop van een ticketproduct die
nog binnenkomt, wordt sap. De Fruitpas toont "geldt tot 30 november, nog 17 dagen" en is niet te koop in de laatste 3 dagen
van de maand; "Aankopen herstellen" zegt alleen nog "Plus of Reclamevrij". Van de fruitmanden blijft alleen Alles-in-één.

Voor de **productie**:
12. **[BESLIST, 15 november: 3A, gebouwd in v0.32.12]** De Fruitmanden met wisselende prijs zijn weg; alleen Alles-in-één
    (`bundle_all`) blijft (zie `store/producten-play.md`, deel B).
13. **[BESLIST, 15 november: 1A en 2A, gebouwd in v0.32.12]** Jouw beslissingen (zie `store/producten-play.md`, deel A2, B en C):
    - tickets, Weekpas en het extra ticket van Plus: weg; iedereen 10 gratis tickets per dag;
    - de Fruitpas per seizoen: één product `pass`, niet herstellen via Google, met de einddatum op de koopknop en niet te
      koop in de laatste 3 dagen van de maand.

---

## A. Firebase (al klaar)

1. **[GEDAAN]** Project, anonieme login, Firestore, Blaze-plan en de functies (laatste uitrol 10 november, live duel),
   de opruimregel voor `ghosts` (9 november) en het geheim `LIVEDUEL_VAPID` (10 november). Voer de regel met
   `generate-vapid-keys` **nooit** opnieuw uit: een nieuwe sleutel maakt alle meldingen ongeldig.
2. Niets te doen voor de eerste test. Pushmeldingen in de app staan uit; die zetten we later samen aan
   (Android-app toevoegen in Firebase, `google-services.json`, `FCM_READY = true`).

---

## B. AdMob

1. **[GEDAAN, 5 november]** App en twee advertentieblokken aangemaakt, AVG-bericht gepubliceerd, testapparaat
   "GSM Pieter".
2. **[Claude]** De drie codes staan in de nieuwe `native/bridge.js` en `capacitor.config.json` (met `testing: true`).
   Ze komen op je pc zodra Claude de bestanden in je repo heeft gezet en jij `git pull` doet (deel C, stap 6).
   De app-ID zet jij in het manifest bij deel C, stap 14.
3. Open https://admob.google.com (ingelogd met het account waarmee je AdMob maakte) en klik links **Betalingen**.
   Je ziet: je betalingsprofiel. Dat bestaat al: je maakte het op 26 oktober en het is geverifieerd (anders had
   AdMob je account op 5 november niet goedgekeurd). Je hoeft het niet opnieuw te maken.
4. Zie je bij **Betalingen** al de knop **Betaalmethode toevoegen**, vul dan je IBAN in.
   Zie je hem nog niet, sla deze stap over: AdMob vraagt hem pas als je genoeg verdiend hebt (na de pincode per
   post, die Google stuurt zodra je verdiensten een drempel halen; die vul je dan hier in).
5. Vul bij **Belastinginformatie** het formulier voor een particulier buiten de VS in (meestal W-8BEN).
   Je ziet: "Belastinginformatie ingediend".
6. Klik links **Blokkeringsinstellingen** > **Alle apps** (of je app) > **Inhoud** > **Maximale
   advertentie-inhoudsclassificatie** en kies **PG**.
   Je ziet: "PG" geselecteerd. (Zo ziet een speler van 13 geen advertenties voor volwassenen; de app vraagt hetzelfde.)
7. Later, als de app openbaar in Google Play staat: **Apps** > Don't Slice Me! > **App-instellingen** >
   **Winkel toevoegen** > zoek `com.dontsliceme.app`.
   Je ziet: de app gekoppeld aan Google Play.
8. Later, app-ads.txt (aangeraden, anders krijg je minder advertenties): maak op GitHub een nieuwe repository met
   de naam `pietertmortier-lab.github.io`, zet er een bestand `app-ads.txt` in met de regel die AdMob toont bij
   **Apps** > **app-ads.txt** (begint met `google.com, pub-9632519764252496, DIRECT`). Claude kan dit klaarzetten.
   Je ziet na een dag in AdMob: "app-ads.txt gevonden".

---

## C. De app bouwen op je pc

Eén keer installeren:
1. **[GEDAAN, 23 oktober]** Node staat erop: `node -v` gaf `v24.21.0` en `npm -v` gaf `11.19.0` (je koos de installer
   24.22.1). Niet opnieuw installeren. Ook Git en firebase-tools (15.35.0) staan erop.
2. **[GEDAAN, 23 oktober]** Android Studio staat erop (SDK in `C:\Users\piete\AppData\Local\Android\Sdk`, emulator
   "Medium Phone API 37.0"). Alleen bijwerken: open Android Studio > **Help** > **Check for Updates...** (op sommige
   versies **File** > **Settings** > **Appearance & Behavior** > **System Settings** > **Updates**). Is er een update,
   installeer ze.
   Je ziet: "You already have the latest version" of de update wordt geïnstalleerd.
3. In Android Studio: **More Actions** > **SDK Manager** > tab **SDK Platforms**: vink **Android 16 (API 36)** aan >
   **Apply**.
   Je ziet: "Installed" naast Android 16.
4. Java 21 en het Norton-certificaat. Capacitor 8 heeft Java 21 nodig; de jbr-17 die je op 23 oktober instelde is te
   oud. Op je pc onderschept Norton Antivirus de beveiligde verbindingen ("Norton Web/Mail Shield Root"). Daarom
   moet het Norton-certificaat in **elke** Java die Gradle gebruikt, ook in de nieuwe Java 21. Zonder dat krijg je
   bij het syncen opnieuw "PKIX path building failed".
   Stap 4b tot 4f doe je pas na stap 17, als het project open is in Android Studio. Stap 18 stuurt je hierheen terug.
4b. Java 21 ophalen: in Android Studio **File** > **Settings** > **Build, Execution, Deployment** > **Build Tools** >
    **Gradle**. Kies bij **Gradle JDK** een regel met **21** (bijvoorbeeld "jbr-21"). Staat die er niet, kies
    **Download JDK...**, zet **Version** op **21** en **Vendor** op **JetBrains Runtime** > **Download**. Hij komt in
    `C:\Users\piete\.jdks`. Klik **OK**.
    Je ziet: bij Gradle JDK een regel met 21.
4c. Het certificaat staat nog op je pc van 23 oktober: `C:\Users\piete\norton-root.crt`. (Is het weg: exporteer het
    opnieuw zoals toen, via het slotje in Chrome > certificaat > **Norton Web/Mail Shield Root** > **Exporteren...**,
    type "Base64-gecodeerd ASCII, één certificaat".)
4d. Zoek de exacte mapnaam van Java 21: in PowerShell `dir C:\Users\piete\.jdks`.
    Je ziet: een map zoals `jbr-21.0.x` naast je oude `jbr-17.0.14`.
4e. Zet het certificaat erin, één regel in PowerShell (vervang `jbr-21.0.x` door de mapnaam uit stap 4d):
    `& "C:\Users\piete\.jdks\jbr-21.0.x\bin\keytool.exe" -importcert -trustcacerts -cacerts -storepass changeit -noprompt -alias norton -file C:\Users\piete\norton-root.crt`
    Je ziet: "Certificate was added to keystore".
4f. Stop oude Gradle-processen: sluit Android Studio en typ in PowerShell `Get-Process java | Stop-Process`. Open
    Android Studio opnieuw en klik **Try Again** (of **Sync Now**).
    Je ziet: de synchronisatie loopt zonder "PKIX". Komt "PKIX" toch terug, stuur dan de uitvoer van
    `dir C:\Users\piete\.jdks` en een schermafbeelding van het Gradle JDK-venster.

De app maken (één keer):
5. Open PowerShell en ga naar je map: `cd C:\Users\piete\dont-slice-me`
6. Haal de nieuwste versie: `git pull`
   Je ziet: de nieuwe bestanden in `native/` (README van 10 november).
7. `cd native`
8. Je hebt een map `native\android` van 23 oktober (gemaakt met Capacitor 6, met de testcode van AdMob in het
   manifest). Die moet weg. Sluit eerst Android Studio. Typ dan in PowerShell (je staat in `native`):
   `Remove-Item -Recurse -Force android`
   en, voor de zekerheid, ook de oude pakketten: `Remove-Item -Recurse -Force node_modules`
   Je ziet: geen foutmelding; `dir` toont geen map `android` en geen map `node_modules` meer.
9. `npm install`
   Je ziet: "added ... packages" zonder ERR. (Waarschuwingen mag je negeren.)
10. `npm run www`
    Je ziet: `www ready: bridge.js, icons, index.html, manifest.webmanifest, music (20.7 MB)`.
11. `npx cap add android`
    Je ziet: "Adding native android project" en een nieuwe map `native\android`.
    (Op 23 oktober zei ik dat dit eenmalig was. Het moet nu één keer opnieuw, omdat de app van Capacitor 6 naar
    Capacitor 8 gaat. Daarna niet meer: bij volgende versies volstaat `npm run sync`.)
12. Controleer de target API: open `native\android\variables.gradle` in Kladblok.
    Je ziet: `compileSdkVersion = 36` en `targetSdkVersion = 36`. Staat er iets lagers, stop en stuur me de file.
13. Open `native\android\app\src\main\AndroidManifest.xml` in Kladblok.
14. Zet binnen `<application ...>`, op een nieuwe regel net boven `<activity`, deze regel en sla op:
    `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-9632519764252496~5730966023"/>`
    Je ziet: de regel staat tussen `<application` en `<activity`. Zonder deze regel crasht de app bij het starten.
    Let op: kopieer **niet** de regel uit je oude manifest van 23 oktober. Die had de testcode van Google
    (`ca-app-pub-3940256099942544~3347511713`). Er mag maar één zo'n regel staan, en de juiste eindigt op
    `~5730966023`. Zet de regel er ook maar één keer in: op 23 oktober stond het `<activity>`-blok per ongeluk dubbel.
15. Zet in dezelfde file bij `<activity` er `android:screenOrientation="portrait"` bij (na `android:name=".MainActivity"`)
    en sla op.
15b. Open `native\android\app\src\main\res\values\strings.xml` in Kladblok. Zet bij `app_name` en
    `title_activity_main` een schuine streep voor de apostrof: `Don\'t Slice Me!` > opslaan.
    Je ziet: twee regels met `Don\'t`. (Capacitor zet de naam er zonder die streep in; zonder streep kan het bouwen
    mislukken of verdwijnt de apostrof onder het icoon.)
15c. `npm run assets`
    Je ziet: regels met "CREATE android icon" en "CREATE android splash" en onderaan "Totals". Zo krijgt de app het
    appel-icoon (ook rond en aanpasbaar) en een donker startscherm met de appel, in plaats van het logo van
    Capacitor.
16. `npx cap sync android`
    Je ziet: "Sync finished".
17. `npx cap open android`
    Je ziet: Android Studio opent het project en begint te "syncen" (balk onderaan; de eerste keer enkele minuten).
    Mislukt die eerste sync met een melding over Java of "PKIX", dan los je dat op in stap 18.
18. Controleer in Android Studio: **File** > **Settings** > **Build, Execution, Deployment** > **Build Tools** >
    **Gradle** > **Gradle JDK**. Het staat waarschijnlijk nog op **jbr-17** van 23 oktober; dat is te oud. Doe nu
    stap 4b tot 4f: Java 21 kiezen (**jbr-21**) en er het Norton-certificaat in zetten. Kies niet "Embedded JDK":
    die Java heeft het Norton-certificaat niet (en is op jouw Android Studio misschien Java 25; eerder koos je per
    ongeluk 25 en 27).
    Je ziet: na **Sync Now** onderaan "BUILD SUCCESSFUL" (zoals op 23 oktober). Zie je "PKIX", ga terug naar stap 4e.

Het icoon:
19. Niets te doen: stap 15c maakte het icoon al. (Controle: in Android Studio links **app** > **res** > **mipmap**
    staat `ic_launcher` met de appel.)
20. (vervallen)

Versienummer:
21. Open in Android Studio `app` > `build.gradle` (Module :app). Zet `versionCode 1` en `versionName "0.32.6"`.
    Bij elke volgende upload: `versionCode` één hoger (2, 3, ...); `versionName` = de spelversie.
    Klik bovenaan **Sync Now**.
21b. Niet verplicht: wil je dat Claude je Android-instellingen nakijkt? Open dan `native\android\variables.gradle`
    en `native\android\app\src\main\AndroidManifest.xml` in Kladblok en plak de inhoud in het gesprek (daar staat
    niets geheims in). Stuur nooit je `.jks`-bestand of de wachtwoorden.

Eerst proberen op je eigen telefoon (aangeraden), of op de testtelefoon op je pc:
(Snelste weg: kies bovenaan in Android Studio de emulator **Medium Phone API 37.0**, die je op 23 oktober al
gebruikte, en ga naar stap 23. De echte telefoon is beter voor reclame en Delen, want je telefoon "GSM Pieter" staat
in AdMob als testapparaat.)
22. Telefoon: **Instellingen** > **Over de telefoon** > (bij een Samsung: **Software-informatie**) > tik 7 keer op
    **Buildnummer**. Heet het bij jou anders, stuur dan het merk van je telefoon.
    Je ziet: "Je bent nu ontwikkelaar" (of "Ontwikkelaarsmodus is ingeschakeld").
22b. Telefoon: **Instellingen** > **Ontwikkelaarsopties** > zet **USB-foutopsporing** aan.
22c. Sluit de telefoon met een kabel aan op de pc.
    Je ziet op de telefoon "USB-foutopsporing toestaan?": vink "Altijd toestaan" aan > **Toestaan**. In Android
    Studio staat bovenaan je telefoonnaam naast de groene ▶.
23. Klik in Android Studio op de groene ▶ (**Run 'app'**).
    Je ziet: de app opent op je telefoon. Bij de eerste start verschijnt het toestemmingsformulier van Google
    (advertenties). Kies wat je wilt. Daarna het spel. Een beloningsvideo toont een **testadvertentie** (met het
    label "Test Ad"). Probeer ook de terugknop (pauzeert een poging) en Delen.
    Aankopen werken hier nog niet: dat kan pas na de upload in deel E.

De ondertekende App Bundle (.aab):
24. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
25. Klik **Create new...** (alleen de eerste keer) bij Key store path. Kies een map buiten GitHub, bijvoorbeeld
    `C:\Users\piete\sleutels\dontsliceme-upload.jks`. Vul twee wachtwoorden in, alias `upload`, geldigheid
    **25 jaar of meer**, en je naam bij First and Last Name. **OK**.
26. Bewaar het `.jks`-bestand en de twee wachtwoorden **op twee plaatsen** (bijvoorbeeld je NAS en een
    wachtwoordmanager). Nooit in GitHub. Met Play App Signing (deel E, stap 5) kan Google een verloren uploadsleutel
    vervangen, maar dat kost tijd.
27. Klik **Next**, kies **release** > **Create**.
    Je ziet rechtsonder "Generate Signed Bundle: ... successfully" met een link **locate**. Het bestand is
    `native\android\app\release\app-release.aab`.
28. 16 KB-controle: **Build** > **Analyze APK...** > kies dat `.aab`.
    Is er geen map `lib`: klaar, er is niets te controleren (Capacitor, AdMob en RevenueCat zijn Java/Kotlin).
    Is er een map `lib`: open ze en kijk naar de kolom **Alignment**. Staat er nergens een waarschuwing, dan is het
    goed. Staat er een waarschuwing, stuur me een schermafbeelding (verplicht voor updates vanaf 1 februari 2027).
    Play Console toont na de upload ook een melding als het niet klopt.

Bij elke volgende versie: `git pull`, `cd native`, `npm run sync`, in Android Studio `versionCode` +1, stap 24 en
27 opnieuw (met dezelfde keystore). `npm run assets` alleen als Claude de beelden in `native/assets/` veranderde.

---

## D. Play Console: de app aanmaken en de winkelvermelding

1. **[GEDAAN, 10 november]** De app is aangemaakt: Game, Kosteloos, de drie verklaringen aangevinkt
   (programmabeleid, Play App Signing, Amerikaanse exportwetgeving).
2. **[GEDAAN, 10 november]** Appnaam **Don't Slice Me!** (met uitroepteken), pakketnaam **com.dontsliceme.app** en
   standaardtaal **Engels (Verenigde Staten) – en-US**. Je hoofdwinkelvermelding is dus **Engels**; Nederlands voeg
   je toe als vertaling (stap 10).
3. (Bezig sinds 10 november.) Open **App-content** met deze link (ingelogd als `dont.slice.me@gmail.com`):
   `https://play.google.com/console/u/2/developers/4671644808703726207/app/4972954736761844619/app-content/overview`
   Of via het **Dashboard** > "Instelling van je game afronden" > **Taken tonen** (daar staan niet alle formulieren;
   de link is de zekerste weg). Niet via het schildje in de balk links: dat is "Beveiligd met Play".
   Je ziet: de pagina App-content met de formulieren onder **Te doen** of **Actie vereist**, en bij **Advertenties**
   al een vinkje.
3b. **[GEDAAN, 10 november]** Advertenties ("Ja, mijn app bevat advertenties", opgeslagen).
3c. Kijk of **Privacybeleid** en **App-toegang** een groen vinkje hebben (waarschijnlijk wel). Zo niet: vul ze in
    met `PLAY-FORMULIEREN.md`, punt 1 en 2.
    Je ziet: bij allebei een groen vinkje.
3d. Het volgende formulier: **Advertentie-ID** (`PLAY-FORMULIEREN.md`, punt 4).
    Je ziet: een groen vinkje bij Advertentie-ID.
3e. Daarna: **Contentclassificatie**, de IARC-vragenlijst (`PLAY-FORMULIEREN.md`, punt 5).
    Je ziet: een leeftijd per land en een groen vinkje.
3f. Dan de rest met `PLAY-FORMULIEREN.md`: doelgroep, nieuws, overheid, financieel, gezondheid, gegevensveiligheid.
    Na elk formulier staat "Versturen voor beoordeling in Publicatieoverzicht": dat doe je nog niet (Google
    beoordeelt alles samen met je eerste testversie).
    Je ziet: bij elk formulier een groen vinkje.
4. Klik **Groeien** > **Winkelvermelding** > **Hoofdwinkelvermelding**.
   Je ziet: bovenaan de taal **Engels (Verenigde Staten) – en-US**. (Staat er toch Nederlands, stuur me een
   schermafbeelding.)
5. Plak de Engelse **App name**, **Short description** en **Full description** uit `store/winkelteksten.md` (het
   deel "English"). Het vak App name toont nu "Don't Slice Me!"; vervang het door de naam uit dat bestand
   ("Don't Slice Me! Dodge knives").
   Je ziet: onder elk vak het aantal tekens, niets in het rood.
6. **App-pictogram**: upload `icons/icon-512.png`.
7. **Feature graphic**: upload `promo/feature-graphic-en.png`.
8. **Schermafbeeldingen voor telefoon**: upload `promo/screens/en-1.png` tot `en-6.png`, in die volgorde.
   Je ziet: zes staande beelden. (Tablet-schermafbeeldingen zijn niet verplicht.)
   Deze Engelse beelden tonen nog "25,4 s" en "DIAMANT" (deel 0, punt 6). Upload ze nu; zodra Claude verbeterde
   `en-1` ... `en-6` in de repository zet, vervang je ze hier.
9. **Video** (niet verplicht, mag later): sla over tot Claude de nieuwe promofilm (`promo/dont-slice-me-en.mp4`) in
   de repository heeft gezet. Staat hij er: upload hem op YouTube: **Maken** > **Video uploaden** > zichtbaarheid
   **Niet vermeld**, "Niet gemaakt voor kinderen", geen leeftijdsbeperking. Plak de YouTube-link in het veld
   **Video**.
10. Klik **Vertalingen beheren** > **Eigen vertalingen toevoegen** > **Nederlands – nl-NL** en vul de Nederlandse
    teksten, `promo/feature-graphic-nl.png`, `promo/screens/nl-1.png` ... `nl-6.png` en de Nederlandse video
    (`promo/dont-slice-me-nl.mp4`, als die er staat) in.
    Je ziet: naast Engels (VS) staat nu ook Nederlands.
11. Klik **Opslaan**.
    Je ziet: "Wijzigingen opgeslagen". Fouten (te lange tekst, ontbrekende afbeelding) staan rood bij het veld.
12. **Winkelinstellingen**: categorie **Arcade**, tags (zie `store/winkelteksten.md`), e-mail
    `dont.slice.me@gmail.com`, website **leeg laten** (het webspel stuur je niemand meer) > **Opslaan**.
    (In je **Accountgegevens** mag "Ik heb geen website" aangevinkt blijven. Pas als AdMob om app-ads.txt vraagt, komt
    er een korte pagina op `https://pietertmortier-lab.github.io/` die naar Google Play wijst; nooit `/dont-slice-me/`.)

---

## E. Interne test (jij en een paar vrienden)

**[GEDAAN, 11-13 november]** De interne test loopt. Wat er gebeurde, kort: lijst "intern" (8 testers), 0.32.7
(versionCode 1) op 11 november, 0.32.8 (versionCode 2) op 11 november en 0.32.10 (versionCode 4) op 12 november,
telkens "Beschikbaar voor interne testers". De stappen hieronder blijven staan als naslag; bij een nieuwe versie doe je
alleen stap 4, 6, 7 en 8 opnieuw (met de nieuwe versie en releasenaam).

1. **[GEDAAN, 11 november]** Klik **Testen en releasen** > **Testen** > **Interne test** > tab **Testers** > **E-maillijst maken**.
2. **[GEDAAN, 11 november]** Naam "Intern", voeg je eigen Gmail-adres en die van 2 tot 5 vrienden toe > **Opslaan**.
   Vink de lijst aan > **Opslaan**. (De lijst "intern" heeft nu 8 testers.)
3. Vul bij **Feedback-URL of e-mailadres** `dont.slice.me@gmail.com` in > **Opslaan**. (NIET NAGEKEKEN of dit ingevuld is.)
4. **[GEDAAN]** Tab **Releases** > **Nieuwe release maken**.
5. **[GEDAAN]** App-ondertekening door Google Play: de voorwaarden aanvaardde je al bij het aanmaken van de app (10 november).
   Vraagt Play Console het hier toch, kies **Doorgaan** (Google maakt en bewaart de echte sleutel; jouw `.jks` wordt
   de uploadsleutel).
   Je ziet: "Ondertekening van releases door Google Play is ingeschakeld" (of geen vraag).
6. **[GEDAAN, laatste keer 12 november]** Sleep `app-release.aab` naar **App-bundels**.
   Je ziet: versie "1 (0.32.6)". Rode fouten (bijvoorbeeld target API of advertentie-ID) moeten weg; gele
   waarschuwingen (bijvoorbeeld "geen symbolen voor native code") mag je meestal negeren. Stuur me elke melding.
   (De eerste upload werd "1 (0.32.7)"; de laatste is "4 (0.32.10)".)
7. **[GEDAAN, laatste keer 12 november]** Releasenaam: `0.32.6 (1)`. Releaseopmerkingen: vervang alles in het vak door het eerste blok uit
   "Releaseopmerkingen om te plakken" in `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`).
   Je ziet geen rode melding onder het vak. (Bij een nieuwe versie: laat de releasenaam staan die Play Console zelf
   invult, zoals bij jouw uploads, bijvoorbeeld `5 (0.32.11)`. Voor de releaseopmerkingen geeft Claude bij elke nieuwe
   versie een nieuwe tekst "Wat is er nieuw".)
8. **[GEDAAN, laatste keer 12 november]** **Volgende** > **Opslaan en publiceren** (of **Uitrol naar interne test starten**).
   Je ziet na enkele minuten: "Beschikbaar voor interne testers".
9. **[GEDAAN]** Tab **Testers** > **Link kopiëren** (de opt-inlink). Stuur die naar je interne testers.
10. **[GEDAAN]** Elke tester opent de link op de telefoon, met het Google-account dat in de lijst staat, en tikt
    **Word tester** > **Downloaden op Google Play**.
    Je ziet: de app in de Play Store met "(Interne test)".
11. **[GEDAAN, 13 november, anders dan eerst gepland]** Licentietesters (zo betaal je niet echt bij testaankopen): klik in
    de linkerkolom helemaal bovenaan (alle apps) **Instellingen** > **Licentietests**. Je maakte een nieuwe lijst
    **"licentietesters"** met alleen jou en je vriendin en vinkte die aan; de lijst "intern" (8 testers) vinkte je
    **uit**. Zo betalen de andere testers (en straks de testers van de gesloten test) echt als ze iets kopen, zoals je
    wilde. Wil je later nog iemand gratis laten testkopen, zet die dan in de lijst "licentietesters".
12. **[GEDAAN, 12-13 november]** Maak nu de producten aan en koppel RevenueCat: doe **deel G** (dat kan pas na deze eerste upload).
13. Test met je telefoon:
    - toestemmingsformulier bij de eerste start; **[GEDAAN, 11 november, op de testtelefoon op je pc]**
    - een beloningsvideo: je ziet "Test Ad" en krijgt daarna de beloning; **[GEDAAN, 11 november, op de testtelefoon op je pc]**
    - een aankoop (bijvoorbeeld 3.000 sap): het Google-venster toont "Testkaart, wordt altijd goedgekeurd"; daarna
      krijg je de sap; **[GEDAAN, 12-13 november: twee keer `sap_3000`, telkens +3.000 sap, de tweede keer ook gelukt
      (dus het product wordt goed "verbruikt")]**
    - na Reclamevrij kopen: bij een beloning (bijvoorbeeld +1 hartje) speelt geen video meer, je krijgt ze meteen; **[NOG TE DOEN]**
    - "Aankopen herstellen" na Reclamevrij kopen, de app wissen en opnieuw installeren; **[NOG TE DOEN]**
    - terugknop, Delen, het live vriendenduel met een tweede tester. **[DEELS: live duel met je vriendin op 0.32.10 gespeeld]**
    Meld me alles wat niet werkt, met een schermafbeelding.

---

## F. Gesloten test (minstens 12 testers, 14 dagen)

Begin hier pas als Claude de punten 7 tot 11 van deel 0 heeft opgelost en jij ze in de interne test hebt
geprobeerd (verwijderknop, privacyknop, Plus-tekst, eerlijke duels, namen melden en blokkeren).

Jouw plan (stand 13 november): eerst v0.32.11 in de interne test (jij, je vriendin en een paar anderen), daarna kleine
verbeterversies. Intussen zoek je eerst ongeveer 20 testers (het peilbericht is klaar). Pas als je die hebt, maak je de
Google Group en de gesloten test hieronder, dan 14 dagen testen, dan deel H.

De Google Group (de makkelijkste manier om testers toe te voegen):
1. Open https://groups.google.com met je Google-account > **Groep maken**.
2. Groepsnaam **Don't Slice Me! testers**, groeps-e-mail `dont-slice-me-testers` (dus
   `dont-slice-me-testers@googlegroups.com`; als die bezet is, kies een andere en onthoud ze) > **Volgende**.
3. Privacy: **Wie kan zoeken naar de groep**: "Iedereen op het web"; **Wie kan deelnemen**: "Iedereen kan
   deelnemen"; **Wie kan gesprekken bekijken / posten**: "Groepseigenaren" (zo komt er geen spam) > **Volgende** >
   **Groep maken**.
   Je ziet: de groep met een link `https://groups.google.com/g/dont-slice-me-testers`.

De gesloten test in Play Console:
4. **Testen** > **Gesloten test** > bij "Gesloten test - Alpha" **Track beheren**.
5. Tab **Testers** > **Google Groups** > typ `dont-slice-me-testers@googlegroups.com` > **Opslaan**.
6. Vul **Feedback-URL of e-mailadres** in (`dont.slice.me@gmail.com`) > **Opslaan**.
7. Tab **Landen/regio's**: kies minstens **België** en **Nederland** (en waar je testers wonen) > **Opslaan**.
8. Tab **Releases** > **Nieuwe release maken** > **Toevoegen uit bibliotheek** > kies versie 1 (0.32.6) (of een
   nieuwere) > releaseopmerkingen (hetzelfde blok als in deel E, stap 7) > **Opslaan** > **Wijzigingen ter
   beoordeling sturen**.
   Je ziet: "In beoordeling". De eerste keer duurt de controle door Google een paar uur tot enkele dagen.
9. Zodra de status "Actief" is: tab **Testers** > **Link kopiëren** (opt-inlink).
10. Stuur je testers het WhatsApp-bericht hieronder, met de twee links.
11. Volg het aantal: **Gesloten test** > tab **Testers** toont hoeveel testers ingeschreven zijn. Je hebt er
    **minstens 12** nodig die **14 dagen na elkaar** ingeschreven blijven. Nodig er **15 tot 20** uit: valt er één
    af, dan begint de telling voor jou niet opnieuw.
12. Vraag de testers om echt te spelen (een paar keer per week) en feedback te sturen; Google vraagt bij de
    productieaanvraag hoe je getest hebt.

Het WhatsApp-bericht (kopieer, vul de twee links in):

> Hoi! Ik heb een spelletje gemaakt: **Don't Slice Me!** Jij bent het fruit en je ontwijkt het mes. Voor ik het in
> de Play Store mag zetten, eist Google dat minstens 12 mensen het 14 dagen testen. Help je mee? Het is gratis en
> kost je 2 minuten. Je hebt een Android-telefoon nodig.
>
> 1. Word lid van de testgroep (met het Google-account van je telefoon): [link van de Google Group]
> 2. Open daarna deze link en tik op "Word tester": [opt-inlink van Play Console]
> 3. Installeer de app vanuit de Play Store.
> 4. **Blijf 14 dagen ingeschreven** en laat de app staan. Speel af en toe een rondje, daag me gerust uit voor een
>    live duel.
>
> Reclame is tijdens de test alleen voorbeeldreclame. Aankopen zijn echt, dus koop niets tenzij je dat wilt.
> Fout gezien? Stuur me een schermafbeelding. Dankjewel!

(Geef je testers die als licentietester in deel E stap 11 staan de zin "aankopen zijn echt" niet: zij betalen niet.)

---

## G. RevenueCat: producten en service-account

**[GEDAAN, 12-13 november]** Alles van dit deel is gedaan, behalve de test met Reclamevrij (stap 11). Hieronder staat per
stap wat je echt deed; de uitleg blijft staan als naslag.

Doe dit direct na de eerste upload (deel E, stap 12).

Het betalingsprofiel (zonder dit kun je geen producten maken):
0. **[GEDAAN, 12 november]** Je hebt al een Google-betalingsprofiel (van je registratie; je officiële naam en adres in Play Console komen
   eruit). Maak dus geen nieuw. Klik in Play Console in de linkerkolom helemaal bovenaan (alle apps) **Instellingen**
   > **Betalingsprofiel** > kies **Koppelen** of **Bestaand betalingsprofiel gebruiken**, en vul de ontbrekende
   gegevens aan (bankrekening, IBAN) > **Opslaan**. Vraag vooraf je boekhouder of je dit als particulier of met een
   ondernemingsnummer doet (dat besliste je op 4 november zo).
   Je ziet: "Je betalingsprofiel is gekoppeld" (of je profiel met naam en adres). Heet de knop anders, kies wat
   hetzelfde betekent (Google: "Create a payments profile", Play Console Help).
   (Gedaan: het betalingsprofiel is gekoppeld.)

De producten in Play Console:
1. **[GEDAAN, 12 november]** **Inkomsten genereren** > **Producten** > **In-app-producten** (of **Eenmalige producten**) > **Product maken**.
2. **[GEDAAN, 12 november]** Maak elk product uit `store/producten-play.md`, deel A, met exact die **product-ID**, naam, beschrijving en
   prijs > **Opslaan** > **Activeren**. (Niet de producten uit deel B of D.)
   Je ziet: elk product met status "Actief".
   Wat je deed: alle 11 eenmalige producten staan op **Actief** (`sap_3000`, `sap_10000`, `hearts_5`, `doubler_1h`,
   `coins_5`, `tickets_5`, `tickets_15`, `weekpass`, `pass`, `noads`, `bundle_all`; vanaf v0.32.12 zijn `tickets_5`,
   `tickets_15` en `weekpass` uit het spel en zet je ze op inactief, zie `PLAY-CONSOLE-v0.32.12.md`), elk met één aankoopoptie met
   ID **`buy`** (soort "Bestellen", dus gewoon kopen), leeftijdsclassificatie de laagste, belastingcategorie "Digitale
   app-verkoop". Prijzen: "Prijzen instellen" las het eurobedrag als bedrag **zonder** btw. Daarom zette je bij
   **België** en **Nederland** met het potloodje de prijs met btw er zelf in (bijvoorbeeld € 0,99), zodat de prijs in
   de winkel gelijk is aan de prijs in het spel. Voor de andere landen rekende Google zelf om (NIET NAGEKEKEN welke
   prijzen daar staan; zie `store/producten-play.md`, deel E).
3. **[GEDAAN, 12 november]** **Producten** > **Abonnementen** > **Abonnement maken**: ID `plus_month`, naam "Don't Slice Me! Plus" >
   **Basisabonnement toevoegen**: ID `monthly`, **Automatisch verlengen**, elke **1 maand**, prijs € 2,99,
   **geen** proefperiode of aanbieding > **Activeren**.
   Wat je deed: voordelen (benefits) in het Engels en Nederlands ingevuld; het basisabonnement staat op **"Werkt met
   eerdere versies"** (achterwaarts compatibel: ook oudere versies van Google Play Billing vinden dit basisabonnement);
   **pauzeren** staat aan
   (de standaard van Google).
4. **[GEDAAN, 12 november]** Herhaal voor `plus_year`: basisabonnement `yearly`, elk **1 jaar**, € 19,99 > **Activeren**.
   Ook hier voordelen EN en NL, "Werkt met eerdere versies" en pauzeren aan.

Het service-account (zodat RevenueCat aankopen kan controleren):
5. **[GEDAAN, 12 november]** Open in RevenueCat je project > **Apps** > de Google Play-app > **Service Account credentials JSON**. Volg de
   uitleg van RevenueCat ("How to create"): in Google Cloud een service-account maken, een JSON-sleutel downloaden.
   Wat je deed, in Google Cloud: in de organisatie `dont-slice-me-org` het project hernoemd naar **"Don't Slice Me!"**
   (het project-ID staat in je Google Cloud-console); drie API's aangezet (Google Play Android Developer API, Google Play
   Developer Reporting API, Cloud Pub/Sub API); het serviceaccount
   `revenuecat@...` (het volledige adres staat in je Google Cloud-console) gemaakt met de rollen **Pub/Sub Admin** en
   **Monitoring Viewer**; een JSON-sleutel gemaakt. De organisatieregel `iam.disableServiceAccountKeyCreation` verbood
   dat eerst: je gaf jezelf de rol Organization Policy Administrator, zette de regel tijdelijk uit voor alleen dit
   project, maakte de sleutel en zette de regel daarna terug op "overnemen" (inherit). Zo is de regel weer zoals hij was.
6. **[GEDAAN, 12 november]** In Play Console (alle apps) > **Gebruikers en rechten** > **Nieuwe gebruikers uitnodigen** > plak het
   e-mailadres van het service-account > tab **Accountrechten** (niet per app) > vink aan: **App-informatie bekijken
   en bulkrapporten downloaden (alleen lezen)**, **Financiële gegevens, bestellingen en antwoorden op
   opzeggingsenquêtes bekijken**, **Bestellingen en abonnementen beheren** > **Gebruiker uitnodigen**.
   Volg bij twijfel de lijst op de RevenueCat-pagina ("Creating Play Service Credentials"); die is leidend.
   (Gedaan met precies die drie rechten.)
7. **[GEDAAN, 12-13 november]** Upload het JSON-bestand in RevenueCat > **Save**. Bewaar het JSON-bestand buiten GitHub.
   Je ziet in RevenueCat na enige tijd (tot 36 uur) "Valid credentials".
   (RevenueCat toont nu **Valid credentials**.)
8. **[GEDAAN, 12 november]** RevenueCat > **Products** > **Import products** (uit Google Play).
   Je ziet: alle product-ID's uit stap 2-4.
   (Geïmporteerd: 9 eenmalige producten, plus `plus_month:monthly` en `plus_year:yearly`. `noads` en `pass` stonden er
   al sinds 23 oktober.)
9. **[GEDAAN, 12 november]** Zet `noads` en `bundle_all` op **Non-consumable** (de andere eenmalige producten zijn consumable).
10. **[GEDAAN, 12 november]** **Entitlements**:
    - `noads` hangt al sinds 23 oktober aan entitlement `noads`. Niets doen. Zie je na het importeren een tweede
      `noads`, laat dan alleen het geïmporteerde gekoppeld. (Gedaan: `noads`, non-consumable, aan `noads`.)
    - koppel `plus_month` en `plus_year` aan `plus` > **Save**. (Gedaan: `plus_month:monthly` en `plus_year:yearly`.)
    - het product `pass` hangt sinds 23 oktober aan entitlement `pass`. Koppel het **los** (Detach) tot je beslist hoe
      de Fruitpas per seizoen werkt (zie `store/producten-play.md`, deel B, en deel 0, punt 13). (Gedaan: losgekoppeld;
      het product `pass` en de lege entitlement `pass` blijven bestaan. Beslist op 15 november: zo laten.)
    - verwijder de entitlement `don_t_slice_me_pro` (met de twee Test Store-producten) die de wizard op 23 oktober
      maakte, als hij er nog staat. (Hij is weg.)
    Je ziet: bij `plus` twee producten, bij `noads` één, bij `pass` geen.
10b. **[GEDAAN, 12 november]** Realtime meldingen van Google (zodat RevenueCat meteen hoort van verlengingen, opzeggingen
    en terugbetalingen): in RevenueCat **Google developer notifications** gekoppeld aan het Pub/Sub-onderwerp
    `projects/<jouw-project-ID>/topics/Play-Store-Notifications`. In Play Console (de app, bij de
    instellingen voor inkomsten; in het Engels "Monetization setup") de realtime ontwikkelaarsmeldingen (RTDN) aangezet
    met dat onderwerp, en als inhoud gekozen: **abonnementen, ingetrokken aankopen en alle eenmalige producten**.
    De testmelding kwam aan in RevenueCat.
11. Test: koop in de app (als licentietester) Reclamevrij.
    Je ziet in RevenueCat > **Customers** een anonieme klant met entitlement `noads` actief.
    - **[GEDAAN, 12-13 november]** Testaankoop `sap_3000`, twee keer (testkaart, telkens +3.000 sap, de tweede aankoop ook
      gelukt): zichtbaar in RevenueCat > **Customers** > **Sandbox**.
    - **[NOG TE DOEN]** Reclamevrij kopen (je bent licentietester, je betaalt niet) en kijken of `noads` actief is; daarna
      "Aankopen herstellen" (deel E, stap 13).

---

## H. Productie aanvragen

Voorwaarden:
- 14 dagen gesloten test met minstens 12 ingeschreven testers (deel F);
- Claude heeft alle punten van de lijst in deel 0 opgelost en jij hebt ze getest;
- jouw beslissingen uit deel 0, punt 13 (toernooitickets, Weekpas en Plus-ticket; de Fruitpas per seizoen): **[GEDAAN]**
  beslist op 15 november en gebouwd in v0.32.12; test ze in de interne test (`TESTLIJST-v0.32.12.md`);
- regels voor spelersnamen, melden en blokkeren staan in het spel, met `voorwaarden.html` (deel 0, punt 11);
- eerlijke duels (deel 0, punt 10);
- handelaarsstatus: **gedaan** (Handelaar, 10 november). Controleer alleen of je gegevens nog kloppen.

1. Dashboard van de app > **Toegang tot productie aanvragen** (de knop verschijnt na de 14 dagen).
2. Beantwoord de vragen over je test (hoeveel testers, wat ze vonden, wat je verbeterde). Claude helpt met de tekst.
   Je ziet: "Aanvraag ingediend". Google antwoordt meestal binnen een week.
3. Zet in `native/bridge.js` **`testing: false`** (alleen voor de productieversie), en laat Claude de tekst over
   testadvertenties uit `privacy.html` en "Wat is er nieuw" halen.
4. `npm run sync`, `versionCode` +1, bouw opnieuw (deel C, stap 24 en 27).
5. **Productie** > **Nieuwe release maken** > upload > releaseopmerkingen (het tweede blok, "Voor de
   productieversie", uit "Releaseopmerkingen om te plakken" in `store/winkelteksten.md`) > **Landen**: kies je landen > **Gefaseerde uitrol** 20 procent >
   **Ter beoordeling sturen**.
6. Na de goedkeuring: stuur Claude de Play Store-link (voor `STORE_URL` in het spel) en koppel AdMob aan de winkel
   (deel B, stap 7).
7. Laat Claude in het spel `APP_PUBLIC = true` zetten (dan zegt de webkaart niet meer hoe je tester wordt).
8. **Filmpjes vervangen en delen** (pas nu, want vóór de productie toont de Google Play-link "niet gevonden" aan wie
   geen tester is):
   - de oude filmpjes met de browserlink vervangen door de nieuwe Google Play-versies (in `promo/` van deze map, in een
     eventueel filmpje in de winkelvermelding, en wat al gedeeld werd);
   - scan de QR-code op het eindbeeld één keer met je gsm (op een ander scherm) en kijk of je de app in Google Play ziet;
   - dan delen: de WhatsApp-versie in chats, de versie van 15 seconden voor status, Instagram en TikTok, en zet de
     Google Play-link ook als tekst in je bericht.

---

## Wat je mij kunt vragen

- De spelpunten uit deel 0 bouwen en testen (verwijderknop, privacyknop, aankoopknoppen, Plus-tekst en Opzeggen,
  eerlijke duels, namenfilter met melden en blokkeren, Engelse getallen, prijzen).
- Een foutmelding van `npm`, Android Studio of Play Console uitleggen (stuur een schermafbeelding).
- `voorwaarden.html` (algemene voorwaarden, NL en EN) en de repository voor app-ads.txt klaarzetten.
- De nieuwe promofilm in `promo/` zetten en YouTube-teksten schrijven.
- Antwoorden op de vragen van de productieaanvraag en op reviews, in NL en EN.
- Een testlijst voor je gesloten testers.
