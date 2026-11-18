# Testlijst v0.33.2 - Duels onder Spelen, de bonusrun, de Weekkeuring, de meldingen en het live duel

Wat er nieuw is:
- Duels staat nu onder **Spelen** (Levels · Dagmes · Duels · Toernooi · Seizoen). Onder Vrienden staan Vrienden en Rivalen.
- De bonusrun van de Jacht op de Gouden Vork telt alleen voor het toernooi. Na een bonusrun staat er "Nog een bonusrun · 1 ticket"
  of "Terug naar Toernooi". In de bonusrun is er geen "Verder" met een filmpje meer, en geen grote balk "LEVEL ...".
- Geen reclame meer op "Ander fruit" als je hartjes op zijn.
- Keuken, stap 3: de **Weekkeuring** van Chef Ada in je Eetzaal, en proeven bij vrienden. Krijg je een bord, dan staat er "+1 bord".
- **Meldingen**: de kaart "Mogen we je een seintje geven?", Instellingen › Meldingen, "Geen meldingen over ...", meldingen van
  vrienden en herinneringen van je telefoon.
- **Live duel**: ook na snel "Nog een keer" heb je live beeld, na het afsluiten van beide apps doet de knop **Live duel** nooit meer
  "niets" en komt de uitslag toch, en het zwarte vak (5 tikken op de klok) werkt in elk live duel.

**v0.33.2 bevat alles van v0.33.1 en ouder.** Je uploadt alleen deze nieuwste versie.

**Eerlijk vooraf: wat werkt wanneer.**
- Meteen, zonder iets extra: test 1 tot en met 4 en test 6 (Duels, de bonusrun, Ander fruit, de borden en het oordeel van de
  Weekkeuring).
