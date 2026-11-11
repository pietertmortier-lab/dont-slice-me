# Don't Slice Me! (prototype)

A reverse Fruit Ninja for phones: you *are* the fruit and a kitchen knife keeps slashing across the cutting
board. Survive, collect sugar cubes, climb the levels, unlock 24 fruits.

**Play it in any browser (phone recommended):** https://pietertmortier-lab.github.io/dont-slice-me/

This repository only hosts the playable page. It is a single HTML file with no server, no tracking and no
real purchases: everything that looks like a purchase is a simulation for playtesting. Progress is kept in
your own browser.

The game is developed in the `prototypes/dont-slice-me/` folder of a private repository; this copy is updated
from there by hand, so the version label in the menu tells you which build you are playing.

## Voor testers

- Open de link op je telefoon en zet hem eventueel op je beginscherm.
- Raak het scherm aan: het fruit hangt boven je vinger. Ontwijk de rode lijnen, verzamel suikerklontjes.
- Alles wat op een aankoop lijkt, is een simulatie. Er wordt niets aangerekend en niets bewaard buiten je
  eigen browser.
- Feedback: hoe lang overleef je, op welk level wordt het te snel, welk fruit is het leukst, en zou je de
  snijfoto delen?

## Nieuw in v0.8 (22 oktober, avond)

- Compacter beginmenu: Spelen staat meteen in beeld. Het fruit kies je op een eigen scherm (de rij "Je speelt als" of de knop Fruit onderaan). Een uitroepteken betekent dat je een nieuw fruit kunt ontgrendelen.
- Balk onderaan met Home, Fruit, Vandaag, Rad, Spellen, Stempels en Winkel; een rood uitroepteken zegt dat daar iets voor je klaarstaat.
- Tussenspel: om de vier levels (5, 9, 13, ...) een minigame van 15 seconden (met aftelling vooraf; alles pak je door erover te zweven): Suikerstorm, Spiegelkeuken en Net-niet-sprint. Je kunt er niet in doodgaan; de score wordt sap (maximaal 40, plus 10 bonus bij het doel).
- Mes van de dag laat dubbel zoveel klontjes vallen. Het rad toont zijn prijzen als symbolen. Draaien kopen staat uit (kansspelwet). Elk onderdeel legt zichzelf uit voor je erop tikt.

## Nieuw in v0.9 (22 oktober, nacht)

- Beginmenu als overzicht: Spelen bovenaan, daaronder je fruit en acht tegels (Vandaag, Rad, Spellen, Stempels, Album, Fruitpas, Winkel, Hulp). Een uitroepteken betekent: er staat iets klaar, je hebt het nog niet ontdekt, of er is iets nieuws sinds je laatste bezoek.
- Hulp-scherm met alle uitleg: besturing, keukenbonussen per level, bonusvoorwerpen, tussenspel, hartjes en spelvormen.
- Zweef je onderaan het scherm, dan komt het fruit onder je vinger in plaats van erboven, zodat je ook daar klontjes en bonussen kunt pakken.
- Bonusvoorwerpen worden per level groter, feller, trager drijvend en sterker (op level 81 duren ze dubbel zo lang; vanaf level 41 vaak twee per level).
- Drie nieuwe fruitsoorten (Pruim, Mandarijn, Granaatappel) en een eigen truc voor elk bestaand fruit. Lees de uitleg op het Fruit-scherm.

## Nieuw in v0.10 (23 oktober)

- Nieuwe spelers: bij de eerste start een uitleg in drie plaatjes, en de eerste twee potjes worden begeleid (het mes wacht tot je beweegt, de eerste rode lijn gaat in slow motion, het eerste klontje wordt aangewezen). Het tempo is dan ook rustiger.
- Mooier menu: je fruit als held naast het logo, warmere knoppen en panelen, iconen bij de onderdelen, "Koop!" op fruit dat je kunt betalen.
- Winkel: Dagdeal (elke dag één fruit voor de helft), Keukensleutel (je volgende keukenbonus nu al), Startboost (begin een poging met een bonusvoorwerp), Sapverdubbelaar (een uur dubbel sap), Fruitmanden (een hele familie in één keer), Spelletjesmunten. Alles blijft simulatie en is ook met sap te verdienen.
- Los spelletje: op Vandaag speel je met een munt een tussenspel buiten een poging. Twee nieuwe tussenspelletjes: Kersen plukken en Goudkoorts.
- Fruitkaart: de laatste één of twee stempels van een rij zijn te koop (simulatie).

## Nieuw in v0.11

- Don't Slice Me! Plus als simulatie: 7 dagen gratis proberen, daarna maand of jaar. Geen reclame, hartjes groeien dubbel zo snel en één extra, Fruitpas premium elk seizoen, elke dag 2 munten en een Startboost, Dagdeal voor een derde, elke maand een fruit gratis te spelen, gouden koksmuts en de bordskin Plus-marmer. Opzeggen kan altijd; je houdt het hoedje en de skin.

## Nieuw in v0.11.1 en v0.11.2

- Installeerbaar als app: zet de link op je beginscherm (iPhone: Delen, Zet op beginscherm · Android: menu, App installeren). Eigen icoon, volledig scherm, speelt ook offline.
- Tips op het eindscherm voor je eerste potjes; zwevende tekstjes stapelen in plaats van over elkaar te vallen; het fruit van de maand (Plus) heeft een knop "Houden" om het definitief te kopen.

## Nieuw in v0.12

- Muziek: een rustig deuntje in de menu's, wat levendiger tijdens het spelen, met een eigen schakelaar onderaan het menu. Nieuwe geluidjes: aftelling bij het tussenspel, alarm bij de vork, fanfare bij Plus, fruitmanden en een volle rij.

## Nieuw in v0.32.7: klaar voor de interne test op Google Play

- **Kopen gaat in de app via Google Play.** De knop "Koop de Fruitpas · € 4,99" op het Fruitpas-tabblad loopt nu ook via
  Google Play (product `pass`), net als in de winkel: de pas komt pas na de betaling. De knop "Laatste stempel · € 0,49"
  is weg, want daar bestaat (nog) geen Google Play-product voor. Op de website verandert er niets.
- **Eén tik, één aankoop.** Staat het venster van Google Play nog open, dan doet een tweede tik op dezelfde koopknop (in de
  winkel of op het Fruitpas-tabblad) niets: er start geen tweede aankoop.
- **Geen "simulatie" meer in de app.** De winkel zegt in de app "Aankopen met geld lopen via Google Play", Plus zegt dat
  je opzegt in Google Play, en onder de instellingen staat "Versie v0.32.7". Op de website blijven de oude teksten.
- **Privacybeleid in het spel.** Achter het tandwiel staat bij Instellingen de link **Privacybeleid**, en bij Hulp een
  onderwerp **Privacy**. De link opent in je browser (in het Engels het Engelse deel).
- **Privacy en advertenties.** In de app staat bij Instellingen een knop **Privacy en advertenties** zodra Google je om
  toestemming voor advertenties vroeg: daar wijzig je je keuze of trek je je toestemming in (het venster van Google). Lukt
  dat venster even niet (bijvoorbeeld zonder internet), dan zegt het spel dat, met het mailadres. Het privacybeleid zegt
  dat nu ook. De twee privacylinks zien eruit als de knoppen ernaast.
