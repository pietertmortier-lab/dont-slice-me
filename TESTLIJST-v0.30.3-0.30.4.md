# Testlijst v0.30.3 tot v0.30.4 (voor Pieter en de testers)

Speel op https://pietertmortier-lab.github.io/dont-slice-me/ (of in de app na `git pull`, `npm run www`, `npx cap sync android`).
Vink af wat klopt; noteer bij elk punt wat je anders verwacht had.

## v0.30.3 Seizoenen
- [ ] Spellen toont nog 'Seizoen 1 · Het Laatste Gerecht' met je gehaalde hoofdstukken; vormen en glinster blijven.
- [ ] Seizoensfruit lenen: in Fruit staat op het kaartje van de Regenboogkiwi 'Seizoensfruit' (niet 'Plus · deze maand'), in de uitleg 'Seizoensfruit: je speelt ermee zolang Seizoen 1 loopt...' en er is geen knop 'Houden · 0 sap' meer.
- [ ] Twee gekoppelde toestellen (gsm en tablet) die samen alle zes hoofdstukken haalden: na het samenvoegen is seizoen 1 voltooid, met de Regenboogkiwi, de titel Seizoensheld en één keer 2.000 sap.
- [ ] Vanaf maandag 30/11 07:00 (jouw tijd) staat er 'Seizoen 2 · De Gouden Oogst': Gouden Perzik als seizoensfruit, hoofdstuk 1 open, hoofdstuk 2 vanaf 7/12.
- [ ] Had je seizoen 1 helemaal: de Regenboogkiwi blijft van jou, met glinsterspoor en gloed; de titel Seizoensheld blijft.
- [ ] Had je seizoen 1 half: je sap blijft. Onder het seizoen staat 'Eerdere seizoenen: Seizoen 1: Regenboogkiwi vorm N/6'. Lenen kan niet meer (wel via Estafette-fragmenten).
- [ ] Hoofdstukken van seizoen 2: 2 Stroop op de plank, 3 Jager, 4 Dubbel mes, 5 Blind mes, 6 Stroop + Dubbel mes. Haalbaar in 60 s?
- [ ] Start je vlak voor 07:00 een hoofdstuk en haal je het na 07:00, dan telt het nog voor seizoen 1. 'Opnieuw' na 07:00 brengt je naar Spellen.
- [ ] Plus (simulatie) in seizoen 2 geeft de Winterbaret. Test dit vóór 27/11, nog in v0.30.3; daarna verbergt het web de Plus-knoppen.

**Tip: seizoen 2 vóór 30/11 bekijken.**
1. Open een privévenster (Ctrl+Shift+N) met het spel. Wil je je eigen voortgang zien, kopieer dan in je gewone venster je opslagcode en laad die hier.
2. Druk F12, ga naar Console, plak `window.dontsliceme.now = () => new Date('2026-11-30T07:01').getTime()` en druk Enter. Open daarna Spellen.
3. Speel in dat venster geen Duel van de dag en geen toernooi (die scores gaan naar de server). Zet nooit een code uit dat venster terug in je echte spel, en sluit het venster daarna.

Waarom zo voorzichtig: seizoenen gaan alleen vooruit. Alleen even kijken op een latere datum is niet erg: zodra de klok weer klopt, staat je spel terug in seizoen 1 met je gehaalde hoofdstukken. Maar haal je op een latere datum een hoofdstuk van seizoen 2, dan blijft je spel in seizoen 2 en kun je seizoen 1 niet meer afmaken (Spellen zegt dan 'Je opslag zit al in Seizoen 2: een klok liep voor.'). Verzet daarom ook nooit de klok van je pc of gsm; dat stoort andere programma's en de aanmelding bij de server.

## v0.30.4 Spoed
- [ ] Rad: nergens nog draaipakketten of een verkoopschakelaar in de winkel. De tweede beurt toont 'Filmpje: +300 sap' en geeft na het filmpje precies 300 sap.
- [ ] Ook met Plus (alleen als je Plus-simulatie vóór 27/11 startte): de eerste draai wordt niet meer verdubbeld en de tweede beurt is 'Filmpje: +300 sap'.
- [ ] Had je nog gekochte draaien: je ziet 'Je hebt nog N gekochte draaien. Die blijven bewaard...' en het getal zakt niet.
- [ ] Duel van de dag: geen inzet; winnen geeft 150 sap, verliezen kost niets.
- [ ] Vriendenduel: de verliezer draagt het Pannetje maar betaalt geen sap.
- [ ] Toernooi: 'Oefenladder · computertegenstanders', namen beginnen met Robot-. Na de week: weekresultaat zonder rangprijs; je divisie volgt weer je level. Mijlpalen, Weekpas-fragment en Maandkroon betalen nog.
- [ ] Verlaat een game-over via de onderbalk (bv. Fruit) of de terugknop van je gsm: je record, tijdbonus en XP komen er toch bij. Twee keer terug tijdens een poging stopt de poging en telt ze mee. Test dat ook bij je eerste poging meteen na het openen van de app: de eerste keer terug pauzeert, de app sluit niet.
- [ ] Fooi: je vriend (met v0.30.4) krijgt 50 sap.
- [ ] Op het web: de winkel toont 'In de app te koop' waar vroeger een europrijs stond; kopen met sap werkt nog; het hartjesscherm, de Fruitpas en het toernooi tonen geen euroknop (de Fruitpas zegt ook niet meer 'Simulatie').

## Algemeen
- [ ] Engels (vlagknop): geen Nederlandse woorden in het seizoensblok, bij de Winterbaret (Winkel) en bij de Regenboogkiwi (Fruit).
- [ ] Oude voortgang (level, fruit, sap, gehaalde hoofdstukken) is er nog na de update.
