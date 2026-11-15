# Play Console bij v0.32.12 (15 november 2026)

Wat v0.32.12 doet (jouw keuzes "1A, 2A, 3A, 4A"): toernooitickets zijn nergens meer te koop, iedereen krijgt elke dag 10
gratis tickets, Plus geeft geen extra ticket meer; de Fruitpas toont tot wanneer het seizoen loopt en is niet te koop in de
laatste 3 dagen van de maand; "Aankopen herstellen" noemt alleen nog Plus en Reclamevrij; van de fruitmanden blijft alleen
Alles-in-één.

Log in met `dont.slice.me@gmail.com` (in Play Console is dat `/u/2/` in het adres).

## In deze volgorde

0. **Eerst, vóór je bouwt: de bestellingen nakijken (5 minuten).** Open in Play Console **Bestellingen beheren** (Order
   management). Zoek de bestellingen van `tickets_5`, `tickets_15` en `weekpass` vanaf **12 november 17:00** (Belgische
   tijd). Weet je van zo'n bestelling dat de koper toen nog de app 0.32.7 of 0.32.8 had (nog niet bijgewerkt naar 0.32.10)?
   Stuur dan de datum en het uur naar Claude vóór je v0.32.12 bouwt: die aankoop kreeg hij al, maar 0.32.8 hield er geen
   notitie van, dus v0.32.12 zou ze nog eens als sap geven. Claude schuift dan het beginuur op. Geen enkele zo'n
   bestelling, of alleen van testers die al 0.32.10 of later hadden: niets te doen. (Play Console toont niet welke
   app-versie de koper had; dat weet je van je testers. NIET NAGEKEKEN hoe het menu bij jou precies heet.)
   Kijk in dezelfde lijst ook naar bestellingen van vóór 12 november 17:00 die toen nog niet betaald waren ("in behandeling")
   en pas later werden afgerond. Die krijgt de koper in v0.32.12 niet (0.32.8 gaf zo'n aankoop ook nooit). Is er zo een,
   stuur dan de datum en het uur; je kunt de koper terugbetalen in Play Console. (NIET NAGEKEKEN hoe Play Console zo'n
   bestelling toont.)

1. **De app bouwen.** Open een opdrachtvenster in de map `dont-slice-me` en typ, één regel per keer:

   ```
   git pull
   cd native
   npm run sync
   ```

   (`npm run sync` is nodig: `native/bridge.js` is veranderd.) Zet in Android Studio, in `app` > `build.gradle`
   (Module :app), **`versionCode 6`** en **`versionName "0.32.12"`**. Bouw de ondertekende bundel zoals altijd
   (`UITROL-STAPPEN.md`, deel C, stap 24 en 27).
   Er is geen server-update: geen `firebase deploy`.

2. **In de interne test zetten.** **Testen en releasen** > **Testen** > **Interne test** > **Nieuwe release maken** >
   sleep `app-release.aab` naar **App-bundels**. Je ziet: "6 (0.32.12)". Releaseopmerkingen: vervang alles in het vak door
   het blok "Voor v0.32.12 in de interne test" uit `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`) >
   **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.

3. **Zelf bijwerken en testen.** Doe op je telefoon `TESTLIJST-v0.32.12.md`, stap 0 tot en met 9 (stap 0 doe je nog op
   v0.32.11, vóór het bijwerken).