- **Reclamevrij en Plus: echt geen filmpjes.** Wie Reclamevrij of Plus heeft, krijgt elke beloning meteen, ook die van
  een beloningsvideo (extra hartje, rad, Verder, ...). De knoppen zeggen dan ook "Zonder filmpje" in plaats van "Filmpje".
- **Deellinks wijzen altijd naar de website.** Ook vanuit de app gaat een gedeelde uitdaging of het Mes van de dag naar
  https://pietertmortier-lab.github.io/dont-slice-me/.
- **Engels met Engelse getallen.** In het Engels staat er nu 25.4 s en 12,840 (in het Nederlands blijft het 25,4 s en
  12.840), en de medailles heten DIAMOND, GOLD, SILVER en BRONZE. Ook een paar oude Nederlandse woorden zijn nu vertaald
  (Purchases, Tier 1, Claimed, Only incomplete rows, en de toestellen in de keukentekening).
- **Mooiere namen in een duel.** De naam van je vriend (of van een schim) boven het fruit heeft geen puntjes meer aan
  letters als de M.

## Nieuw in v0.32.6: grotere icoontjes in de menu's

- **Alles in de menu's is groter, het fruit het meest.** Zo zie je de stoned gezichtjes echt. Het fruit vult ook meer van
  zijn vakje (een kwart groter). Een paar voorbeelden op een gewone telefoon: de fruitkaartjes bij Verzamel > Fruit van 44
  naar 76 pixels (3 per rij), het grote fruit bij een fruit van 76 naar 128, "Je speelt als" van 40 naar 64, het fruit in
  een beloning van 64 naar 112 (bij 2 tot 4 beloningen 92, bij meer 80), een fruit in het prijsvoorbeeld van 160 naar 224,
  het fruit bij een vriend van 36 naar 56. Ook de knoppen onderaan, de hartjes, de stickers in het album, de prijsvakjes,
  de stempels en het tandwiel zijn groter.
- **Ook in de lobby van het live duel.** Het fruit van jou en je vriend is 56 pixels (was 36), de 20 fruitjes om uit te
  kiezen 48 (was 36). Op een kleine of lage telefoon wat kleiner, zodat de knoppen onderaan zichtbaar blijven.
- **Op een kleine telefoon** past alles nog: waar het niet past (een beloning met veel prijzen, het prijsvoorbeeld) kiest
  de game zelf de grootste maat die past.
- **Het spel zelf blijft precies hetzelfde.** Je fruit, de messen, het bord, de knopjes tijdens een ronde en het
  doorzichtige fruit van je vriend in een live duel: geen pixel veranderd, en je fruit is even groot als altijd.

## Nieuw in v0.32.5: live vriendenduel

- **Speel tegelijk met een vriend.** Bij Vrienden > Vrienden zie je een groen bolletje als je vriend nu online is. Tik op
  zijn kaartje op **Live duel**. Je vriend krijgt meteen een kaartje in de game: **Speel**, **Niet nu** of **Nee, bedankt**.
  Is zijn game dicht en zette hij meldingen aan, dan krijgt hij een melding. Een uitnodiging blijft 10 minuten staan.
- **De lobby.** Tikt je vriend Speel, dan zit hij in de lobby. Jouw game opent de lobby vanzelf: tik op **Ik ben er** (of
  ergens op het scherm). Is je game dicht en staan je meldingen aan, dan krijg je de melding "Lotte zit in de lobby!".
  Speel je net een ronde, dan zie je bovenaan "Lotte wacht in de lobby · nog 1:42", en in de pauze staat de knop **Naar de
  lobby**. Wie er na 2 minuten niet is, valt af en de lobby sluit.
- **De start.** Zitten jullie er allebei, dan telt de lobby 15 seconden af (tijd om een fruit te kiezen: elk van de 20
  gewone fruitsoorten mag, ook een die je nog niet hebt), of de host tikt **Start nu**. Na 3-2-1 spelen jullie tegelijk
  dezelfde ronde: 90 seconden, level 10, dezelfde messen.
- **Je ziet je vriend live.** Zijn fruit beweegt doorzichtig over jouw bord, met zijn naam en een lichtblauw randje,
  ongeveer 5 seconden later dan echt. Zijn score staat bovenaan. Wordt hij gesneden, dan zie je dat ook.
- **Pauze:** hoogstens 3 keer en samen 60 seconden; het bord is dan bedekt. Tijdens een ronde springt er nooit een kaartje
  open: het wacht tot je ronde voorbij is.
- **De server beslist** wie wint (meeste sap) en houdt jullie stand bij ("jij 3 – 1 Lotte"), ook bij de uitdaging van 24
  uur. Startte je vriend niet op tijd, dan wordt jouw ronde een uitdaging van 24 uur voor hem. Met **Nog een keer** nodig je
  hem meteen opnieuw uit.
- **Vrienden > Duels** toont "Vriendenduels gewonnen: N · daarvan tellen mee: M". Een winst telt mee als de verliezer
  minstens 30 seconden speelde, 5 sap haalde en niet stopte, jullie minstens 24 uur vrienden zijn, zijn account minstens een
  week oud is, hij level 15 haalde en de laatste twee weken op minstens 3 dagen speelde (in de eerste dagen na deze versie
  is 1 of 2 dagen genoeg). Hoogstens 3 per vriend per dag en 10 per dag in totaal; de dag begint om 7 uur. Prijzen hangen er
  nog niet aan.
- Live duels zijn onbeperkt en zonder sap. Kan je vriend niet, dan blijft **Daag uit (24 u)**.
- **Meldingen:** de game vraagt het één keer in een kaartje; aan- en uitzetten bij Instellingen ("Meldingen live duel").
  Geen uitnodigingen als melding tussen 21 en 8 uur, hoogstens 3 per uur. Op een iPhone alleen als de game op je
  beginscherm staat. In de Android-app komen meldingen later.
- **Online:** bij Instellingen kies je of vrienden zien dat je online bent.
- Na "Nee, bedankt" wacht je 30 minuten voor je dezelfde vriend opnieuw uitnodigt, na twee keer nee tot de volgende dag. Na
  twee uitnodigingen zonder antwoord aan dezelfde vriend kan de volgende pas 30 minuten later.
- De server voor het live duel staat al online. Het privacybeleid zegt wat er bewaard wordt.
- Testlijst voor twee telefoons: TESTLIJST-v0.32.5.md.

## Nieuw in v0.32.4: geen cosmetica meer

- **Alles wat alleen uiterlijk was, is weg:** de 20 hoedjes (ook het Pannetje), de 8 bordskins, alle titels, de Kast, het
  Fruitetiket, het kaartje "Zo zien vrienden je" en de beloofde albumlooks. Het snijbord volgt altijd de keuken van je level.
- **Je krijgt er iets voor terug.** Op Vandaag ligt bij "Ontvang alles" één keer een kaart **Vergoeding** klaar. Met sap
  gekocht: je sap terug. Met munten gekocht: je munten terug. Uit Plus of de Fruitpas: 2.000 sap. Verdiend met spelen: wat
  die plek nu geeft. Tik op "Vergoeding: bekijk elke regel" om elke regel te zien.
- **Eén keer per speler.** Je krijgt de vergoeding één keer: op het toestel waar je ze ophaalt. Speel je op twee toestellen, haal
  ze dan op het toestel waar je je sap wilt hebben. Het andere toestel krijgt het gereedschap en de Keukensleutel mee, niet
  het sap. Je sap verhuist naar een andere telefoon met je opslagcode, niet met de koppelcode.
