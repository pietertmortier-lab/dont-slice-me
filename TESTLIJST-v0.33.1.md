# Testlijst v0.33.1 - de Eetzaal, De brigade en de verbeteringen van deze week

Wat er nieuw is (alles in één versie, zodat je maar één keer hoeft te testen):
- Keuken, stap 1 "De deur": vanaf level 100 een deur in je keuken, met level 120, een volle keuken en 60.000 sap open je de Eetzaal
  (Menukaart, gasten, pluimen, Commis en Chef de partie, De Bar en de koperen keuken).
- Keuken, stap 2 "De brigade": de rangen Souschef, Chef, Chef-kok en Sterrenchef, zilver en goud, de huisspecialiteit, groeiende
  bestellingen, de Chefspecial, de snijplank, een extra hartjesplek, sterren zonder einde en de Jacht met vorken alleen in de bonusrun.
- Geen dubbele reclame meer bij 0 hartjes.
- Live duel: je fruit begint met zijn eigen schil, en je vriend haalt na een wifi-hapering meteen weer in.
- De prijsteksten zeggen "tot level 151".
- Het scherm blijft aan tijdens het spelen.
- Nieuwe duelnamen: Schimduel, Uitdaging (24 u) en Live duel, met duidelijkere uitleg.
- Nieuw: de knop "Daag een vriend uit · naar Vrienden" onder "Live duel".

**v0.33.1 bevat alles van v0.32.16, v0.32.15, v0.32.14, v0.32.13 en v0.32.12.** Je uploadt alleen deze nieuwste versie. Versie 0.33.0
kwam nooit uit: die zit helemaal in 0.33.1. Er is geen server-update: **geen** `firebase deploy`.

Hoe je test: elke test duurt een paar minuten. Doe de stappen één voor één. Bij elke stap staat wat je moet zien. Onderaan elke test
staat "ok / niet ok". Stuur me daarna **"test N ok"**, of beschrijf wat je ziet (liefst met een schermafbeelding en het nummer van de
stap). Ik label niets als af voor jij het gespeeld hebt.

**Wat je nu al kunt testen, op jouw level (ongeveer 122):** test 0 tot en met 10. Er is **geen** testknop om naar een ander level te
springen of om sap of pluimen te krijgen, en ik voeg er ook geen toe. "Start op level" op het beginscherm laat één poging lager beginnen,
maar de deur en de rangen kijken altijd naar je **hoogste** level. Test 11 (Chef de partie op level 140 en de rangen van De brigade vanaf
level 165) doe je pas als je dat level haalt; dat heb ik automatisch getest (896 controles, allemaal geslaagd).

## Test 0. Beide telefoons naar versie 0.33.1 (eerst doen, vóór elke duel-test)

Wat staat er nu op je telefoons?

1. Open de app op de **S26+** en tik op het **tandwiel**. Onderaan staat de versie. Je ziet "Versie v0.32.16" (of v0.32.15).
2. Doe hetzelfde op de **OnePlus 5**. Ook daar: "Versie v0.32.16" (of v0.32.15).
   Staat er een oudere versie (v0.32.13 of ouder)? Kijk dan eerst naar stap 0 van `TESTLIJST-v0.32.16.md`: wat daar nog openstaat,
   geldt nog altijd.

Bouwen en uploaden (op je pc):

3. Open een opdrachtvenster in de map `dont-slice-me`. Typ `git pull` en druk op Enter.
4. Typ `cd native` en druk op Enter.
5. Typ `npm run sync` en druk op Enter. Wacht tot het klaar is. (Dit is nodig: `index.html` is veranderd.)
6. Open Android Studio. Open `app` > `build.gradle` (Module :app).
7. Zet daar **`versionCode 11`** en **`versionName "0.33.1"`**. (Ook als je oudere versies oversloeg: 11.)
8. Klik bovenaan op **Sync Now** als die balk verschijnt.
9. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
10. Typ je wachtwoord (dezelfde sleutel als altijd) > **Next**.
11. Kies **release** > **Create**. Je ziet rechtsonder "Generate Signed Bundle: ... successfully".
12. Play Console (log in met `dont.slice.me@gmail.com`): **Testen en releasen** > **Testen** > **Interne test** > **Nieuwe release maken**.
13. Sleep `native\android\app\release\app-release.aab` naar **App-bundels**. Je ziet: "11 (0.33.1)".
14. Releaseopmerkingen: vervang alles in het vak door het blok "Voor v0.33.1 in de interne test" uit `store/winkelteksten.md` (van
    `<nl-NL>` tot en met `</en-US>`).