- Pas na de **`firebase deploy`**: proeven bij een vriend (test 5) en alle meldingen van vrienden (test 9, 10, 11 en 13). Zonder de
  nieuwe server staat bij elke vriend in je keuken "Nog geen eetzaal" en is er geen knop "Proef bij ...". De live-duel-tests (test 15
  tot en met 19) doe je ook pas na de deploy: zonder de nieuwe server werkt het live duel wel, maar trager (zie "Live duel: lees dit
  eerst").
- Pas met **`google-services.json`** in de app: meldingen van vrienden op je telefoon en de keuze "Alleen vrienden" (test 7 tot en
  met 11, en test 13).
- Pas na **`npm install`** (de nieuwe meldingsmodule) en `npm run sync`: de herinneringen van je telefoon (test 12).
- Ik kon geen echte telefoon testen: meldingen, pop-ups, geluid en de vraag van Android zie je alleen op je eigen telefoons. De
  game zelf is automatisch getest (996 controles, allemaal geslaagd), de server op een testserver op mijn computer (niet op jouw
  project).

Hoe je test: elke test duurt een paar minuten (behalve het wachten bij test 10 en 12). Doe de stappen één voor één. Bij elke stap
staat wat je moet zien. Onderaan elke test staat "ok / niet ok". Stuur me daarna **"test N ok"**, of beschrijf wat je ziet (liefst
met een schermafbeelding en het nummer van de stap). Ik label niets als af voor jij het gespeeld hebt.

**Wat je nu kunt testen, op jouw level (ongeveer 122, Eetzaal open sinds 17 november):**
- **Deze week is een Jacht-week** (tot zondag 22 november 's avonds). Test 2 kan dus nu. De volgende Jacht-week is van **maandag
  14 tot zondag 20 december**. Of het een Jacht-week is, zie je bij **Spelen** > **Toernooi**: bovenaan staat dan "Jacht op de
  Gouden Vork". Staat daar "Sapstorm", "De Lange Nacht" of "Chefs Estafette", dan is het geen Jacht-week en sla je test 2 over.
- **De Weekkeuring:** borden verzamelen kan meteen (test 4 en 5). Het oordeel van Chef Ada komt **maandag 23 november vanaf 8 uur**
  (test 6). Als Commis krijg je 3 gasten per dag. Je eerste week telt naar rato van de dagen die nog over zijn, gerekend vanaf je
  eerste gewone poging of je eerste bezoek aan de Eetzaal met 0.33.2: begin je op woensdagavond, dan zijn de doelen ongeveer 7, 11
  en 15 borden, op donderdag 6, 9 en 12, op vrijdag 4, 7 en 9. De kaart toont de juiste getallen.
- **Meldingen:** alles kan meteen, na de stappen van test 0.

Er is **geen** testknop om naar een andere dag, een ander level of naar maandag te springen, en ik voeg er ook geen toe.

## Test 0. Beide telefoons naar versie 0.33.2 (eerst doen)

1. Doe eerst alle stappen van **"Wat jij moet doen bij v0.33.2"** in `UITROL-STAPPEN.md`: de server (`firebase deploy`), het
   bestand `google-services.json`, de regel in `AndroidManifest.xml`, `npm install`, `npm run sync`, bouwen en uploaden.
2. Op de **S26+**: open de **Play Store**, zoek **Don't Slice Me!** en tik **Bijwerken**. (Zie je nog geen update, wacht dan een
   paar minuten en kijk opnieuw.)
3. Open de app op de S26+ en tik op het **tandwiel**. Onderaan staat **"Versie v0.33.2"**.
4. Kijk in hetzelfde venster bij **Meldingen** (bovenaan, onder de eerste rij). Je ziet drie knoppen: **Alle**, **Alleen
   vrienden** en **Uit**, met de zin "Je koos nog niets. Kies Alle of Alleen vrienden om meldingen te krijgen."
   - Zie je maar twee knoppen (**Alle** en **Uit**)? Dan zit `google-services.json` niet in de app. Kijk deel 2 ("het bestand
     `google-services.json`") van "Wat jij moet doen bij v0.33.2" in `UITROL-STAPPEN.md` na en bouw opnieuw.
   - Staat er ook "Meldingen werken nog niet in deze versie van de app."? Dan zitten de meldingen helemaal niet in de app: doe
     `npm install` en `npm run sync` opnieuw.
5. **Tik bij Meldingen nog niets aan.** (Anders komt de kaart van test 7 niet.) Sluit het venster met de terugknop.
6. Op de **OnePlus 5**: open de **Play Store**, zoek **Don't Slice Me!** en tik **Bijwerken**.
7. Open de app op de OnePlus 5 en tik op het **tandwiel**. Onderaan staat **"Versie v0.33.2"**, en bij Meldingen dezelfde drie
   knoppen. Tik ook hier nog niets aan. Sluit met de terugknop.
   (Andere manier: telefoon met een kabel aan de pc en vanuit Android Studio installeren. Ook dan moet er "Versie v0.33.2" staan.)

**Test 0: ok / niet ok**

## Test 1. Duels onder Spelen (ongeveer 4 minuten)

1. Tik onderaan op **Spelen**. Bovenaan staan vijf knoppen: **Levels · Dagmes · Duels · Toernooi · Seizoen**. Alle vijf zijn
   helemaal leesbaar. Bij Duels staat het bolletje met je schimduels van vandaag (bijvoorbeeld "5/5").
2. Tik bovenaan op **Duels**. Je ziet het vak **"Live duel"** en het vak **"Duels"** (met Schimduel en Uitdaging (24 u)). Onderaan
   blijft **Spelen** oplichten.
3. Tik onderaan op **Vrienden**. Bovenaan staan nu maar twee knoppen: **Vrienden** en **Rivalen**.
4. Tik onderaan op **Spelen** en dan bovenaan op **Dagmes**. Er staat een regel **"Duels spelen"** met klein **"Spelen › Duels"**.
   Tik erop: je komt bij Spelen › Duels.
5. In het vak "Live duel" staat de knop **"Daag een vriend uit · naar Vrienden"**. Tik erop. Je komt bij **Vrienden** >
   **Vrienden**, met je vriendenlijst.
6. Tik op een vriend. Op het kaartje staan de knoppen **Live duel** en **Uitdaging (24 u)**. Tik nog eens op je vriend: het kaartje
   gaat dicht.
7. Druk op de **terugknop** van je telefoon. Je bent weer bij **Spelen › Duels**.
8. Druk nog eens op de terugknop. Je bent bij **Spelen › Levels** (je beginscherm).
9. Tik op het **tandwiel**, scrol naar "Hulp: tik op een onderwerp." en tik op **Duels, rivalen en het seizoen**. Daar staat
   **"Duels (onder Spelen › Duels)"**. Sluit met de terugknop.
10. Doe stap 1 en 2 ook op de **OnePlus 5** (kleiner scherm): ook daar zijn de vijf knoppen helemaal leesbaar.
11. Alleen als je wilt: Tandwiel > **Taal: Nederlands** > **English**. Bovenaan staat dan **Levels · Daily · Duels · Tourney ·
    Season**. Zet de taal daarna terug.

**Test 1: ok / niet ok**

## Test 2. De bonusrun van de Jacht (ongeveer 5 minuten; alleen in een Jacht-week, nu tot zondag 22 november)

De bonusrun telt nu alleen voor het toernooi (je gouden vorken). Je level, sap, stempels en opdrachten veranderen niet.

1. Tik onderaan op **Spelen** > **Levels**. Onthoud je level en je sap (bovenaan).
2. Tik bovenaan op **Toernooi**. Bovenaan staat **"Jacht op de Gouden Vork"** met "Nog ..." (hoe lang de week nog loopt). In de
   uitleg staat als laatste zin: **"Een bonusrun telt alleen voor het toernooi (de vorken): niet voor je levels, sap, stempels of
   opdrachten."**
3. Tik **Bonusrun · 1 ticket**. De run begint op je hoogste level, zonder hartje.
4. Pak een paar suikerklontjes. Er staat **"+3"** (of een ander getal), zonder het woord "sap".
5. Pak een gouden vork. Speel tot je geraakt wordt.
6. Op het eindscherm staat **"Bonusrun: telt alleen voor het toernooi, niet voor je levels."** en daaronder bijvoorbeeld "1 gouden
   vork in deze bonusrun · 3 deze week. Je level, sap, stempels en opdrachten blijven zoals ze waren."
7. De grote knop heet **"Nog een bonusrun · 1 ticket (nog N)"** (N = je tickets). Er staat geen "Opnieuw", geen "Sap
   verdubbelen" en geen knop "Verder" met een filmpje. Wel **Ander fruit**.
8. Tik **Nog een bonusrun · 1 ticket**. Er start meteen een nieuwe bonusrun. Je hartjes blijven gelijk (er gaat geen hartje af).
9. Tik tijdens die run op de **pauzeknop** en dan op **Stoppen**. Je komt bij **Spelen › Toernooi** (niet bij Levels).
10. Start nog een bonusrun en speel tot het eindscherm. Druk op de **terugknop** van je telefoon: je komt bij **Spelen ›
    Toernooi**.
11. Tik op **Levels**. Je level is hetzelfde als bij stap 1, ook als je in de bonusrun een level verder kwam. Je sap ook. (Enige
    uitzondering: haal je met je vorken een mijlpaal van het toernooi, dan krijg je die beloning, zoals in elke Jacht-week.)
12. Alleen als je je tickets van vandaag toch opmaakt: met 0 tickets heet de knop op het eindscherm **"Terug naar Toernooi"**. Tik
    erop: je komt bij Spelen › Toernooi.
13. Kom je in een bonusrun bij een nieuwe stap, dan staat er **geen** grote balk "LEVEL ..." met "... sap nodig". Je ziet wel klein
    "Stap 2/7" of "Level 123" bij je fruit, en bij elke vork die je pakt "+1 gouden vork (N)". De regel bovenaan ("Level 123 · ...")
    blijft staan.

**Test 2: ok / niet ok**

## Test 3. Geen reclame op "Ander fruit" bij 0 hartjes (ongeveer 4 minuten)

Zorg dat **Reclamevrij**, **Plus** en de **10 minuten onbeperkte hartjes** uit staan (zoals normaal).

1. Speel gewone pogingen tot je **0 hartjes** hebt.
2. Op het eindscherm van je laatste hartje: tik **Ander fruit**.
3. Je komt **meteen** bij je fruit. Er komt **geen** reclame, ook niet een paar seconden later.
4. Tik onderaan op **Spelen** en start een gewone poging. Je ziet het hartjesscherm "Geen hartjes meer" (zoals in v0.33.1),
   zonder reclame ervoor.
5. Ter info: met hartjes over kan er na twee verloren hartjes nog wel een gewone reclame komen, zoals vroeger. Dat hoort zo.

**Test 3: ok / niet ok**

## Test 4. De Weekkeuring: borden verzamelen (ongeveer 5 minuten, op de telefoon met je Eetzaal)

1. Tik **Vandaag** > **Keuken** en bovenaan op **Eetzaal**.
2. Onder **Dagservice** staat een nieuwe kaart **"Weekkeuring · N borden"** met een balk en drie getallen eronder (je doelen).
3. Op de kaart staan de drie oordelen: **Lekker**, **Heerlijk** en **Verrukkelijk**, elk met wat het doet. Daaronder "Nu actief:
   nog niets. Haal deze week Lekker, dan werkt Proeverssap de hele volgende week."
4. Omdat dit je eerste week is, staat er ook: **"Je eerste week telt naar rato van de dagen die nog over zijn."** De doelen zijn
   daarom lager dan 9, 15 en 21.
5. Onderaan staat **"Chef Ada keurt je zaal maandag om 8 uur. Dan begint de teller weer bij 0."**
6. Tik bij een gast van de Dagservice op **Speel** en blijf minstens **40 seconden** leven.
7. Er staat "Tafel N geserveerd: (gerecht) · +1 bord". Speel verder tot je geraakt wordt. Tik daarna onderaan op **Vandaag** (en zo nodig
   bovenaan op **Keuken** en **Eetzaal**): bij "Weekkeuring" staat **1 bord meer**.
8. Tik bovenaan op **Keuken**. Staat er bij **Bestellingen van deze week** een bestelling klaar? Tik dan op **Ontvang**: op het
   kaartje staat ook **"+1 bord"** (bij de laatste van de drie **"+2 borden"**: alle drie samen geven 1 extra). Tik bovenaan op
   **Eetzaal**: bij "Weekkeuring" staan er zoveel borden meer.
9. Tik bovenaan op **Keuken** en scrol naar beneden. Daar staat nu **"Je vrienden"** (niet meer "Keuken van de week"): geen kroon,
   geen nummers, geen volgorde op score. Bij een vriend met een Eetzaal staat bijvoorbeeld "4/9 borden" en de knop **Proef bij
   ...**; bij een vriend zonder Eetzaal "Nog geen eetzaal" en **Bezoek**. (De borden van je vrienden zie je pas na de
   `firebase deploy`, en pas als die vriend ook 0.33.2 heeft; tot dan staat bij elke vriend "Nog geen eetzaal".)

**Test 4: ok / niet ok**

## Test 5. Proeven bij een vriend (ongeveer 4 minuten, twee telefoons, pas na de `firebase deploy`)

Hier proeft je vriend (de OnePlus 5) in jouw Eetzaal (de S26+). Je vriend heeft zelf geen Eetzaal nodig.

1. Op de **S26+**: open de game (bij het openen stuurt de game de samenvatting van je Eetzaal naar de server) en tik **Vandaag** >
   **Keuken** > **Eetzaal**. Op de **OnePlus 5**: tik onderaan op **Vrienden** (zo ververst de lijst). Tik daarna op de OnePlus 5
   **Vandaag** > **Keuken** en scrol naar **"Je vrienden"**.
2. Bij jouw naam staat de knop **"Proef bij (jouw naam)"**. Tik erop.
3. Je ziet je keuken van de andere kant, met een vak **"Eetzaal van (jouw naam)"**, je borden en je gerechten als knoppen.
   Eronder: "Tik op een gerecht om te proeven: jullie krijgen allebei 2 pluimen en ... krijgt 1 bord voor de weekkeuring."
4. Tik op een gerecht. Er staat **"Geproefd! (jouw naam) krijgt 1 bord."** en een kaartje **"Je proefde bij ..."** met de 2
   pluimen.
   - Staat er "Je account is nog nieuw: proeven kan na een week met 3 speeldagen." of "Jullie zijn pas deze week vrienden: proeven
     telt vanaf maandag."? Dan doet de server wat hij moet doen (zo telt hij). Schrijf op wat er staat.
5. Tik op de OnePlus 5 nog eens op een gerecht. Dat kan niet meer: **"Je proefde vandaag al bij ...; morgen weer."**
6. Op de **S26+**: open de game (of tik op **Vrienden**). Na enkele seconden zie je een kaartje **"(naam) proefde je (gerecht)"**
   met **"+1 bord, nog N tot Lekker."** en +2 pluimen.
7. Op de S26+: **Vandaag** > **Keuken** > **Eetzaal**. Bij "Weekkeuring" staat 1 bord meer, en **"Proefden deze week: (naam)"**.
8. Morgen kan je vriend opnieuw proeven (één keer per vriend per dag).

**Test 5: ok / niet ok**

## Test 6. Maandag: het oordeel van Chef Ada (vanaf maandag 23 november, 8 uur; ongeveer 5 minuten)

Dit kan pas als je deze week genoeg borden haalt voor **Lekker** (het eerste getal onder de balk). Haal je dat niet, dan komt er
maandag geen stempel en kijk je bij stap 7.

1. Open de game na maandag 8 uur. Onder **Nu te doen** staat **"Chef Ada keurde je zaal: Lekker"** (of Heerlijk of Verrukkelijk),
   met klein "Vandaag · Keuken · Eetzaal". Tik erop.
2. Je ziet de eetzaal en een rode stempel **"CHEF ADA"** met **LEKKER** (of HEERLIJK of VERRUKKELIJK) en sterren. Erboven staat
   "Chef Ada: Lekker!", eronder "Tik om verder te gaan" en de knop **Overslaan**. Tikken of **Overslaan** slaat over.
3. Daarna een kaartje **"Chef Ada: Lekker!"** met wat je deze week krijgt, en **"Dit werkt deze hele week in je gewone pogingen."**
4. Op de kaart Weekkeuring staat nu **"Nu actief: +10% sap. Alleen in gewone pogingen."** (bij Heerlijk ook "Proefschil", bij
   Verrukkelijk ook "Lange smaak"). De teller van deze week begint weer bij 0.
5. Speel een **gewone poging**. Bij de start staat **"Keuring: Lekker ✓"**. Op het eindscherm staat achter de regel met je
   suikerklontjes **"· Proeverssap +10%: +N sap"**.
   - Bij **Heerlijk**: bij de start staat er een stippellijn rond je fruit en bovenaan "Nog 1 snee vrij". De eerste snee breekt
     alleen die schil: er staat **"(naam van een proever) vangt het mes!"** of **"Proefschil!"**.
   - Bij **Verrukkelijk**: pak een bonusvoorwerp. Er staat **"Lange smaak +25%"**.
6. Speel een **Schimduel** (Spelen › Duels). Daar staat geen "Keuring", geen stippellijn en geen Proeverssap-regel.
7. Haalde je deze week geen Lekker? Dan is er geen stempel en geen regel onder "Nu te doen", en op de kaart staat "Nu actief: nog
   niets. ...". Ook dat is goed.

**Test 6: ok / niet ok**

## Test 7. Meldingen: de kaart "Mogen we je een seintje geven?" (ongeveer 5 minuten, twee telefoons)

De kaart komt nooit bij het opstarten en nooit tijdens een poging of op het eindscherm, maar na een goed moment: bijvoorbeeld als je
een live duel start, of na een duel zodra je het eindscherm verlaat. Kwam de kaart
op een telefoon al eerder (na een live duel, een uitdaging of een nieuwe vriend)? Dan komt ze daar niet opnieuw: schrijf op wat je
toen koos en doe op die telefoon test 8.

1. Open eerst de game op de **OnePlus 5** en laat ze open (zo staat je vriend online; anders is de knop **Live duel** grijs). Op de
   **S26+**: **Vrienden** > tik op je vriend (de OnePlus 5) > **Live duel**. Het wachtvenster van de uitnodiging verschijnt.
2. Binnen een paar seconden komt er een kaart bovenop: **"Mogen we je een seintje geven?"** (in hoofdletters), met "Bijvoorbeeld
   als een vriend begint te spelen of je uitdaagt. Nooit 's nachts, nooit reclame."
3. Boven de knoppen staat het vakje **"Laat mijn vrienden ook weten wanneer ik ga spelen"**. Het is leeg. Laat het leeg.
4. Daaronder: **Alle meldingen** ("vrienden + handige herinneringen (hartjes vol, keuken vol, toernooi)"), **Alleen vrienden**
   ("vriend speelt nu, uitnodigingen, uitdagingen") en **Niet nu**. (Neem op de OnePlus 5 nog niets aan.)
5. Tik **Alle meldingen**. Nu vraagt Android zelf of de game meldingen mag sturen. Tik **Toestaan**.
6. De kaart is weg; het wachtvenster van je uitnodiging staat er nog.
7. Op de **OnePlus 5**: neem de uitnodiging aan en speel het live duel uit (zoals altijd).
8. Na de uitslag, als je op de OnePlus 5 weer in het menu bent, komt daar dezelfde kaart. **Vink het vakje aan** ("Laat mijn
   vrienden ook weten wanneer ik ga spelen").
9. Tik **Niet nu**. De kaart is weg, Android vraagt niets, en je kunt gewoon verder spelen.
10. Op de S26+ komt de kaart niet opnieuw (je koos al).

**Test 7: ok / niet ok**

## Test 8. Instellingen › Meldingen (ongeveer 3 minuten, twee telefoons)

1. Op de **OnePlus 5**: tik op het **tandwiel**. Bij **Meldingen** staat "Je koos nog niets. Kies Alle of Alleen vrienden om
   meldingen te krijgen." en **"Laat vrienden weten wanneer ik ga spelen: aan"** (want je vinkte het vakje aan).
2. Tik **Alleen vrienden**. Op een telefoon met een nieuwere Android vraagt Android nu toestemming: tik **Toestaan**. (Op een
   oudere Android komt er geen vraag; dan staan meldingen meteen aan.)
3. **Alleen vrienden** licht op. Eronder staat **"Vrienden: aan"** met ingesprongen: "Vriend begint te spelen: aan",
   "Live-duel-uitnodigingen: aan", "Uitdagingen en vriendverzoeken: aan". (Staat er alleen "Live-duel-uitnodigingen: aan", dan is
   de server nog niet bijgewerkt: doe eerst de `firebase deploy`.)
4. Kijk ook naar **"Vrienden zien dat ik online ben: aan"**. Laat dat aan staan (anders krijgt niemand "speelt nu" over jou).
5. Onderaan staat: **"Stille uren: van 21:00 tot 08:00 op je eigen klok. Hoogstens 3 meldingen per dag, nooit reclame."**
6. Sluit met de terugknop.
7. Op de **S26+**: tandwiel > **Meldingen**. **Alle** licht op. Je ziet "Vrienden: aan" met dezelfde drie rijen, en **"Spel:
   aan"** met "Hartjes weer vol: aan", "Keuken vol: aan", "Toernooi: aan", "Fruitpas eindigt: aan" en "Mes van de dag is nieuw:
   uit". Verder "Laat vrienden weten wanneer ik ga spelen: uit". (Staat er in plaats van "Spel: aan" de zin "Herinneringen werken
   nog niet in deze versie van de app."? Dan ontbreekt de nieuwe meldingsmodule: doe `npm install` en `npm run sync` opnieuw.)
8. Tik op **"Mes van de dag is nieuw: uit"**: het wordt "aan". Tik nog eens: weer "uit". Sluit met de terugknop.

**Test 8: ok / niet ok**

## Test 9. Een melding van een uitdaging (ongeveer 4 minuten, twee telefoons, tussen 8 en 21 uur)

1. Op de **OnePlus 5**: ga naar het startscherm van je telefoon (de game niet openhouden). Wacht 2 minuten.
2. Op de **S26+**: **Vrienden** > tik op je vriend > **Uitdaging (24 u)** > **Speel nu**. Speel je 90 seconden.
3. Op de **OnePlus 5** komt binnen ongeveer een minuut een melding als pop-up: **"(jouw naam) daagt je uit (24 uur)"** met
   **"Klop de score binnen 24 uur."**
4. Tik op de melding. De game opent op **Spelen › Duels**, met de uitdaging.
5. Speel de uitdaging (of laat ze staan: ze loopt 24 uur).

**Test 9: ok / niet ok**

## Test 10. "Speelt nu" tussen de twee telefoons (een paar minuten, maar met 3 uur wachten; tussen 8 en 21 uur)

De melding "speelt nu" komt alleen als je vriend minstens **3 uur niet speelde** en het zelf aanzette (de OnePlus 5 deed dat in
test 7), en alleen bij wie zelf meldingen van vrienden koos (de S26+ koos Alle).

1. Op de **OnePlus 5**: sluit de game en speel **minstens 3 uur niet**.
2. Op de **S26+**: zorg dat de game dicht is (startscherm van je telefoon). Leg de telefoon niet uren met het scherm uit weg vlak
   voor stap 3: Android kan een gewone melding dan uitstellen, en "speelt nu" vervalt na 10 minuten.
3. Na de 3 uur (en tussen 8 en 21 uur): open de game op de **OnePlus 5**.
4. Op de **S26+** komt binnen ongeveer een minuut een pop-up: **"(naam) speelt nu"** met **"Daag (naam) uit voor een live
   duel!"**
5. Tik op de melding. De game opent **Vrienden**, met het kaartje van je vriend open (met **Live duel**).
6. Sloot je vriend de game intussen al? Dan staat er **"(naam) is net gestopt; daag (naam) uit voor 24 uur."**
7. Ter info: over dezelfde vriend krijg je dit hoogstens 1 keer per dag, en hoogstens 2 keer per dag in totaal.

**Test 10: ok / niet ok**

## Test 11. "Geen meldingen over ..." (ongeveer 4 minuten, twee telefoons)

1. Op de **S26+**: **Vrienden** > tik op je vriend. Onder de knoppen staat **"Geen meldingen over (naam)"**. Tik erop.
2. Er staat nu **"Weer meldingen over (naam)"**.
3. Ga op de S26+ naar het startscherm van je telefoon en wacht 2 minuten.
4. Op de **OnePlus 5**: stuur een **Uitdaging (24 u)** naar de S26+ en speel je 90 seconden.
5. Op de S26+ komt **geen** melding. Open de game en tik **Spelen** > **Duels**: daar staat de uitdaging wel ("(naam) daagt je
   uit" met **Speel**). Onder "Nu te doen" staat ze alleen als er plaats is: die lijst toont hoogstens 3 regels, en die van je
   beloningen, je keuken en het Mes van de dag komen eerst. Speel ze (dan kan je vriend je bij test 13 opnieuw uitdagen).
6. Tik op de S26+ bij je vriend op **"Weer meldingen over (naam)"**: er staat weer "Geen meldingen over (naam)".

**Test 11: ok / niet ok**

## Test 12. Herinneringen van je telefoon en de stille uren (een paar minuten, en dan wachten)

Alleen met **Alle meldingen** (de S26+). Je telefoon plant de herinneringen zelf in als je de game wegzet, en schrapt ze als je de
game opent. Hoogstens **1 herinnering per dag**, nooit tussen **21:00 en 08:00**. Ze komen met een geluid in je meldingen, zonder
pop-up.

1. **Hartjes** (op een dag, vóór 15 uur: je hartjes moeten vol zijn vóór 21 uur): zorg dat Plus en de onbeperkte hartjes uit
   staan. Speel op de S26+ tot je **0 hartjes** hebt.
2. Ga naar het startscherm van je telefoon. Open de game niet meer tot de melding komt.
3. Als je hartjes vol zijn (na hoogstens 5 uur), komt **"Je 5 hartjes zijn terug"** (het getal is hoeveel hartjes jij kunt
   hebben; op jouw level meestal 5) met **"Tik om verder te spelen."**
4. Tik op de melding: de game opent het hartjesscherm.
5. **Keuken** (op een andere dag: elke dag komt er maar één): haal 's ochtends tussen 8 en 9 uur je keuken op (**Vandaag** >
   **Keuken** > **Haal op**). Zet de game weg en open ze die dag niet meer.
6. 12 uur later (tussen 20 en 21 uur) komt **"Je keuken zit vol"** met **"12 uur sap staat klaar om op te halen."** Tik erop: de
   game opent je Keuken.
7. **Stille uren**: speel op een avond om ongeveer 20 uur tot 0 hartjes en zet de game weg. Je hartjes zijn pas na 21 uur vol: er
   komt **geen** melding over je hartjes, ook de volgende ochtend niet.
8. Let ook de komende dagen op: er komt nooit een melding tussen 21:00 en 08:00 (alleen "... zit in de lobby!" van een live duel
   dat je zelf startte of aannam, komt ook 's avonds), en nooit meer dan 3 per dag.

**Test 12: ok / niet ok**

## Test 13. Op een melding tikken tijdens een poging (ongeveer 3 minuten)

Melding tijdens een poging: tik tijdens het spelen op een melding (bijvoorbeeld "Lotte daagt je uit"). De game opent die plek pas na
je poging: als je op Stoppen tikt, of als je daarna naar Spelen gaat. Tik je op een melding terwijl het eindscherm openstaat, dan
opent hij meteen.

1. Laat een melding binnenkomen terwijl de game op de S26+ dicht is (bijvoorbeeld een uitdaging zoals in test 9, maar nu van de
   OnePlus 5 naar de S26+). **Tik er nog niet op.** (Komt er geen melding? Met Alle meldingen krijgt de S26+ hoogstens 2
   meldingen van vrienden per dag, want de derde plek is voor een herinnering van je telefoon. Kreeg je vandaag al "speelt nu" en
   een andere vriendmelding, probeer het dan morgen.)
2. Open de game op de S26+ via het icoon (niet via de melding) en start een gewone poging.
3. Trek tijdens de poging je meldingen naar beneden en tik op de melding.
4. De game blijft bij je poging. Hij springt niet midden in het spel naar een ander scherm.
5. Tik op de pauzeknop en dan op **Stoppen**. Nu opent de game **Spelen › Duels**.

**Test 13: ok / niet ok**

## Test 14. Zonder meldingen werkt alles gewoon (ongeveer 2 minuten)

1. Op de **OnePlus 5**: tandwiel > **Meldingen** > tik **Uit**. **Uit** licht op.
2. Speel een poging, open Vrienden, Duels en je Keuken: alles werkt zoals altijd. Je ziet alles nog in de game (de bolletjes en
   de regels onder "Nu te doen").
3. Er komen op de OnePlus 5 geen meldingen meer, ook geen herinneringen.
4. Wil je de meldingen terug: tik **Alleen vrienden** (of **Alle**).

**Test 14: ok / niet ok**

## Live duel: lees dit eerst (test 15 tot en met 19)

Je hebt beide telefoons nodig, allebei met v0.33.2. Hieronder is **A** de **S26+** en **B** de **OnePlus 5**. Waar "(naam)" staat,
zie je in de game de naam van je vriend; "(jouw naam)" is jouw naam.

Doe deze tests:
- pas na de **`firebase deploy`**. Zonder de nieuwe server werkt het live duel ook, maar dan wacht het spel na **Klaar** 4 tot 10
  seconden (op de knop staat dan "live verbinding…"), en na het afsluiten van de apps zie je een paar minuten lang de kaart "Je vorige
  live duel wordt nog afgesloten";
- pas na test 7, anders komt de kaart "Mogen we je een seintje geven?" midden in een test;
- na elkaar, met de game open op beide telefoons. Test 17 en 18 beginnen in de lobby waar de vorige test eindigt, en test 19 begint
  met de uitnodiging die aan het eind van test 18 openstaat. (Waarom: vlak na een uitnodiging kan je dezelfde vriend 2 minuten lang niet
  opnieuw uitnodigen; dan staat er "Even wachten". Dat hoort zo.)

**Wat ging er mis op jullie telefoons (v0.33.1)?**

1. Tikten jullie na "Nog een keer" meteen op **Klaar**, dan startte het duel voor het live beeld klaar was. Je zag je vriend dan een paar
   seconden te laat, en nooit op de plek waar hij echt was. Het zwarte vak (5 tikken op de klok) deed dan niets.
2. Sloten jullie allebei de app af tijdens een live duel, dan deed de knop **Live duel** daarna één tot vijf minuten niets. De uitslag
   van dat duel kwam nooit.
3. In `TESTLIJST-v0.33.1.md` (test 6, stap 4) stond dat de regel "vriend:" de onderste regel van het zwarte vak is. Dat klopt niet: het
   is met live beeld de **5de regel**, en meestal heeft het vak 8 regels.

**Wat doet v0.33.2 nu?**

1. Het spel wacht heel even tot het live beeld klaar is, en start dan pas. Soms zie je even "Live beeld verbinden…". Meestal duurt dat
   minder dan 1 seconde, hoogstens ongeveer 10 seconden.
2. Na het afsluiten van de apps zie je "Live duel onderbroken" en daarna de uitslag. Je kan meteen weer een live duel starten. Moet het
   spel toch nog even wachten, dan zegt een kaart waarom. De knop doet nooit meer "niets".
3. Het zwarte vak werkt in elk live duel, en bij de start van elk duel staat het uit. Start een duel toch zonder live beeld, dan zegt
   het spel dat bij de start: "Geen live beeld: je ziet (naam) een paar seconden later."
4. Wacht je op antwoord van een vriend, dan staat op zijn kaart "Je wacht op antwoord van (naam)." en een knop **Annuleer**.

**Het zwarte vak: wat staat erin?**

- Je opent het zo: tik in een live duel 5 keer snel op het **midden** van de klok bovenaan (het grote getal, bijvoorbeeld "45,3 s": tik
  op de komma). Tik niet op de linkerkant van de klok (daar raak je soms het huisje of het vlagje ernaast) en niet op de "s" helemaal
  rechts (heb je veel sap, dan staat de klok meer naar rechts en telt een tik op de "s" niet mee).
- Het vak staat **linksonder**. Het is een zwart vak met kleine letters.
- Zoek de regel die begint met **"vriend:"**.

**Met live beeld** heeft het vak meestal 8 regels, soms 5. De regel "vriend:" is dan de **5de regel**. Hij ziet er zo uit:

`vriend: live · achter 0,2 s · 15/s · opnieuw 0 · knip 0`

| Stuk | Wat het betekent | Goed |
|---|---|---|
| **live** | Je ziet je vriend rechtstreeks. Andere woorden die je kan zien: **zwak** (het live beeld hapert even), **vertraagd** (je vriend komt even via de server, een paar seconden later), **weg** (het live beeld is even helemaal weg) | live |
| **achter 0,2 s** | Zoveel seconden loopt het beeld van je vriend achter | minder dan 1 seconde |
| **15/s** | Zoveel keer per seconde komt er een nieuw beeld van je vriend binnen. 0/s betekent: er komt niets binnen | ongeveer 15 |
| **opnieuw 0** | Zoveel keer moest het live beeld opnieuw verbinden | 0 |
| **knip 0** | Zoveel keer sprong het beeld vooruit om bij te blijven | 0 of een klein getal |

Staat er bovenaan het vak "gedeeld veld: uit (fout bij de start)"? Dan ging er bij de start iets mis: het vak heeft dan 4 regels en
"vriend:" is de 2de regel. Maak daar een schermafbeelding van.

**Zonder live beeld** heeft het vak 3 regels. De eerste regel is:

`vriend: uit · geen live beeld (via server, 5 s later)`

- Daaronder staan "server: ar 0 · …" en "beats: …". Die twee regels zijn voor ons.
- Tik je nog eens 5 keer snel op de klok, dan verdwijnt het vak.
- Bij het volgende live duel staat het vak eerst weer uit.

**Staat er "Geen live beeld"?** Bij de start van een live duel kan 4 seconden lang "Geen live beeld: je ziet (naam) een paar seconden
later." staan. Het duel telt dan gewoon; je ziet je vriend alleen een paar seconden te laat. Dat kan alleen als het live beeld na
ongeveer 10 seconden nog niet klaar is: als één van de twee telefoons een slechte of geblokkeerde internetverbinding heeft (zwakke wifi,
een zwak mobiel netwerk, een VPN of een strenge wifi op het werk), of als je vriend nog een heel oude versie van de game heeft. In test 15
tot en met 18 hoort deze melding **niet** te komen. Komt ze toch, doe dan dit:

1. Tik 5 keer snel op het midden van de klok bovenaan.
2. Verwacht: linksonder het zwarte vak, met bovenaan "vriend: uit · geen live beeld (via server, 5 s later)".
3. Maak een schermafbeelding van het zwarte vak.
4. Schrijf op welke telefoon het was, en of die op wifi of op mobiel internet zat.

## Test 15. Live duel: drie keer snel "Nog een keer" (ongeveer 8 minuten, twee telefoons)

1. A: tik onderaan op **Spelen** en dan bovenaan op **Duels**.
2. A: tik op **"Daag een vriend uit · naar Vrienden"**.
3. A: tik op de kaart van B.
4. A: tik op **Live duel**.
5. B: tik op **Speel**.
6. B: tik op **Klaar**.
7. A: tik op **Klaar**.
8. Speel het duel uit op beide telefoons.
9. A: tik op **Nog een keer**.
10. B: tik meteen op **Speel** bij "(jouw naam) wil nog een keer!".
11. B: tik meteen op **Klaar**.
12. A: tik meteen op **Klaar**.
13. Verwacht op beide telefoons: binnen ongeveer 1 seconde staat er **"Daar gaan we!"**, en dan telt het spel af tot de start. Soms staat
    er eerst heel even "Live beeld verbinden…" (hoogstens ongeveer 10 seconden).
14. Verwacht in het duel: er komt **geen** melding "Geen live beeld". Je vriend beweegt vloeiend, op de plek waar hij echt is.
15. A: tik 5 keer snel op het midden van de klok bovenaan.
16. Verwacht op A: linksonder het zwarte vak. De 5de regel begint met "vriend: live". Na "achter" staat minder dan 1 seconde
    (bijvoorbeeld "achter 0,2 s"), en daarna ongeveer "15/s".
17. B: tik 5 keer snel op het midden van de klok bovenaan.
18. Verwacht op B: hetzelfde als op A.
19. Speel het duel uit op beide telefoons.
20. Doe stap 9 tot en met 19 nog twee keer. Zo speel je in totaal drie keer snel "Nog een keer".
21. Verwacht bij elk nieuw duel: het zwarte vak staat bij de start uit. Pas na 5 tikken komt het terug.
22. Stond er bij "vriend:" ooit iets anders dan "live" (bijvoorbeeld "vertraagd" of "weg")? Maak dan een schermafbeelding van het
    zwarte vak.

**Test 15: ok / niet ok**

## Test 16. Live duel: beide apps afsluiten tijdens een duel (ongeveer 4 minuten, twee telefoons)

1. Start een live duel zoals in test 15, stap 1 tot en met 7.
2. Wacht ongeveer 20 seconden in het duel.
3. A: sluit de app helemaal af (veeg hem weg uit de lijst met open apps).
4. B: sluit de app helemaal af.
5. A: open de app weer.
6. B: open de app weer.
7. Verwacht op beide telefoons: de kaart **"Live duel onderbroken"**.
8. A: tik op **Oké**.
9. B: tik op **Oké**.
10. Verwacht op beide telefoons: de uitslag van dat duel. Op de ene telefoon komt ze meestal meteen, op de andere soms pas na ongeveer
    20 seconden.
11. A: tik op **Oké** bij de uitslag.
12. B: tik op **Oké** bij de uitslag.
13. A: tik onderaan op **Vrienden**.
14. A: tik op de kaart van B.
15. A: tik op **Live duel**.
16. Verwacht: de uitnodiging gaat meteen weg ("Uitnodiging verstuurd"). Er staat **niet** "Even wachten". De knop doet nooit "niets".
17. B: tik op **Speel**. Jullie staan nu samen in de lobby: ga meteen verder met test 17.

**Test 16: ok / niet ok**

## Test 17. Live duel: de apps na elkaar weer openen (ongeveer 4 minuten, twee telefoons)

1. Jullie staan nog samen in de lobby van test 16. (Doe je test 17 apart: start een live duel zoals in test 15, stap 1 tot en met 7, en
   ga naar stap 4.)
2. B: tik op **Klaar**.
3. A: tik op **Klaar**.
4. Wacht ongeveer 20 seconden in het duel.
5. A: sluit de app helemaal af.
6. B: sluit de app helemaal af.
7. A: open de app weer. B blijft dicht.
8. A: tik op **Oké** bij "Live duel onderbroken".
9. A: tik onderaan op **Vrienden**.
10. A: tik op de kaart van B.
11. A: tik op **Live duel**. (Doe stap 7 tot en met 11 vlot, binnen ongeveer een minuut. Daarna staat B niet meer als online, en dan kan
    de knop grijs zijn.)
12. Verwacht op A: de kaart **"Jullie vorige live duel wordt nog afgesloten"** met "Dat lukt zodra (naam) de game weer opent, of anders
    binnen een paar minuten. Probeer het daarna opnieuw." Niet: "(naam) is al bezig".
13. A: tik op **Oké**.
14. B: open de app weer.
15. B: tik op **Oké** bij "Live duel onderbroken".
16. Verwacht op B: de uitslag van het onderbroken duel.
17. B: tik op **Oké** bij de uitslag.
18. A: tik **meteen** opnieuw op **Live duel** bij B.
19. Verwacht op A: de uitslag van het onderbroken duel, bijvoorbeeld "Gewonnen!", "Verloren" of "Gelijkspel". Er gaat dan nog geen
    uitnodiging weg. (Kreeg A de uitslag al vóór de tik, dan gaat de uitnodiging meteen weg: ga dan naar stap 22.)
20. A: tik op **Nog een keer** op die uitslag.
21. Verwacht: de uitnodiging gaat weg, en B krijgt "(jouw naam) wil nog een keer!".
22. B: tik op **Speel**. Jullie staan nu samen in de lobby: ga meteen verder met test 18.

**Test 17: ok / niet ok**

## Test 18. Live duel: alleen de app van A afsluiten (ongeveer 5 minuten, twee telefoons)

1. Jullie staan nog samen in de lobby van test 17. (Doe je test 18 apart: start een live duel zoals in test 15, stap 1 tot en met 7, en
   ga naar stap 4.)
2. B: tik op **Klaar**.
3. A: tik op **Klaar**.
4. Wacht ongeveer 20 seconden in het duel.
5. A: sluit de app helemaal af. B speelt het duel gewoon verder.
6. A: open de app weer.
7. A: tik op **Oké** bij "Live duel onderbroken".
8. A: tik onderaan op **Vrienden**.
9. A: tik op de kaart van B.
10. A: tik op **Live duel**, terwijl B nog speelt.
11. Verwacht op A: de kaart **"Jullie vorige live duel loopt nog"** met "(naam) speelt jullie vorige duel nog uit. Probeer het daarna
    opnieuw." Niet: "zodra (naam) de game weer opent".
12. A: tik op **Oké**.
13. B: speel het duel uit. Een duel duurt 90 seconden.
14. Verwacht op A: de uitslag van het duel, uiterlijk ongeveer 10 seconden nadat B klaar is.
15. A: tik op **Oké** bij de uitslag.
16. A: tik opnieuw op **Live duel** bij B.
17. Verwacht: de uitnodiging gaat meteen weg ("Uitnodiging verstuurd").
18. A: tik op **Sluiten** in het vak "Uitnodiging verstuurd".
19. B: tik op **Niet nu**. De uitnodiging blijft openstaan: ga meteen verder met test 19.

**Test 18: ok / niet ok**

## Test 19. Live duel: wachten op antwoord, ook in het Engels (ongeveer 3 minuten)

1. A: kijk onder **Vrienden** naar de kaart van B. Is ze dicht, tik er dan één keer op. (Doe je test 19 apart: tik eerst op **Live
   duel** bij B en dan op **Sluiten**.)
2. Verwacht: de knop **Live duel** is grijs. Meteen eronder staat "Je wacht op antwoord van (naam)." en een knop **Annuleer**.
3. A: tik onderaan op **Spelen** en dan op het **tandwiel**.
4. A: tik op **Taal: Nederlands** en dan op **English**. Sluit het venster met de terugknop.
5. A: tik onderaan op **Friends** en dan op de kaart van B (ze is nu dicht).
6. Verwacht: **Live duel** is grijs, en eronder staat "Waiting for an answer from (naam)." en een knop **Cancel**.
7. A: tik op **Cancel**.
8. Verwacht: de knop **Live duel** is weer oranjerood. Tik er nu niet op: vlak na een uitnodiging zegt de game 2 minuten lang "One
   moment" ("Even wachten") als je dezelfde vriend opnieuw uitnodigt. Dat hoort zo.
9. A: zet de taal terug: **Play** > **tandwiel** > **Language: English** > **Nederlands**.
10. Ter info: in het Engels heet de kaart van test 18 "Your previous live duel together is still going", met "(naam) is still playing
    your previous duel. Then try again."

**Test 19: ok / niet ok**

## Test 20. Wat vind je ervan?

Schrijf er gerust een paar woorden over, het hoeft niet lang:
- Vind je Duels makkelijk terug onder **Spelen**? Mist iemand ze onder Vrienden?
- De bonusrun: is "Nog een bonusrun · 1 ticket" duidelijk? En **Ander fruit** op dat eindscherm? Moet de regel bovenaan
  ("Level 123 · ...") in de bonusrun anders?
- Live duel: hadden jullie nu elke keer live beeld, ook na snel "Nog een keer"? Zag je "Live beeld verbinden…" of "Geen live beeld",
  en hoe lang duurde het?
- De Weekkeuring: voelt het haalbaar (Lekker na 3 dagen, Verrukkelijk na 7)? Is de stempel van Chef Ada leuk? Merk je de extra schil
  en de langere bonussen?
- Proeven: is het duidelijk? Moet een vriend zonder Eetzaal ook pluimen krijgen?
- Meldingen: komen ze op een goed moment? Zijn het er te veel of te weinig? Is de pop-up "speelt nu" leuk of storend?

Stuur na elke test **"test N ok"**, of beschrijf wat je ziet.