- **Elke plek geeft nu iets wat je gebruikt:**
  - Dagreeks: dag 7 een startboost (Schild) en 750 sap, dag 30 vijf hartjes en 1.000 sap.
  - Elke 7 Chefstempels: 1.000 sap en 3 hartjes. Level 100: 5 hartjes.
  - Fruitkaart: hartjes bij de volle rij van level 10, 20, 25, 30, 40, 50 en 100.
  - Medailles goud en diamant: 850 en 1.750 sap.
  - Vier toernooiweken op rij: 2.000 sap en 2 Toernooimunten. In de toernooiwinkel: 3 hartjes voor 2 Toernooimunten.
- **Je keuken doet iets per stap:** de Bistro bewaart 12 uur in plaats van 8 (de Keukenwekker), het Restaurant maakt 10% meer
  sap, de Sterrenzaak 20%.
- **Het album geeft spullen:** de Opdrachtwissel (één dagopdracht per dag wisselen), Sapzeef I, 3 reeksschilden, Scherper
  zicht I, een Keukensleutel en Grotere mand I. Heb je het al, dan krijg je sap. Een vol album geeft een **Hoedbon**: bewaar
  hem, of ruil hem in voor 6.000 sap (Winkel > Spullen).
- **Fruitpas, trede 30:** gereedschap. Heb je het al, of heb je de pas alleen via Plus, dan krijg je 5 hartjes en 1.000 sap.
- **Instellingen > Muziek:** kies zelf welke muziek je hoort tijdens het spelen.
- De Keukensleutel en de startboosts zijn niet meer voor geld te koop. Met sap kan het nog altijd.
- Hartjes die niet passen, krijg je als sap: 300 sap per hartje.

## Nieuw in v0.32.2

- Bij de instellingen staat nu de echte versie (er stond altijd "v0.30").
- "Ontvang alles" neemt ook stickers mee die je tijdens het ophalen verdient.
- De server bewaart per dag een kopie van je voortgang, 7 dagen lang, zodat een kapotte opslag terug te zetten is.

## Nieuw in v0.32.1: een album dat je kunt aantikken

- Het **Album** (Verzamel > Album) heeft 30 stickers in 6 sets van 5. Tik op een sticker en je ziet wat hij vraagt, hoe ver
  je staat en wat hij geeft. Elke sticker geeft sap, elke volle set een prijs, een titel en sap. Samen 16.700 sap.
- Stickers die je al had, liggen één keer klaar om te ontvangen. "Ontvang alles" neemt ze ook mee.
- **Zo zien vrienden je:** je eigen kaartje met je fruit, je titel en tot 3 stickers. Later zien je vrienden het ook.
- **Fruitetiket:** plak een sticker als etiket op je fruit. Het vliegt mee weg als je gesneden wordt.
- De andere setprijzen (zoals de Dropveterbalk en de Levende sticker) komen in de volgende versie; wie ze ontvangt, houdt ze.
- De rode Spelen-knop opent altijd Levels. Nieuwe spelers zien pas gele bolletjes na hun eerste poging.

## Nieuw in v0.32.0: vijf tabbladen met subtabbladen

- Onderaan staan nu 5 tabbladen: **Verzamel**, **Vandaag**, **Spelen** (de rode knop in het midden), **Vrienden** en
  **Winkel**. Bovenaan elk tabblad staat een rij subtabbladen, bijvoorbeeld Vandaag · Keuken · Rad · Fruitpas.
- Het startscherm heet nu Spelen > Levels. De tegels zijn weg; in hun plaats staat "Nu te doen" met hoogstens 3 dingen die
  echt wachten. Geluid, muziek, taal, de hulp en het koppelen van een toestel zitten achter het tandwiel rechtsboven.
- De duels zitten bij Vrienden. In de nieuwe **Kast** (bij Verzamel) draag je je hoedjes, borden en titels.
- Een rood getal betekent: er ligt iets klaar om te ontvangen. Een geel bolletje: er is iets nieuw of te doen vandaag.

## Nieuw in v0.31.12: grenzen op kopen met sap, uitleg bij de hoedjes, Stempels en onbeperkte hartjes

- **Hartjes voor sap:** hoogstens 5 per dag, voor 300 · 300 · 300 · 400 · 500 sap. Het schema staat vooraf op het
  scherm. Daarna: wachten, een filmpje of een pakket.
- **Dagdeal:** één per dag. **Tickets:** hoogstens 2 per dag voor sap, en tickets vervallen niet meer.
  **Reeksschild:** met sap tot je er 2 hebt. **Keukensleutel:** 3.000 sap.
- De verdubbelaar en het gereedschap werken alleen nog in je eigen pogingen, niet in duels of toernooien.
- **Hoedjes:** bij elk hoedje staat wat het is en hoe je het krijgt. De tekst loopt niet meer over de naam.
- **Stempels:** het "!" verdwijnt als je de kaart bekeken hebt en komt pas terug bij een volle rij van 20/20. Na een
  poging vanaf de Fruitkaart stelt het spel voor: "Level N met <volgend fruit>".
- **Onbeperkte hartjes:** eenmaal per dag 10 minuten na een filmpje, zonder voorraad. Minuten die je won, zijn hartjes
  geworden.

## Nieuw in v0.31.11: Ontvang alles, prijsvoorbeelden, 5 duels per uur en Vrienden

- **Ontvang alles:** bovenaan Vandaag haal je met één knop alles op wat klaarligt (dagreeks, opdrachten, keuken,
  Fruitpas, toernooi). Je ziet vooraf wat je krijgt. Fruitpas en Keuken hebben hun eigen knop.
- **Prijsvoorbeelden:** tik op een prijs en je ziet wat het is: een hoedje op je eigen fruit, een bord met je fruit
  erop, een fruit met wat het kan. Overal staat hoeveel, wanneer en waar je het krijgt.
- **Duel van de dag** springt niet meer terug naar het begin.
- **5 duels per uur**, tegen vrienden of andere spelers samen. Er staat hoeveel je er nog hebt en wanneer er nieuwe
  komen. Elk duel heeft nieuwe messen.
- **Vrienden:** een eigen tabblad. Zoek iemand op naam en vraag of jullie vrienden worden, of deel je
  uitnodigingslink of code. Daag een vriend uit: de verliezer draagt een dag het Pannetje.
- Zoeken op naam en vriendschapsverzoeken werken pas als de server opnieuw is uitgerold (zie de stappen hieronder).

## Nieuw in v0.31.10: elk gevaar legt zichzelf uit

- Bij elk keukengevaar staat nu in drie korte regels wat het is, wat je moet doen en wat er gebeurt als je te dichtbij
  komt. Bijvoorbeeld bij de blender: "Blender gestart! Blijf weg: hoe dichter je komt, hoe harder hij je naar de messen
  zuigt!" In het Engels ook.
- De tekst staat in het gevaar tijdens de waarschuwing, en daarna net eronder, zodat je het gevaar zelf blijft zien. Hij
  komt nooit onder je duim en schuift weg van je fruit.
- Bij de schuivende plank staat nu "Duw terug" (er stond "Beweeg mee", en dat werkt net niet).

## Nieuw in v0.31.9: een dure Sapverdubbelaar en hoogstens 2 startboosts met sap

- De **Sapverdubbelaar** kost 30.000 sap per uur. De uren tellen op, tot hoogstens 5 uur. In de Dagdeal kost hij 15.000
  sap, één keer per dag. Wie al meer dan 5 uur had, houdt die.
