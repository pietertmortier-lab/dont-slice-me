# Fruitvlucht (prototype)

A reverse Fruit Ninja for phones: you *are* the fruit and a kitchen knife keeps slashing across the cutting
board. Survive, collect sugar cubes, climb the levels, unlock fourteen fruits.

**Play it in any browser (phone recommended):** https://pietertmortier-lab.github.io/fruitvlucht/

This repository only hosts the playable page. It is a single HTML file with no server, no tracking and no
real purchases: everything that looks like a purchase is a simulation for playtesting. Progress is kept in
your own browser.

The game is developed in the `prototypes/fruitvlucht/` folder of a private repository; this copy is updated
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

- Fruitvlucht Plus als simulatie: 7 dagen gratis proberen, daarna maand of jaar. Geen reclame, hartjes groeien dubbel zo snel en één extra, Fruitpas premium elk seizoen, elke dag 2 munten en een Startboost, Dagdeal voor een derde, elke maand een fruit gratis te spelen, gouden koksmuts en de bordskin Plus-marmer. Opzeggen kan altijd; je houdt het hoedje en de skin.

## Nieuw in v0.11.1 en v0.11.2

- Installeerbaar als app: zet de link op je beginscherm (iPhone: Delen, Zet op beginscherm · Android: menu, App installeren). Eigen icoon, volledig scherm, speelt ook offline.
- Tips op het eindscherm voor je eerste potjes; zwevende tekstjes stapelen in plaats van over elkaar te vallen; het fruit van de maand (Plus) heeft een knop "Houden" om het definitief te kopen.

## Nieuw in v0.12

- Muziek: een rustig deuntje in de menu's, wat levendiger tijdens het spelen, met een eigen schakelaar onderaan het menu. Nieuwe geluidjes: aftelling bij het tussenspel, alarm bij de vork, fanfare bij Plus, fruitmanden en een volle rij.

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

- De zeven muzieknummers van Pieter staan erin en spelen per keukenblad; muziek staat nu standaard aan (uitzetten kan onderaan het menu). Het volgende nummer laadt alvast op de achtergrond, zodat een nieuwe keuken zonder stilte overvloeit.

## Nieuw in v0.13

- Beloningspop-up: alles wat je buiten een poging krijgt (rad, dagreeks, opdrachten, Fruitpas, winkel, Plus-cadeau, munt van de dag, nieuwe stickers, nieuw fruit) verschijnt groot in beeld met het icoon van wat je kreeg en de naam erbij. Tik om verder te gaan; meerdere beloningen komen na elkaar.
- Muziek: echte nummers per keukenblad komen in de map `music/` (menu.mp3 en keuken-1-houten-plank.mp3 tot keuken-6-nachtkeuken.mp3); het spel vloeit ze over bij een nieuwe keuken. Zonder bestanden speelt een klein ingebouwd deuntje. De Suno-prompts staan in `music/MUZIEK-suno-prompts.md`.
- Een lager startlevel (levelkiezer of "Speel" op de Fruitkaart) geldt nog voor één poging. Daarna ga je weer verder vanaf je hoogste level, ook als je een ander fruit kiest.