15. **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.

Beide telefoons bijwerken:

16. Op de **S26+**: open de **Play Store**, zoek **Don't Slice Me!** en tik **Bijwerken**. (Zie je nog geen update, wacht dan een paar
    minuten en kijk opnieuw.)
17. Open de app op de S26+ en tik op het tandwiel. Onderaan staat **"Versie v0.33.1"**.
18. Op de **OnePlus 5**: open de **Play Store**, zoek **Don't Slice Me!** en tik **Bijwerken**.
19. Open de app op de OnePlus 5 en tik op het tandwiel. Onderaan staat **"Versie v0.33.1"**.
    (Andere manier: telefoon met een kabel aan de pc en vanuit Android Studio installeren. Ook dan moet er "Versie v0.33.1" staan.)

Play Console (alleen wat nog niet gedaan is, en pas nu: na de upload en nadat je zelf bijwerkte):

20. Deed je deel 3 van `TESTLIJST-v0.32.15.md` nog niet (de namen van de twee sappotten en de verdubbelaar op € 1,99, uit
    `PLAY-CONSOLE-v0.32.15.md`)? Doe het nu. Waar daar "0.32.15" staat, lees je "0.33.1". Deed je het al, dan hoeft hier niets.

**Test 0: ok / niet ok**

## Test 1. Geen dubbele reclame bij 0 hartjes (ongeveer 5 minuten)

Dit is jouw melding van 16 november: bij 0 hartjes gaf **Opnieuw** eerst een gewone reclame en daarna het hartjesscherm met het filmpje.
Twee reclames voor één poging.

Zorg dat **Reclamevrij**, **Plus** en de **10 minuten onbeperkte hartjes** uit staan (zoals normaal).

1. Speel pogingen tot je **0 hartjes** hebt.
2. Op het game-over-scherm van je laatste hartje: tik **Opnieuw**.
3. Je ziet **meteen** het hartjesscherm: "Geen hartjes meer", met de knop **Filmpje: +1 hartje (nog N van 2 vandaag)**. Er komt
   **geen** reclame vóór dit scherm.
4. Tik **Filmpje: +1 hartje**. Je ziet één testfilmpje van Google. Daarna start je poging.
5. Verlies opnieuw je laatste hartje. Tik op het game-over-scherm eerst op **Filmpje: nog eens +… sap** (het filmpje om je sap te
   verdubbelen) en kijk het filmpje.
6. Tik daarna **Opnieuw**. Je komt op het hartjesscherm, **zonder** een tweede reclame.
7. Ter info (zo gebouwd, geen fout): tik je bij 0 hartjes op **Ander fruit**, dan kan daar nog wel de gewone reclame komen. Die knop
   start geen poging. Wil je daar ook geen reclame, zeg het.

**Test 1: ok / niet ok**

## Test 2. Het scherm blijft aan (ongeveer 5 minuten, S26+ en OnePlus 5)

Zet voor deze test de schermtijd van je telefoon kort: **Instellingen** > **Scherm** (of Display) > **Time-out scherm** (of
Slaapstand) > **15 seconden**. Zet hem na de test terug zoals hij stond.

