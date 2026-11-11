# Testlijst v0.32.8 - 90 seconden in de lobby, fruitkaart, onderbroken poging, spaarpot ×2, klok van de telefoon, Volgend hoofdstuk, statusregels, eigen telling, minder warme telefoon

Eerst de server en de regels (Pieter: `firebase deploy --only functions,firestore` in `native/tourney`; zie ook STAPPEN-telling.md), daarna de website. Voor stap 4 tot 16
heb je twee telefoons nodig (of een telefoon en een pc), elk met een eigen spelernaam, die vrienden zijn. Allebei op
v0.32.8 (tandwiel: onderaan "v0.32.8"; zie je nog v0.32.7, sluit het spel helemaal en open het opnieuw).

Gaat iets mis? Stuur een schermafbeelding met het nummer. Gaat alles goed: "alles ok".

1. Tandwiel: onderaan staat **v0.32.8**.
2. Speel een poging en veeg het spel weg midden in de poging (app sluiten / tabblad dicht). Open opnieuw: kaartje **Vorige poging onderbroken**, en Pogingen is 1 hoger.
3. Eerste poging van de dag (of woensdag): onder je sap staat roze **spaarpot ×2**; de levelregel bovenaan zegt "Level 5 · 12/40" zonder "sap".
4. Telefoon A nodigt telefoon B uit voor een live duel; B tikt Speel. Zodra jullie allebei in de lobby zitten: **Kies je fruit · nog 1:30**, en het telt af.
5. Nergens staat **Start nu**; allebei hebben jullie de knop **Klaar**.
6. B tikt op een fruit (bijvoorbeeld Kiwi): een fruitkaart opent in de lobby; de klok en de twee namen blijven erboven zichtbaar.
7. De kaart toont de eigenschap (zelfde tekst als bij Verzamel > Fruit), je niveau en medaille, het vak **In dit live duel** en de regel over geleend fruit.
8. Blader met ‹ en › door alle 20 fruitsoorten; tik **Terug**: de kaart sluit, je fruit is niet veranderd.
9. Open een fruit en tik **Kies dit fruit**: de kaart sluit en dat fruit is geel omrand. Op telefoon A staat er binnen 2 seconden een **blauw stipje** op dat fruit.
10. De terugknop van Android met een open fruitkaart: alleen de kaart sluit, niet de lobby.
11. A tikt **Klaar**: op A staat "Wacht op ... · nog ...", op B "... is klaar · nog ..." en bij A het label **klaar**.
12. B kiest een ander fruit: B's Klaar is weg (knop weer **Klaar**). B tikt **Klaar**: het duel begint meteen met 3-2-1 op allebei.
13. Nieuw duel: tik allebei **niet** op Klaar en wacht. Vanaf 15 seconden wordt de klok oranje en staat er "Nog 12 s: daarna speel je met ...".
14. Na 0:00 begint het duel vanzelf, met bovenaan "Tijd om: je speelt met ..." en het fruit dat geel omrand was.
15. Nieuw duel: zet in de lobby één telefoon 15 seconden op slot en ontgrendel. De klok loopt verder met de tijd die over was (niet opnieuw 1:30).
16. Zet één telefoon op English en herhaal stap 6 en 11: "Pick this fruit", "Back", "Ready", "Waiting for ...".
17. Optioneel, met een vriend die nog v0.32.7 heeft: het live duel lukt; jij ziet "... heeft een oudere versie zonder Klaar"; zijn Start nu laat het duel niet vroeger beginnen dan jij wilt.
18. Live duel, laat de tijd aflopen zonder Klaar: op 0:00 staat er even **Tijd om** en kun je geen fruit meer aantikken tot het duel begint.
19. Android-app: installeer de nieuwe versie uit de interne test (Play Store > Don't Slice Me! > Bijwerken; tandwiel: v0.32.8).
    Start een poging: je sap, de tijd, de levelregel en het pauzeknopje staan **onder** de klok en de batterij, niet erover.
    De tabbladen onderaan staan **boven** de knoppen of het veegstreepje van Android. Kijk ook naar het pauzescherm, een
    menu (bijvoorbeeld Verzamel) en een kaartje: niets zit achter een balk. Bij het openen verspringt niets.
    Heb je tijd: zet in de instellingen van je telefoon (zoek op "navigatie") de andere manier aan, 3 knoppen of vegen, en kijk nog eens.
20. Op een kleine telefoon: verlies een poging. De gele knop **Verder** staat meteen boven de tabbladen (de foto van je fruit is dan iets kleiner).
21. Op de website (pc of telefoon-browser) verandert er niets aan de plaats van sap, tijd en knoppen.
22. De Chef (Spelen > Seizoen): haal een hoofdstuk. Op het kaartje staan **Volgend hoofdstuk** en **Menu** (de deelknop staat er nog onder).
23. Tik **Volgend hoofdstuk**: het volgende hoofdstuk dat je nog niet haalde start meteen, met de DE CHEF-banner en zijn regel, met hetzelfde fruit, en het kost geen hartje.
24. Haal opnieuw een hoofdstuk en tik **Menu**: je komt in Spelen > Seizoen (de lijst met hoofdstukken).
25. Haal het laatste open hoofdstuk: er staat **Naar het seizoen** (en "Hoofdstuk ... komt op ..." als het volgende nog dicht is); **Menu** gaat dan naar het hoofdmenu.
26. Laat je fruit snijden in een hoofdstuk: **Opnieuw** en **Ander fruit** zoals vroeger, met een klein linkje **Menu** eronder.
27. Een poging met zure regen (en liefst ook FEVER of een melding tegelijk): "Zure regen: nog 3 s goud" staat **onder** het levelbalkje, niet erdoor; meerdere regels staan netjes onder elkaar in het midden.
28. In De Chef staat de regel "De Chef · hoofdstuk 1 · nog 38 s" in het midden bovenaan, niet onder de pauzeknop, en "spaarpot ×2" raakt de knopjes linksboven niet.
29. Eigen telling: doe stap 1 tot 3 uit STAPPEN-telling.md. Open daarna **https://pietertmortier-lab.github.io/dont-slice-me/stats.html**, tik **Inloggen met Google** en kies dont.slice.me@gmail.com: je ziet de totalen van vandaag (de eerste dag is maar een deel van een dag).
30. Op stats.html met een ander Google-account: je ziet alleen **Geen toegang**.
31. Privacybeleid (tandwiel > Privacybeleid): punt 11 heet nu **Geen analysediensten, alleen dagtotalen**.
32. Website zonder internet: open eerst één keer de privacyverklaring met internet, zet dan vliegtuigmodus aan en open ze opnieuw: je ziet de privacyverklaring, niet het spel. Het spel zelf opent offline nog gewoon.
33. Op een kleine telefoon (app): laat je fruit snijden in een hoofdstuk van De Chef. Het linkje **Menu** staat meteen boven de tabbladen, zonder te scrollen.
34. Live duel, in de lobby: veeg met je vinger opzij over het kaartje. Het kaartje schuift niet opzij (op en neer scrollen kan nog).
35. Warmte: speel 10 minuten zoals altijd, niet aan de lader en met dezelfde helderheid als met v0.32.7. De telefoon wordt minder warm dan vroeger (helemaal koud blijft hij niet).
36. 60 beelden per seconde: het spel voelt even vloeiend, het fruit volgt je vinger zoals vroeger en een poging loopt niet trager of sneller (ook op een telefoon met een 90 of 120 Hz-scherm).
37. Menu zonder waas: in het menu, de winkel, de pauze en het game-over-scherm is de achtergrond achter het paneel niet meer wazig. Alles is even goed leesbaar als vroeger en de grote knop Spelen gloeit nog zacht.
38. Laat het menu of de winkel een minuut openstaan en tik dan op een tabblad of knop: alles reageert meteen en het beeld klopt (geen zwart of half beeld). Draai of vergroot het scherm (pc: maak het venster smaller): het spelbord staat meteen goed.
39. Geluid: ga even naar het startscherm van je telefoon en kom terug: muziek en geluid gaan gewoon verder. Zet in het tandwiel Geluid en Muziek uit en daarna Geluid weer aan: je hoort het tikje weer bij de volgende knop.
40. Pauzeer tijdens een poging en kijk een paar seconden naar het fruit achter het pauzepaneel: het staat stil (het wipt niet elke seconde een beetje op en neer). Na Verder beweegt het weer zoals altijd.
41. Android-app: bekijk een filmpje (bijvoorbeeld Verder na een verloren poging): na het filmpje staat het spel meteen goed in beeld en gaat de poging verder.