4. **Pas nu: de drie ticketproducten op inactief.** Niet eerder: wie nog een oudere versie heeft, ziet de knoppen
   "5 tickets", "15 tickets" en "Weekpas" nog. Zijn de producten inactief, dan doet zo'n knop niets meer. Wie bijwerkt naar
   0.32.12, ziet de knoppen niet meer, en zijn bewaarde tickets en zijn Weekpas worden sap.
   Doe dit voor `tickets_5`, daarna `tickets_15`, daarna `weekpass`:
   - **Inkomsten genereren** > **Producten** > **Eenmalige producten** > klik op het product.
   - Klik **Deactiveren** (bij het product, of bij de aankoopoptie `buy` als de knop daar staat) > bevestig.
     NIET NAGEKEKEN hoe de knop bij jou precies heet; kies wat hetzelfde betekent ("Inactief maken", "Deactivate").
   - Je ziet: status **Inactief**.
   **Niet verwijderen.** Komt er later toch nog een aankoop binnen (een betaling die nog liep, een aankoop uit een oude
   versie die pas later verwerkt wordt), dan zet het spel ze om in sap: 5.000 sap voor `tickets_5`, 15.000 sap voor
   `tickets_15`, 9.000 sap en het fragment van zondag voor `weekpass`, met het kaartje "Aankoop omgezet in sap". Elke aankoop één keer; een
   aankoop die je met v0.32.10 of v0.32.11 al kreeg, herkent het spel aan het uur van de aankoop en betaalt het niet nog eens
   (de klok van de telefoon moet dan wel op automatisch staan: zie de testlijst, stap 4).
   Een aankoop van vóór 12 november 17:00 (toen had iedereen nog 0.32.7 of 0.32.8) betaalt het nooit nog eens; voor een
   aankoop met 0.32.8 na dat uur: zie stap 0.

5. **Plus: de voordelen in Play Console nakijken.** Jouw lijst: "Geen reclame, beloning meteen", "Onbeperkte hartjes",
   "+25% sap", "Elke maandag een Plus-kist" (Engels: "No ads, rewards at once", "Unlimited hearts", "+25% juice", "A Plus
   chest every Monday"). Ik vergeleek ze met wat Plus in het spel van v0.32.12 echt geeft: geen reclame en de beloning
   meteen, onbeperkte hartjes, +25% sap op elke poging, dubbele beloning voor dagreeks en opdrachten, elke maandag een
   Plus-kist (1.500 sap + 1 hartje), elke maand een fruit, Fruitpas premium, elke dag 2 munten en 1 Startboost, de Dagdeal
   voor een derde. Alle vier jouw voordelen kloppen nog en geen enkel noemt een ticket. **Je hoeft niets te veranderen.**

6. **De beschrijvingen van de producten.** `tickets_5`, `tickets_15` en `weekpass` worden inactief; hun tekst maakt dan niet
   meer uit. De tekst van `pass` ("Het betaalde spoor van dit seizoen: hartjes, schilden, sap en gereedschap.") belooft niets
   over herstellen en klopt nog. Wil je zeggen dat een seizoen een kalendermaand is (niet verplicht):
   - EN: `The paid track of this season (this calendar month): hearts, shields, juice and tools.`
   - NL: `Het betaalde spoor van dit seizoen (deze kalendermaand): hartjes, schilden, sap en gereedschap.`
   De vier fruitmanden (`bundle_rood` ...), `shield` en een stempel bestonden nooit in Play Console: niets te doen.
   `bundle_all` blijft zoals het is.

7. **RevenueCat: niets.** Laat de producten `tickets_5`, `tickets_15` en `weekpass` daar gewoon staan (RevenueCat moet een
   aankoop die nog binnenkomt kunnen verwerken). De lege entitlement `pass` mag blijven; het spel leest bij "Aankopen
   herstellen" alleen nog `noads` en `plus`.

8. **Winkelvermelding: niets verplicht.** De beschrijving noemt geen betaalde tickets. Wil je het eerlijke toernooi
   vermelden, dan staat er een vrije regel in `store/winkelteksten.md` (onder EERLIJK SPELEN / FAIR PLAY).

9. **Gegevensveiligheid: niets.** De app leest bij RevenueCat de lijst van je eigen aankopen om een late aankoop om te zetten
   in sap. Dat is dezelfde aankoopgeschiedenis die al in het privacybeleid en in je antwoorden staat; er gaat niets nieuws
   naar iemand.