- **Schild, stroop en magneet** koop je met sap tot je er 2 hebt. Wat je via Plus, een beloning of een pakje krijgt,
  telt daar niet voor mee.
- Een knop die niet kan, wordt grijs en zegt waarom: "max 5 uur", "max 2", "Gekocht", of hoeveel sap je nog tekort hebt.

## Nieuw in v0.31.8: de Lampionvrucht en de Mispel

- **Lampionvrucht** (vanaf level 185, 55.000 sap): een tussenspel dat eraan komt, kun je bewaren als lampion (2, op
  fruitniveau 5 zelfs 3). Met de lampionknop naast de pauzeknop, een tweede vinger of de L-toets laat je er een opgaan
  wanneer jij wilt: alle messen verfrommelen en het tussenspel begint. Er komen geen extra tussenspellen en geen extra sap bij.
- **Mispel** (vanaf level 205, 65.000 sap): een zandloper spoelt één snee terug. De messen gaan terug naar hun
  waarschuwing en het gevaar valt even stil. Na 40 seconden (30 op fruitniveau 5) is de zandloper weer vol; elke
  "Net niet!" maakt het sneller.

## Nieuw in v0.31.7: het Level Complete-deuntje

- Elke keer dat je een level uitspeelt, hoor je het Level Complete-deuntje. De keukenmuziek pauzeert even en speelt daarna
  verder waar ze was.
- Ging het level snel (korter dan 45 seconden, zoals in het begin), dan speelt alleen het begin: 5 seconden.
- Met "Geluid: uit" hoor je het niet.

## Nieuw in v0.31.6: de Fruitkaart scrolt helemaal tot level 1

- De Fruitkaart toont nu alle rijen, van je hoogste level tot level 1. Je scrolt gewoon naar beneden en kunt bij elk
  level op "Speel" tikken. De regel "... en nog N rijen lager." is weg.

## Nieuw in v0.31.5: een hartje per uur, geen meldingen over de aartsvijand, en hoogstens 2 filmpjes per level per dag

- Een hartje komt nu elk uur terug in plaats van elke 20 minuten. Met Snelle hartjes is dat om de 45, dan om de 36 minuten.
- Geen meldingen meer over je aartsvijand, ook niet op het eindscherm. Zijn messen blijven wel paars.
- "Verder vanaf level X · filmpje" en het filmpje voor een extra hartje kun je samen hoogstens 2 keer per level per dag
  gebruiken. Op de knop staat hoeveel je er vandaag nog hebt; zijn ze op, dan zegt de knop dat.

## Nieuw in v0.31.4: de Taaie schil stopt bij 2 schillen

- De keukenbonus Taaie schil (vanaf level 41) geeft nog altijd elke overleefde minuut een schil, maar alleen zolang je er
  minder dan 2 hebt. Zo stapel je in lange pogingen geen onkwetsbaarheid meer op. Schillen van je fruit (Kokosnoot, Lychee,
  Ananas) en van de Dikke schil blijven zoals ze waren.

## Nieuw in v0.31.3: de eerste late fruitsoorten, de Mirakelbes en de Bosbes

- **Mirakelbes** (vanaf level 145, 36.000 sap): elk keukengevaar wordt zoet en onschadelijk ("Karamelpan!"), en laat 2
  gouden klontjes voor je spaarpot achter. Messen blijven gevaarlijk, maar blijven even plakken in karamel en ijs.
- **Bosbes** (vanaf level 165, 45.000 sap): elk mes toont zich eerst 0,22 s als blauwe stippellijn, vóór de gewone rode
  waarschuwing. Bij twee of drie messen tegelijk zie je 1-2-3 in de volgorde waarin ze slaan.
- Ze zijn alleen voor sap te koop, en hun truc werkt alleen in een gewone poging, niet in duels, het toernooi of de Chef.
- Het fruit van de week en de dagpremie kiezen nu alleen fruit dat je hebt of mag kopen. De deegrol toont nu zijn lichte
  hout (een oude tekenfout maakte hem donker).

## Nieuw in v0.31.2: mildere messen vanaf level 80, en elk keukengevaar doet echt iets

- **Mildere messen.** Levels 1 tot 79 blijven gelijk. Vanaf level 80 krijg je meer waarschuwing en meer tijd tussen de
  messen, en komen twee en drie messen tegelijk later in elke stap. Level 100 speelt nu ongeveer zoals vroeger level 90,
  level 150 zoals vroeger 110 en level 200 zoals vroeger 135. Het blijft wel elk level iets moeilijker.
- **De rasp werkt nu.** Hij kwam vroeger meestal ergens anders terecht dan bij je fruit. Nu verschijnt hij op jouw hoogte:
  stap eruit tijdens de waarschuwing, of je bent 6 seconden traag ("Rasp: je bent traag!").
- **De vork en de deegrol** waarschuwen langer met de keukenbonus Rustige plank (vanaf level 61) en met de Vorkvrucht,
  zoals beloofd.
- **De schuivende plank** neemt je fruit nu ook mee als je met je vinger speelt, een klein stukje.
- **De kurk als aartsvijand:** hem ontwijken telt nu mee voor je wraak.

## Nieuw in v0.31.1: hoogstens 3 minuten per level op level 200, en geen FLOW-balkje meer

- Elk level duurt nog altijd wat langer dan het vorige, maar trager oplopend: ongeveer 25 seconden op level 9, 50 seconden
  op level 50, 1½ minuut op level 100, 2¼ minuut op level 150 en 3 minuten op level 200. Daarna komt er per level ongeveer
  een halve seconde bij.
- Het FLOW-balkje rechtsboven is weg. Fruit Fever blijft: vier keer "Net niet!" kort na elkaar en het begint. Alleen
  tijdens Fever zie je rechtsboven hoe lang het nog duurt.

## Nieuw in v0.31.0: levels worden trager en trager, en onbeperkt spelen is beperkt

- **Tragere levels.** Levels 1 tot 8 blijven gelijk. Vanaf level 9 duurt elk level wat langer dan het vorige: ongeveer 35
  seconden op level 10, 2½ minuut op level 50, 5 minuten op level 100 en 11 minuten op level 200. Level 200 kost nu zo'n
  18 à 20 uur spelen in plaats van 75 minuten.
- **Stappen.** Een lang level bestaat uit stappen ter grootte van een oud level. Elke stap geeft wat vroeger een nieuw level
  gaf: even rustige messen, een kans op een bonus, +5 sap, en om de 8 stappen een tussenspel.
- **Je balk blijft bewaard** tussen pogingen, dus elke poging brengt je verder.
- **Dubbel sap gaat naar je spaarpot.** Woensdag, de eerste poging van de dag en de verdubbelaar vullen je spaarpot, niet
  de levelbalk.
- **Onbeperkte hartjes:** 10 minuten, één keer per dag, na een filmpje. "Onbeperkt 24 uur" en het pakket van 30 minuten
  zijn weg.
- Testlijst: TESTLIJST-v0.31.0.md. Noteer vooral hoe lang je overleeft op level 100, 130 en 150.

## Nieuw in v0.30.9: dagopdrachten met tussenspelletjes tellen weer

- In v0.30.8 telden de dagopdrachten "Speel 1 tussenspel" en "Haal het doel van een tussenspel" niet mee. Dat is hersteld.