1. Op de **S26+**: start een gewone poging. Leg je vinger op het fruit en hou hem stil, zonder te vegen, langer dan 15 seconden.
2. Het scherm blijft aan en wordt niet donker.
3. Ga naar het beginscherm van de game (de menu's). Raak niets aan.
4. Na ongeveer 15 seconden wordt het scherm donker of gaat het op slot, zoals altijd. Dat hoort zo: in de menu's spaart de game je
   batterij.
5. Nodig vanaf de S26+ de OnePlus 5 uit voor een **live duel** (zie test 5, stap 1 en 2). Laat het wachtvenster van de uitnodiging
   open staan en raak niets aan.
6. Het scherm van de S26+ blijft aan zolang dat wachtvenster open staat.
7. Neem op de OnePlus 5 de uitnodiging aan. Jullie staan samen in de **lobby**. Raak op beide telefoons niets aan.
8. Beide schermen blijven aan in de lobby, ook als je langer dan 15 seconden wacht. Verlaat daarna de lobby.
9. Speel op de S26+ een gewone poging tot het game-over-scherm (pak eerst wat sap). Tik **Filmpje: nog eens +… sap** en kijk het
   filmpje zonder het scherm aan te raken. (Heb je 0 hartjes, dan mag het ook met **Filmpje: +1 hartje** op het hartjesscherm; met
   hartjes over staat dat filmpje er niet.)
10. Let op: blijft het scherm aan tijdens het filmpje van Google? Dat kunnen wij alleen op je telefoon zien, want de reclame ligt
    bovenop de game. Schrijf op wat je ziet.
11. Zet de schermtijd van beide telefoons terug zoals hij stond.

**Test 2: ok / niet ok**

## Test 3. De nieuwe duelnamen en "Hoe werkt het?" (ongeveer 3 minuten)

1. Tik onderaan op **Vrienden** en dan bovenaan op **Duels**.
2. Je ziet een vak **"Live duel"** en een vak **"Duels"**. In het vak Duels staan **Schimduel** en **Uitdaging (24 u)**. Het woord
   "openbaar duel" staat er nergens meer.
3. Tik in het vak Duels op **Hoe werkt het?**. Je leest: "Schimduel: 90 seconden vanaf level 10; score = sap." en daaronder dat je
   speelt tegen de schim (een opname) van een echte speler van ongeveer jouw niveau die dezelfde messen kreeg. Verder een stukje over
   **Uitdaging (24 u)** en over **Live duel**.
4. Speel een **Schimduel**. Bovenaan het speelscherm staat **"Schimduel · nog 90 s"** (daarachter je sap en de naam van je
   tegenstander). Op het eindscherm staat de titel
   **"Schimduel"** en de deelknop heet **"Deel je score · +1 hartje"**.
5. Tik onderaan op **Vrienden** > **Vrienden** en tik op een vriend. Op zijn kaartje staan de knoppen **Live duel** en
   **Uitdaging (24 u)**. Tik nog eens op je vriend: het kaartje gaat dicht.
6. Tik op het **tandwiel**. Scrol naar "Hulp: tik op een onderwerp." en tik op **Duels, rivalen en het seizoen**. Daar staan ook
   **Schimduel**, **Uitdaging (24 u)** en **Live duel**. Druk op de terugknop van je telefoon: het venster "Instellingen en hulp" sluit.
7. Alleen als je wilt: Tandwiel > **Taal: Nederlands** > **English**. Daar heet het **Ghost duel**, **Challenge (24 h)** en **Live duel**.
   Zet de taal daarna terug.

**Test 3: ok / niet ok**

## Test 4. De knop "Daag een vriend uit · naar Vrienden" (ongeveer 2 minuten)

Je telefoon moet online zijn (de knop staat er alleen als live duels kunnen).

1. Tik onderaan op **Vrienden** en dan bovenaan op **Duels**.
2. In het vak **"Live duel"** staat onder de uitleg de knop **"Daag een vriend uit · naar Vrienden"**. Op een kleine telefoon loopt
   hij over twee regels; dat mag.
3. Tik op de knop. Je komt bij **Vrienden** > **Vrienden**: je vriendenlijst staat in beeld.
4. Tik op een vriend. Op zijn kaartje staat de knop **Live duel**. (Tik er nog niet op.)
5. Tik nog eens op je vriend: het kaartje gaat dicht.
6. Druk op de **terugknop** van je telefoon. Je bent weer bij **Duels**, met de knop.
7. Druk nog eens op de terugknop. Je bent weer op het beginscherm.

**Test 4: ok / niet ok**

## Test 5. Live duel met schil: Ananas en Kokosnoot (ongeveer 5 minuten, twee telefoons)

Wat er nieuw is: in een live duel begint je fruit nu met zijn eigen schil. **Ananas** heeft twee schillen: de eerste twee sneden
"breken" alleen de schil en je speelt verder; pas de derde snee snijdt je. **Kokosnoot** heeft één schil: de eerste snee breekt de
schil, de tweede snijdt je. Vroeger had je in een live duel geen schil, terwijl de uitleg in de lobby dat wel beloofde.

1. Op de **S26+**: Vrienden > Duels > **Daag een vriend uit · naar Vrienden**.
2. Tik op je vriend (de OnePlus 5) en tik **Live duel**.
3. Op de **OnePlus 5**: neem de uitnodiging aan. Jullie staan samen in de lobby.
4. Op de S26+: tik in de lobby op **Ananas**. Er opent een kaartje. Onder **"In dit live duel"** staat iets over de schillen ("de twee
   schillen heb je wel").
5. Tik **Kies dit fruit**.
6. Op de OnePlus 5: kies **Kokosnoot** op dezelfde manier.
7. Tik op beide telefoons **Klaar**. In de lobby staat "Het duel begint zo." en het aftellen begint.
8. Bij de start, op de S26+: bovenaan, onder de levelbalk, staat **"Nog 2 sneden vrij"**.
9. Op de OnePlus 5 staat **"Nog 1 snee vrij"**.
10. Kijk op de S26+ naar het fruit van je vriend (de Kokosnoot): het heeft zijn schil nog, heel.
11. Laat je op de S26+ één keer raken. Er staat **"Gekraakt! Nog één"** en daarna **"Nog 1 snee vrij"**. Je speelt gewoon verder.
12. Laat je op de OnePlus 5 één keer raken. Er staat **"Gekraakt!"** en **"Kokosmelk: je pakt van verder weg"**. Je speelt verder.
13. Kijk op de S26+: de Kokosnoot van je vriend is nu gebarsten.
14. Speel het duel uit. De uitslag staat op beide telefoons hetzelfde.

**Test 5: ok / niet ok**

## Test 6. Live duel: haperen (ongeveer 5 minuten, beide telefoons)

Wat er verbeterd is: na een korte hapering in de wifi haalt je vriend nu **meteen** weer in en beweegt hij weer vloeiend. Vroeger liep
hij daarna nog tot 10 seconden ongeveer 0,4 seconde achter. Eerlijk gezegd: **een korte stilstand terwijl de wifi zelf hapert, blijft**.
Die kan het spel niet wegnemen.

1. Leg beide telefoons naast elkaar, allebei op dezelfde wifi.
2. Start een live duel tussen de S26+ en de OnePlus 5 (zoals test 5, stap 1 tot 7; elk fruit mag).
3. Zodra het duel loopt: tik op **beide** telefoons **5 keer snel** op de duelklok, bovenaan in het midden.
4. Er verschijnt een vak met een paar regels. De onderste regel ziet er zo uit: `vriend: live · achter 0,1 s · 15/s · opnieuw 0 · knip 0`.
   Wat de woorden betekenen:
   - **live / zwak / vertraagd / weg**: hoe goed de beelden van je vriend nu binnenkomen (live is goed).
   - **achter 0,1 s**: hoeveel seconden je vriend op jouw scherm achterloopt op waar hij echt is.
   - **15/s**: hoeveel beelden van je vriend er per seconde binnenkomen (rond 15 is goed; vroeger zakte dat bij trage wifi naar 5).
   - **opnieuw 0**: hoe vaak je telefoon in dit duel opnieuw verbinding maakte met de server.
   - **knip 0**: hoe vaak je telefoon een stapel oude beelden weggooide om je vriend meteen weer bij te halen.
5. Speel het hele duel. Kijk naar het fruit van je vriend op **beide** telefoons.
6. Staat je vriend even stil? Let op wat er daarna gebeurt: hij springt meteen naar zijn echte plek en beweegt weer vloeiend. Hij loopt
   niet nog lang achter.
7. Zie je toch haperen, of staat **opnieuw** of **knip** hoger dan 0? Maak dan een schermafbeelding van het vak, op allebei de telefoons.
8. Tik daarna weer 5 keer snel op de duelklok: het vak verdwijnt.
9. Speel nog één duel, dit keer met de telefoons verder van de router (bijvoorbeeld in een andere kamer). Hoe voelt het?

**Test 6: ok / niet ok**

## Test 7. Prijsteksten "tot level 151" (ongeveer 2 minuten)

1. Open de **Winkel** > **Sap**.
2. Bij **Kleine sappot** staat: **"Groeit mee met je ronde, tot level 151. Nooit minder dan 3.000 sap."**
3. Bij **Grote sappot** staat: **"Groeit mee met je ronde, tot level 151. Nooit minder dan 10.000 sap."**
4. Alleen als je het uitlegkaartje nog nooit zag: het heeft de titel **"Nieuw: sapprijzen groeien mee met je ronde, tot level 151"**.
   Op het hartjesscherm staat het als korte kaart, met eronder: "Hartjes, boosts en het Reeksschild: elke 30 levels meer sap, tot
   level 151." (Zag je dat kaartje al eens in v0.32.15 of v0.32.16, dan komt het niet meer terug. Dat hoort zo.)
5. Alleen als je wilt: Tandwiel > **Taal: Nederlands** > **English**, en kijk weer bij Winkel > Sap: "up to level 151". Zet de taal
   daarna terug.
6. Geen enkele prijs is veranderd.

**Test 7: ok / niet ok**

## Test 8. Keuken stap 1: de deur en het toneeltje (ongeveer 5 minuten)

Nodig: level 120 of hoger (dat heb je), een volle keuken (**20/20**) en **60.000 sap**. Het toneeltje speelt maar **één keer**
helemaal: kijk er rustig naar.

1. Tik **Vandaag** > **Keuken**. Staat er **20/20**? Zo niet: koop je toestellen bij met sap tot er 20/20 staat. Bij het laatste
   niveau dat je koopt, hoor je **drie kloppen**.
2. Kijk op het beginscherm onder **Nu te doen**: daar staat **"Er is iets achter je keuken…"**. (Staat het er niet bij? Er passen maar
   drie rijen; haal eerst je beloningen op en kijk opnieuw.)
3. **Vandaag** > **Keuken**. Links in de keukentekening staat een houten deur die **gloeit**. Bovenaan het keukenscherm staat "Er is iets
   achter je keuken…" met de knop **Open de deur · 60.000 sap**. (Te weinig sap? Dan staat er "Je hebt nog N sap tekort". Speel tot
   je het hebt, of koop als test van jouw keuze A een **Grote sappot** in de Winkel: in de interne test is dat een testaankoop.)
4. Tik op de deur. Er schuift een vel open, **"De Eetzaal"**, met de knoppen **Bouw de eetzaal · 60.000 sap** en **Nog niet**.
5. Tik **Bouw de eetzaal · 60.000 sap**. Je sap gaat 60.000 omlaag.
6. De eetzaal wordt gebouwd (ongeveer 3 seconden). Dan hangt er een **lint**: veeg er met je vinger dwars overheen. Je hoort een snee
   en de telefoon trilt even.
7. Je **Menukaart** klapt open met je gerechten en hun sterren. Bovenaan telt "Pluimen" op.
8. **Chef Rosa** zegt **"Welkom in de brigade, Commis!"**. Je eerste gasten komen binnen.
9. Je ziet de kaart **"De Eetzaal is open"**. Tik om te sluiten.

**Test 8: ok / niet ok**

## Test 9. Keuken stap 1: de Eetzaal, gasten en de gerechtbonus (ongeveer 5 minuten)

1. Bovenaan het keukenscherm staan twee knoppen: **Keuken** en **Eetzaal**. Tik **Eetzaal**.
2. Je ziet de eetzaal met tafels en gasten, **"Commis · N/150 pluimen"** met een balkje en de drie dingen voor de volgende rang:
   **Level 140**, **150 pluimen**, **100.000 sap** (wat je al hebt, staat groen).
3. Onder **Dagservice · 0/3 geserveerd** staan drie gasten, elk met een gerecht en een knop **Speel**.
4. Tik bij een gast op **Speel**. Je speelt een gewone poging met het fruit van die gast. Blijf minstens **40 seconden** leven.
5. Er staat **"Tafel N geserveerd: (gerecht)"**.
6. Na de poging: kijk op het beginscherm bij **Je speelt als**. Je eigen fruit is niet veranderd.
7. **Vandaag** > **Keuken** > **Ontvang alles**: je krijgt het sap en de pluimen van die gast. Grote getallen hebben een puntje
   (bijvoorbeeld "+1.250 sap", niet "+1250 sap").
8. Tik in de Eetzaal op een kaartje van de **Menukaart**: het venster van dat fruit gaat open. Druk op terug: je staat weer in de Eetzaal.
9. Tik op het **tandwiel**. Scrol naar "Hulp: tik op een onderwerp." en tik op **Jouw Keuken**. In het stuk over de Eetzaal staat:
   **"Een sappot kan het sap van een rang betalen, nooit het level of de pluimen."** (jouw keuze A). Er staan ook de rangen tot
   Sterrenchef.
10. Alleen als je wilt: Tandwiel > **Taal: Nederlands** > **English**. In de Eetzaal staat "Dining room", "compliments" en "Menu";
    nergens een Nederlands woord. Zet de taal daarna terug.

**Test 9: ok / niet ok**

## Test 10. De Jacht op de Gouden Vork, nieuwe regel (alleen deze week, tot zondag 22 november 23 uur)

Jouw keuze 3C: de gouden vorken vallen nu **alleen in de bonusrun**. Die speelt zonder bonussen, vanaf je hoogste level, met drie vorken
per stap. Gewone pogingen houden al je bonussen.

1. Speel een gewone poging (**Spelen**). Er vallen **geen** gouden vorken. Je bonussen (keukenbonussen, startboost) werken gewoon.
2. Open **Spelen** > **Toernooi**. Bovenaan staat **"Jacht op de Gouden Vork"** met de uitleg: "Deze week vallen de gouden vorken alleen
   in de bonusrun: een ticket geeft een run zonder hartje en zonder bonussen, vanaf je hoogste level, met drie vorken per stap."
3. Tik **Bonusrun · 1 ticket**. De run begint op je **hoogste** level (rond 122), zonder startboost.
4. Per stap vallen er **drie** gouden vorken. Pak er een: je vorkenteller gaat omhoog.
5. Na de run: bij het toernooi staat je aantal vorken hoger.
6. Is je Eetzaal al open? Speel dan een gewone poging met een fruit dat sterren heeft op je Menukaart. De gerechtbonus werkt nu ook in
   een Jacht-week helemaal: sneller (balk) en sappiger.

**Test 10: ok / niet ok**

## Test 11. Later, als je het level haalt: Chef de partie en De brigade

Doe elk stukje pas als je dat level haalt. Je hoeft niet alles in één keer te doen; stuur "test 11A ok", "test 11B ok" enzovoort.

**11A. Chef de partie (level 140, 150 pluimen, 100.000 sap).**

1. Onder **Nu te doen** staat **"Je kunt Chef de partie worden"**. Tik erop: je komt in de Eetzaal.
2. Tik **Word Chef de partie · 100.000 sap**. Je ziet het onthullingsfilmpje: je keuken wordt **koper**.
3. Tik tijdens het filmpje één keer op het scherm om het over te slaan. De kaart **"Je keuken is nu Koper!"** blijft staan (ze verdwijnt
   niet meteen). Een tweede tik sluit ze.
4. Op de kaart staat "333 → 799 sap per uur" (op level 140; hoger level, meer sap). Bij de toestellen staat **"Koper"** in plaats van "Max".
5. In de Eetzaal staat nu: **"Souschef op level 165"** met een grijze knop **Word Souschef · 150.000 sap**.
6. **De Bar**: zijn alle gasten van vandaag geserveerd, dan krijg je bij **Ontvang alles** **+1 hartje**.

**11B. Souschef (level 165, 400 pluimen, 150.000 sap).**

1. Promoveer via **Nu te doen** ("Je kunt Souschef worden") en de knop in de Eetzaal.
2. Een kort filmpje: in je zaal vliegt een doek weg van **De Houtoven**. Chef Rosa zegt: "Ja, chef! Vanaf vandaag ben jij Souschef."
3. De kaart **"Je bent nu Souschef!"**. Tik om te sluiten.
4. Meteen daarna zie je in de Eetzaal de keuze **Huisspecialiteit**. Kies **Houtovenpizza** (een minispel om de 4 stappen) of **Gouden
   regen** (8 gouden klontjes bij elk nieuw level aan je top, alleen voor je spaarpot).
5. Speel een gewone poging en kijk of je huisspecialiteit werkt. In een duel of toernooi werkt ze niet.

**11C. Chef (level 190, 750 pluimen, 200.000 sap).**

1. De onthulling: je keuken wordt **zilver**. De kaart zegt **"Je bent nu Chef."** en noemt **Het Doorgeefluik: bestellingen groeien
   mee**.
2. Je keuken maakt nu ongeveer **1.449 sap per uur** (op level 190) en bewaart **24 uur**.
3. In de Eetzaal: een **4de gast**, de **snijplank** (kies Schild, Stroop of Magneet: één gratis startboost per dag) en de **Chefspecial**
   ("Geef de ... zijn volgende ster" met een knop **Speel**).
4. De bestellingen van de chef groeien mee: op level 190 2.530, 5.050 en 7.580 sap, en 10.110 extra voor alle drie.

**11D. Chef-kok (level 220, 1.200 pluimen, 250.000 sap).**

1. Een kort filmpje, de kaart en **een extra hartjesplek**: je kunt nu één hartje meer hebben.
2. Bij de huisspecialiteit kun je nu ook **Honingstart** kiezen (4 seconden honing bij elk nieuw level aan je top).

**11E. Sterrenchef (level 250, 1.800 pluimen, 300.000 sap).**

1. De onthulling: je keuken wordt **goud** (ongeveer **2.331 sap per uur** op level 250). De kaart zegt **"Je bent nu Sterrenchef."**
2. Een **5de gast** en **De Gouden Zaal**: alle gasten geserveerd geeft **2 hartjes en een reeksschild**.
3. Bij de huisspecialiteit kun je nu ook **Picknickmand** kiezen (een kwart minder gevaren).
4. Bij **2.050 pluimen** krijg je je eerste **ster**: een hartje en een reeksschild, en je keuken wordt 5% sappiger. Elke 250 pluimen
   een nieuwe ster; elke vijfde ster geeft 5 hartjes.

**Test 11: ok / niet ok (per stukje)**

## Test 12. Wat vind je ervan?

Schrijf er gerust een paar woorden over, het hoeft niet lang:
- Voelt **60.000 sap** voor de deur en **100.000 sap** voor Chef de partie goed? Te duur, te goedkoop, of juist?
- Zijn **3 gasten per dag** een leuk dagdoel? Is hun sap genoeg?
- Gaan de **pluimen** snel genoeg? (Ze zijn de rem voor de rangen, niet de levels.)
- Is het **toneeltje** te lang, te kort, of goed? Hoor je het **kloppen**, het **lint** en de "ting" van de onthulling goed? Wordt je
  telefoon warm?
- Let op: vraagt de **Chefspecial** altijd een ster die je binnen een week kunt halen, of soms een die te ver weg is?
- Let op: **Honingstart** doet niets als er al een andere bonus loopt, bijvoorbeeld een startboost op je eerste level. Is dat duidelijk
  genoeg, of voelt het als een fout?
- Let op: in een Jacht-week zijn je 10 gratis tickets per dag 10 bonusruns **vanaf je hoogste level**. Is dat leuk, of gaat je level
  daardoor te snel omhoog?
- Let op: **Honingstart** zet alles 4 seconden stil en trekt alle klontjes naar je toe (zoals een magneet). Is dat te sterk?
- Let op: wie in een Jacht-week minstens één vork pakt, krijgt de **1.000 sap** van de volle meter. Is dat een goede prijs voor iedereen?
- Is "Daag een vriend uit · naar Vrienden" duidelijk? En de nieuwe namen **Schimduel** en **Uitdaging (24 u)**?
- Merk je in het live duel dat je vriend na een hapering sneller weer bij is?

Stuur na elke test **"test N ok"**, of beschrijf wat je ziet.