## Nieuw in v0.30.8: herstellingen na een grondige controle van de tussenspelletjes

- Stop je een munt-spelletje halverwege, dan heeft je volgende gewone poging niet langer een te laag plafond en eindigt ze
  niet meer plots op het Vandaag-scherm.
- Haal je het doel, dan zegt het spel ook "doel gehaald!" als je al tegen het plafond aan zit.
- Een munt-spelletje rekent met je echte level, niet met een lager startlevel. Het gebruikt ook de dubbele sap van je eerste
  poging van de dag niet meer op. Ook op het plafond van 600 telt elk punt.
- In een tussenspel bouw je geen combo meer op die daarna ongemerkt meetelt.
- Tussenspel-sap telt niet meer mee voor de fruitbonus, Plus en het filmpje "nog eens erbij" op het eindscherm. Zo blijft het
  echt onder het plafond. Je ziet het apart staan: "tussenspel +X sap".

## Nieuw in v0.30.7: tussenspelletjes groeien trager, met een plafond van 3000 sap op level 200

- **Waarom.** Op level 113 leverde een tussenspel meer dan 3000 sap op. De vermenigvuldigers stapelden: je fruit, je
  ervaring met dat fruit, de keukenmeester, woensdag en de sapverdubbelaar, samen tot ×14,5 op level 113.
- **Nu.** Elk level heeft een plafond dat meegroeit: 191 sap op level 9, 1721 op level 113 en 3000 vanaf level 200. Een los
  spelletje met een munt levert hoogstens 600 sap op. Hoe dichter je bij het plafond komt, hoe minder een extra punt nog
  oplevert, maar elk punt telt en het plafond zelf haal je nooit.
- **Voorbeelden** (Suikerstorm, sterk spelletje / perfect spelletje): level 9 zonder extra's 36 / 54; level 113 zonder
  extra's 219 / 333, met alles op woensdag rond 1080 / 1360; level 200 met alles samen hoogstens zo'n 2980.
- Testen: speel een tussenspel rond level 113 (op woensdag of met de verdubbelaar) en kijk of de beloning nu ver onder 3000
  blijft.

## Nieuw in v0.30.6: tussenspelletjes groeien mee met je level, en het kaarslicht flikkert niet meer

- **Tussenspelletjes groeien mee.** Een tussenspel telt nu in punten: een klontje is 1, een goudklontje 5, een "net niet" in
  de sprint 3. Elk punt is sap waard in verhouding tot je level. Een sterk spelletje levert overal ongeveer twee keer het sap
  van je level op (level 9: zo'n 50 sap, level 100: zo'n 420, level 150: zo'n 620). Er is geen maximum meer, dus elk extra
  klontje telt. Combo's en koortsrondes tellen in een tussenspel niet mee. Je fruit, de keukenmeester, een dubbele dag en de
  sapverdubbelaar tellen er wel bovenop. Het intro toont vooraf wat het doel waard is, en tijdens het spel zie je "Nu: +X sap".
- **Losse spelletjes (munten)** groeien mee tot level 150, zodat een munt nooit meer waard wordt dan een sappakket.
- **Kaarslicht (level 91 tot 120).** Het licht flikkert niet meer en de donkere rand beweegt niet meer: de warme kaarssfeer
  blijft, maar rustig.
- Testen: speel een tussenspel op een laag en op een hoog level en vergelijk de beloning. Speel rond level 91 tot 120 en kijk
  of de rand stil blijft.

## Nieuw in v0.30.5: muziek volgt het keukenblad overal, en de bananenschil werkt echt

- **Muziek.** Waar de echte muziek niet laadt (offline, de voorvertoning in Claude), speelde vroeger één klein deuntje voor
  elke keuken. Nu heeft elke keuken een eigen deuntje, met een eigen toonsoort, tempo en klank. Kan de browser een nieuw nummer
  niet meteen starten, dan blijft het vorige spelen tot je volgende tik, in plaats van stil te vallen.
- **Banaan.** Een mes dat over een gevallen schil gaat, glijdt nu echt uit: het blijft even haken, wiebelt, je ziet
  "Uitgegleden!", en daarna schuift het half zo snel verder. De beschrijving van de banaan zegt nu precies dat.
- Testen: speel met de banaan, wacht tot hij een schil laat vallen (om de 20 s) en blijf er vlakbij. Kijk op het pauzescherm welk
  muziekstuk speelt, voor en na een nieuw keukenblad.

## Nieuw in v0.30.3 en v0.30.4: seizoenen lopen door, en eerlijker spelen

- **Seizoenen lopen door.** Na Seizoen 1 (tot 30 november) volgt meteen Seizoen 2 "De Gouden Oogst" met de Gouden Perzik,
  en zo verder, telkens zes weken. Je vormen per seizoen blijven bewaard.
- **Geen betaald toeval meer.** Draaien aan het rad zijn niet meer te koop. Het filmpje op het rad geeft nu altijd 300 sap,
  en Plus verdubbelt het rad niet meer. Gekochte draaien die je nog had, blijven bewaard en worden later omgezet.
- **Duels zonder inzet.** Winnen geeft 150 sap, verliezen kost niets. Wie een vriendenduel verliest, draagt nog wel het Pannetje.
- **Oefenladder.** Het toernooi toont eerlijk dat je tegen computertegenstanders speelt en geeft geen rangprijzen meer.
- **Elke poging telt.** Verlaat je het eindscherm via de onderbalk of de terugknop, dan worden record, bonus en XP toch bijgeteld.
- **De webwinkel is een demo.** Kopen met geld kan alleen in de app; met sap kopen werkt gewoon.
- Testlijst: TESTLIJST-v0.30.3-0.30.4.md.

## Nieuw in v0.30.2: tussenspellen half zo vaak

- Het tussenspel in een poging komt nu om de acht levels (9, 17, 25, ...) in plaats van om de vier. De losse spelletjes met
  munten op het Vandaag-scherm blijven zoals ze waren.

## Nieuw in v0.30.1: statusregel in het spel

- "Overleeft nog 1 snee" liep linksboven in de levelregel bij een breed sapgetal. De tekst heet nu "Nog 1 snee vrij" en de
  levelregel schuift opzij als de statusregel ruimte nodig heeft (zoals de timer al deed).

## Nieuw in v0.30: Jouw Keuken

- Nieuwe knop **Keuken** in het menu: je eigen keuken met vier toestellen (snijplank, oven, koelkast, vitrine), elk vijf niveaus,
  te koop met sap. Ze maken sap terwijl je weg bent (5, 12 en 20 sap per uur per niveau; de vitrine geeft +10% per niveau),
  tot acht uur lang. Kom langs en tik "Haal op". Langer wegblijven kost niets, maar levert ook niets extra op.
- **Status**: Keuken, Bistro (5 niveaus), Restaurant (10), Sterrenzaak (15). Elke stap geeft een nieuwe bordskin om mee te
  spelen (Bistrotafel, Restauranttafel, Sterrenzaak), te kiezen in de Winkel.
- **Bestellingen**: elke maandag hangen drie chefs een briefje op: kleine opdrachten die je naar fruit en spelvormen sturen
  die je anders overslaat (bijvoorbeeld "drie pogingen van 40 s met de Kiwi", "win een Duel van de dag"). Beloning 400, 600 en
  800 sap; alle drie klaar: 1.000 extra.
- **Bezoek en fooi**: in je keuken zie je "Keuken van de week" met je vrienden (score: toestelniveaus × 10 plus fooien). Bezoek
  een vriend, bekijk zijn keuken en geef een fooi: jij betaalt 50 sap, hij krijgt 100. Eén fooi per vriend per dag.
- **Server:** de fooien en het keukenprofiel vragen een nieuwe deploy (zelfde commando als bij v0.29). Zonder deploy werkt
  je eigen keuken gewoon; bezoeken en fooien wachten tot de deploy.
- **Testvraag:** voelt de keuken als "iets dat op je wacht"? Zijn de prijzen van de toestellen haalbaar met wat je per dag speelt?

## Nieuw in v0.29: Duel van de dag, vriendenduels, rivalen en Seizoen 1

- **Duel van de dag** (Spellen): iedereen krijgt dezelfde messen, vanaf level 10, 90 seconden; score = sap. Je wordt gekoppeld aan een
  speler van jouw niveau die vandaag al speelde en ziet zijn fruit als schim over jouw plank bewegen, tot het moment waarop hij gesneden
  werd. Speelde nog niemand (of ben je offline), dan duelleer je met De Chef. Inzet 100 sap, de winnaar krijgt 200 (tegen De Chef 150).
  Eén duel per dag, kost geen hartje.
- **Vriendenduels**: open een vriend op het Vrienden-scherm en tik "Daag uit voor een duel". Jullie spelen allebei het duel van die dag;
  zodra beide scores binnen zijn, betaalt de verliezer 200 sap en draagt hij een dag lang het **Pannetje**, zichtbaar voor zijn vrienden.
- **Rivalen van de week**: twee spelers die net boven je staan. Haal ze in en je krijgt 300 sap; zij krijgen een berichtje. Elke maandag nieuwe.
- **Seizoen 1 · Het Laatste Gerecht**: zes weken, elke week een hoofdstuk tegen De Chef en zijn hakbijl (60 seconden overleven, met een eigen
  regel per hoofdstuk). Elk gehaald hoofdstuk geeft 500 sap en laat de Regenboogkiwi een stap evolueren (speelbaar, glinsterend, goud, gloeiend,
  ...). Alle zes gehaald: de kiwi blijft voor altijd van jou, plus de titel Seizoensheld en 2.000 sap. Hoofdstuk 1 staat open vanaf 19 oktober,
  hoofdstuk 2 vanaf 26 oktober, enzovoort.
- Pauzescherm toont nu welk muzieknummer speelt (handig om de keukenmuziek te controleren).
- **Server:** de duels, uitdagingen en rivalen draaien op de toernooiserver. Na het binnenhalen van deze versie opnieuw uitrollen vanaf de PC:
  `cd C:\Users\piete\dont-slice-me\native\tourney` en dan `firebase deploy --only functions,firestore`. Tot die deploy speel je het duel
  tegen De Chef en blijven vriendenduels en rivalen leeg.
- **Testvraag:** is 90 seconden een goede duellengte? Voelt de schim eerlijk? Is De Chef in hoofdstuk 1 haalbaar voor een beginner?

## Nieuw in v0.28: flow-meter, Fruit Fever en je aartsvijand

- **Flow-meter** rechtsboven: elke "Net niet!" vult hem een kwart, een snee maakt hem leeg. Hij blijft 4 seconden staan na een
  net-niet en loopt daarna in 40 seconden leeg: risico nemen loont dus nu, niet straks.
- **Fruit Fever**: bij een volle meter begint acht seconden koorts: de wereld vertraagt tot 60% (jij blijft even snel), elk nieuw
  klontje is goud, klontjes komen dubbel zo snel en alles telt dubbel. Gouden gloed, banner, en de muziek gaat een tandje sneller.
  Een snee maakt er meteen een einde aan.
- **Je aartsvijand**: het mes-patroon of keukengevaar dat jou het vaakst raakte, krijgt een naam (De Spieder, Het Kruis, De
  Pauwenstaart, De Vork, ...) en een paarse waarschuwingslijn in plaats van een rode. Ontwijk zijn hele patroon drie keer in één
  poging en je neemt wraak: 200 sap, de sticker *Wraak*, en de aartsvijand is de rest van die poging 35% trager. Op het eindscherm
  zie je hoe vaak je in Fever zat en hoe het tegen je aartsvijand ging.
- Twee nieuwe stickers in het album (*Koortsig* en *Wraak*) en een nieuw hoofdstuk in Hulp: "Flow en de Aartsvijand".
- **Testvraag voor jullie:** voelt Fever als een beloning of als chaos? Komt hij te vaak of te zelden? Is je aartsvijand herkenbaar?

## Nieuw in v0.27.1: uitroepteken bij Vandaag klopt weer

- Het uitroepteken bij Vandaag telde nog het ongespeelde Mes van de dag en het weekendspel mee, terwijl die sinds v0.23 onder Spellen staan. Nu betekent het alleen nog: dagreeks te innen, opdracht te ontvangen, Plus-kist klaar of een half uur hartjes in voorraad.

## Nieuw in v0.27: alle fruit kijkt stoned

- Elk fruit heeft nu een subtiele "stoned"-blik: lichte roze oogleden over de bovenste helft van de ogen (links iets lager), roze doorbloed oogwit met vier fijne adertjes en een lichte wal eronder, een blik die licht naar buiten drijft, een lichte blos, iets ongelijke wenkbrauwen en een licht scheve grijns. Geen tong (alleen de aardbei houdt de hare) en geen kwijl. De eigen kenmerken blijven: snor, zonnebril, monocle, kroon.
- Bang (als het mes nadert) en gesneden blijven zoals ze waren. Geen rook of andere drugsverwijzingen, dus de leeftijdsclassificatie verandert niet.
- De winkelbeelden en promovideo's zijn opnieuw gemaakt met de nieuwe gezichten.

## Nieuw in v0.26.1: een gehaald level staat meteen vast

- Tot nu toe werd je hoogste level pas weggeschreven als een poging afgelopen was. Wie het spel midden in een poging sloot, viel terug op het laatste afgeronde level. Nu wordt elk nieuw level in een gewone poging meteen bewaard, ook als je het spel daarna wegveegt. Mes van de dag en het testparcours tellen zoals voorheen niet mee.

## Nieuw in v0.26: je voortgang hoort bij jou

- **Nooit meer terugvallen**: elke opslag krijgt een volgnummer. Een browsertabblad dat achterloopt voegt eerst de nieuwere voortgang samen (hoogste level, record, ontgrendeld fruit, stempels) en overschrijft ze niet meer.
- **Opslag bij je profiel**: zodra je online bent, gaat je voortgang na elke wijziging ook naar de server, onder jouw spelersidentiteit. Bij het starten haalt het spel die kopie op en neemt ze over als ze verder staat.
- **Toestellen koppelen**: speel je op meerdere toestellen of in meerdere browsers (elke browser is voor het spel een andere speler), ga dan naar Hulp > Je voortgang meenemen > *Koppel een ander toestel*. Je krijgt een koppelcode van tien minuten; typ ze op het andere toestel bij *Ik heb een koppelcode*. Vanaf dan delen beide dezelfde voortgang, vrienden en toernooi. De opslagcode kopiëren blijft ook werken.

## Nieuw in v0.25: vrienden

- **Vrienden**: nieuwe knop in het menu. Je krijgt een vriendencode en een uitnodigingslink; wie het spel ermee opent is meteen je vriend en jullie krijgen allebei 300 sap (eenmalig per paar, maximaal tien beloonde uitnodigingen per speler). Een code intypen kan ook.
- Op het Vrienden-scherm spiegel je je aan je vrienden: level, record, fruit, dagreeks, pogingen, divisie, wie welk fruit al heeft dat jij nog mist, een kroontje voor de hoogste, "haal in"-hint naar de eerstvolgende boven je, en een vriendenladder voor het weekevenement.
- Het spel meldt zich nu zelf anoniem aan bij Firebase (ook in de webversie) en stuurt toernooirondes naar de server. De ladder op het scherm blijft voorlopig de simulatie; de echte uitslag van de server volgt in een latere versie.

## Nieuw in v0.24.4: contactadres van het spel

- Het contactadres in het privacybeleid en de winkelteksten is nu dont.slice.me@gmail.com. Opmerkingen in de broncode en de publieke documenten noemen geen persoonsnamen meer; alleen het privacybeleid noemt de uitgever, zoals de wet vraagt.

## Nieuw in v0.24.3: laatste Engelse teksten op het speelveld

- De banner van het tussenspel ("Tussenspel · even iets anders", "Tussenspel voorbij"), de titel van het Chefs Examen, het label "lokaas", het weekpas-icoon en de pop-ups van bonusvoorwerpen ("Goudvork!" en zo) zijn nu ook Engels in de Engelse versie. De automatische controle bekijkt voortaan de hele lijst van onvertaalde teksten.

## Nieuw in v0.24.2: klaar voor het testpubliek

- De testparcoursen van level 80 en level 100 staan niet meer in de hulptab.
- `UITROL-STAPPEN.md` is volledig herschreven: eerst de webtest met een testpubliek, dan de weg naar de Play Store, en een tabel met waar elk bestand en elke sleutel komt (promovideo's, advertentiefilmpjes, feature graphic, schermafbeeldingen, teksten, sleutels).

## Nieuw in v0.24.0: het spel heet nu Don't Slice Me!

Tot v0.23 heette het spel Fruitvlucht; de oude testlink werkt niet meer, gebruik de link bovenaan.

- De naam is in alle talen "Don't Slice Me!", ook in het Nederlands. Titel, logo, deeltekst en deelkaart, de naam van het Plus-abonnement, de winkelteksten, het privacybeleid en de Android-configuratie (pakketnaam `com.dontsliceme.app`) zijn hernoemd.
- Je opgeslagen voortgang blijft gewoon werken; ook de testlink blijft dezelfde. De promovideo's en winkelbeelden in `promo/` zijn opnieuw gemaakt met de nieuwe naam.

## Nieuw in v0.23.1: laatste Engelse restjes, nieuwe promovideo's en schermafbeeldingen

- Zes teksten die in het Engels nog Nederlands waren (voorraad onbeperkte hartjes, Plus-prijsknoppen, punten/vorken op de ladder, albumniveau, fruitmanden in de winkel) zijn vertaald; de automatische controle kijkt nu naar een veel langere lijst Nederlandse woorden en is weer schoon.
- De promovideo's (NL en EN) en alle winkelbeelden in `promo/` zijn opnieuw gemaakt met deze versie.

## Nieuw in v0.23: naam voor de ladder, Vandaag in drie delen, zachtere curve, levelgrenzen voor fruit

- Bij de eerste start kies je een naam voor de ladders (2 tot 16 tekens, ook later te wijzigen in het toernooi).
- Vandaag bevat nu dagreeks, opdrachten, Plus-kist en onbeperkte hartjes; Rad alleen het rad; Spellen het Mes van de dag, het weekendspel en het toernooi.
- De moeilijkheid loopt rustiger op tot level 200 en eindigt daar met maximaal drie messen tegelijk; vier en vijf messen zijn weg.
- Elk fruit vraagt naast sap ook een level: Druif 1 tot Drakenvrucht 60, Lychee 90, Stervrucht 110, Passievrucht 130.
- Engels opnieuw volledig nagelopen, ook in het toernooi.

## Nieuw in v0.22: het Keukentoernooi

- Elke week één evenement, vier in een maandelijkse cyclus: Sapstorm, De Lange Nacht, Chefs Estafette en Jacht op de Gouden Vork. Nieuwe tegel "Toernooi" in het menu.
- Elke dag 3 gratis tickets (+1 met Plus); extra via filmpje, 1.000 sap, pakketten of de Weekpas. Tickets kosten geen hartje.
- Divisies van 50 spelers (Houten tot Diamanten Lepel) met promotie en degradatie. De ladder is voorlopig gesimuleerd tot de server eraan hangt.
- Mijlpalen voor iedereen, weekprijzen tot 5.000 sap, Toernooimunten, de Toernooiwinkel en vier evenementsfruiten die je alleen hier kunt verdienen (Gouden Perzik, Nachtbes, Regenboogkiwi, Vorkvrucht).

## Nieuw in v0.21: fruit altijd boven je vinger, Plus met echte voordelen

- Het fruit zweeft nu altijd net boven je vinger, overal op het bord; geen sprong en geen omslag onderaan meer.
- Don't Slice Me! Plus: onbeperkte hartjes, +25% sap op elke poging, rad/dagreeks/opdrachten betalen dubbel, elke maandag een Plus-kist (1.500 sap + 1 hartje), het fruit van de maand blijft van jou na 10 levels ermee, en elk seizoen een exclusief hoedje (nu de Herfstbaret).

## Nieuw in v0.20: direct Opnieuw na een snee, volledig Engels, Plus zonder proef

- Na een snee kom je meteen op het eindscherm met Opnieuw; de tweede kans is de knop "Verder vanaf level N · filmpje" op datzelfde scherm (gratis op het testparcours). Zonder hartjes blijft het filmpje voor +1 leven op het hartjesscherm.
- De Engelse versie is nu volledig: alle schermen, de tussenspelen, Mes van de dag, de Fruitkaart, de winkel en de deelteksten; "sap" heet in het Engels "juice".
- De deelknop vermeldt straks de Play Store-link zodra die er is (nu de weblink).
- Don't Slice Me! Plus: de knop "7 dagen gratis" is weg.

## Nieuw in v0.19: ronde 4 (levels 100 tot 140) en het fruit springt over je vinger

- Het fruit glijdt niet meer door je vinger heen: het springt in één keer van boven naar onder je vinger (en terug), met een kleine marge zodat het niet flappert.
- Nieuwe lagen over de keukens: Kaarslicht (vanaf level 91) en Feestkeuken (vanaf 121).
- Nieuwe bonusvoorwerpen: Houten lepel (105), Schaduwfruit (115), Goudvork (125).
- Nieuwe gevaren: de knallende kurk (110), het lekkende vergiet (120), de handmixer (130) en de spatpan (140).
- Nieuw fruit: Stervrucht (vanaf 110) en Passievrucht (vanaf 130).
- Nieuwe keukenvoordelen: Honingvingers en Feestneus. Nieuw tussenspel: Confettiregen (vanaf 140).
- Testparcours ronde 4 in Hulp: start op level 100 en spring door naar elk nieuw onderdeel.

## Nieuw in v0.18.2: muziek volgt weer de keuken, knoppen bovenaan, grotere beloningen

- De muziek wisselt weer mee met de keuken, ook in het testparcours (de sprong 80 > 85 hield de Bamboe-track vast). Een track wordt niet meer definitief opgegeven na een onderbroken start.
- Home-knop en vlagje staan nu bovenaan naast je sap. Het vlagje toont de huidige taal; in het taalmenu houdt Nederlands de Nederlandse vlag.
- Het bord vult het scherm weer volledig, ook als de browser zijn adresbalk verbergt.
- Beloningen zijn tien keer groter: rad 100/200/300/500, opdrachten 100 en 200, dagreeks 100 tot 500, dagdoelen 250 per stuk + 500, weekendprijs +200, Fruitkaart-rijen 200 + 20 per level.
- Citroen: na de zure treffer is elk nieuw klontje 12 seconden lang goud.
- Mes van de dag: meer dan dubbel zoveel klontjes, zes op het bord, messen komen 20% sneller.

## Nieuw in v0.18: Engels en Nederlands, home-knop en vlagje

- Het spel start in het Engels, behalve op een toestel in het Nederlands of in België of Nederland: dan in het Nederlands. Met het vlagje (in het spel en onderaan het menu) wissel je altijd. De lange teksten in winkel, Vandaag en Hulp zijn in de Engelse versie nog deels Nederlands; dat groeit per versie.
- Tijdens het spelen staan linksboven een home-knop en het vlagje. Home pauzeert en vraagt eerst of je het level wilt verlaten; het vlagje pauzeert en laat je de taal kiezen.
- Nieuw in de repository: privacybeleid (privacy.html), winkelteksten (store/), jouw stappenlijst (UITROL-STAPPEN.md) en de Android-schil (native/) voor echte advertenties en aankopen.

## Nieuw in v0.17: Mes van de dag is een eigen proef

- Snelkookpan: iedereen start op level 10 en elk level is drie keer zo kort, dus het mes versnelt snel. Klontjes tellen enkel; het extra sap verdien je met de dagdoelen.
- Dagregel: elke dag één (om de drie dagen twee) regels, dezelfde voor iedereen: Blind mes, Dubbel mes, Donkere keuken, Spiegel, Stroop op de plank, Geen bonusvoorwerpen, Reuzenfruit, Krimpende plank, Jager. Je leest ze op het Vandaag-scherm voor je op Speel drukt.
- Dagdoelen: drie per dag, elk 150 sap; alle drie gehaald geeft +300 sap en een Chefstempel. Zeven Chefstempels: het hoedje Dagmes-speld.
- Het dagmes is zwart met een rode snede; de deeltekst noemt je level, tijd en dagregel.

## Nieuw in v0.16

- Delen loont: op het eindscherm staat bij de deelknop "+1 hartje". Wie de uitdaging deelt (of de tekst kopieert), krijgt elke dag één hartje.
- Nieuw op het eindscherm: "Filmpje: nog eens +X sap", het sap van die poging nog een keer na een beloningsvideo (één keer per poging).
- Reclame tussen pogingen (simulatie): hoogstens één op drie game-overs, minstens drie minuten ertussen, nooit in je eerste vijf pogingen en nooit tijdens het spelen. Plus en Reclamevrij zien ze niet.

## Nieuw in v0.15.1

- Fout opgelost: na een snee in het testparcours liep het spel vast. Nu krijg je gewoon de doorgaan-vraag (gratis op het parcours) en daarna het eindscherm; Opnieuw start het parcours weer op level 80.
- Iets makkelijker: de waarschuwing voor een mes duurt wat langer, messen komen iets minder snel na elkaar, en drie messen tegelijk beginnen pas vanaf level 50 (was 40).

## Nieuw in v0.15 (ronde 3: level 81 tot 110)

- Testparcours (via Hulp): een gratis poging die op level 80 begint en na elk uitgespeeld level (60 sap) doorspringt naar 85, 90, 95 en 100, waar het nieuwe meteen verschijnt. Telt niet voor records; sap houd je.
- Avondzon: vanaf level 81 ligt er warm avondlicht over de keukens.
- Nieuwe bonusvoorwerpen: Suikerspin (vanaf 85, een bel die drie sneden opvangt) en Honingpot (vanaf 95, alles staat 5 s stil en de klontjes drijven naar je toe).
- Nieuwe gevaren: de schuivende plank (vanaf 90, beweeg mee) en de keukenwekker (vanaf 100, bij het rinkelen vuren alle rode lijnen tegelijk).
- Lychee: nieuw fruit voor 18.000 sap, te koop vanaf level 90; haar schil groeit elke 30 s terug.
- Chefmedaille (hoedje) bij level 100, keukenbonus 12 "Rustige plank", en de Gereedschapskist in de winkel: vijf blijvende verbeteringen voor sap.

## Nieuw in v0.14.1

- De messen blijven sneller worden tot level 200 in plaats van te stoppen op 100. Vanaf level 120 kunnen er vier messen tegelijk komen, vanaf 160 vijf, met nieuwe patronen (ster, ladder met één gat, waaier van vijf).

## Nieuw in v0.14

- Sap heeft weer nut. Beter fruit kost veel meer (van 60 sap voor de druif tot 14.000 voor de drakenvrucht), hoedjes en hulpmiddelen ook. Een extra leven kost overal 3.000 sap: doorgaan na een snee, of een hartje bijkopen; 5 hartjes 12.000. Nieuw: een extra hartjesplek voor altijd (10.000, een tweede voor 25.000).
- Zonder hartjes kun je niet verder: wachten (20 minuten per hartje), een filmpje kijken of bijkopen met sap of geld. Kopen toont de pop-up en je kiest zelf wanneer je speelt.
- De blender zuigt nu echt: binnen de golven word je aangetrokken, dicht bij de messen hard; met een flinke veeg naar buiten ontsnap je aan de rand.
- Beter fruit loont: elke trede hoger op de fruitladder geeft +10% sap aan het einde van elke poging (kiwi +50%, drakenvrucht +160%) en 1,5% rustigere messen, bovenop de eigen eigenschap. Het staat op de fruitkaart en op het eindscherm.
- Nieuwe keukengevaren: pepermolen vanaf level 60 (in de wolk nies je alle kanten op), garde vanaf 70 (twee draaiende armen) en ijsblokjes vanaf 80 (glad, je glijdt door).

## Nieuw in v0.13.1

- De zeven muzieknummers staan erin en spelen per keukenblad; muziek staat nu standaard aan (uitzetten kan onderaan het menu). Het volgende nummer laadt alvast op de achtergrond, zodat een nieuwe keuken zonder stilte overvloeit.

## Nieuw in v0.13

- Beloningspop-up: alles wat je buiten een poging krijgt (rad, dagreeks, opdrachten, Fruitpas, winkel, Plus-cadeau, munt van de dag, nieuwe stickers, nieuw fruit) verschijnt groot in beeld met het icoon van wat je kreeg en de naam erbij. Tik om verder te gaan; meerdere beloningen komen na elkaar.
- Muziek: echte nummers per keukenblad komen in de map `music/` (menu.mp3 en keuken-1-houten-plank.mp3 tot keuken-6-nachtkeuken.mp3); het spel vloeit ze over bij een nieuwe keuken. Zonder bestanden speelt een klein ingebouwd deuntje. De Suno-prompts staan in `music/MUZIEK-suno-prompts.md`.
- Een lager startlevel (levelkiezer of "Speel" op de Fruitkaart) geldt nog voor één poging. Daarna ga je weer verder vanaf je hoogste level, ook als je een ander fruit kiest.
