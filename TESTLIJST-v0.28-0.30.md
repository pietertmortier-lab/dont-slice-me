# Testlijst v0.28 tot v0.30 (voor Pieter en de testers)

Speel op https://pietertmortier-lab.github.io/dont-slice-me/ (of in de app na `git pull`, `npm run www`, `npx cap sync android`).
Vink af wat klopt; noteer bij elk punt wat je anders verwacht had.

## v0.28 Flow en Fruit Fever
- [ ] Rechtsboven staat een paarse FLOW-balk met vier vakjes; elke "Net niet!" vult een vakje.
- [ ] Een snee (ook een gekraakte schil) maakt de balk leeg; stilstaan laat hem na 4 s langzaam leeglopen.
- [ ] Vol = FRUIT FEVER: banner, gouden gloed rond je fruit, alles vertraagt, alle nieuwe klontjes goud, dubbel sap, muziek sneller. Na 8 s "Fever voorbij".
- [ ] Op het eindscherm staat hoe vaak je in Fever zat.

## v0.28 Aartsvijand
- [ ] Na een paar sneden verschijnt "Je aartsvijand ... is er!" en dat patroon of gevaar krijgt paarse in plaats van rode waarschuwingslijnen.
- [ ] Drie keer zijn hele patroon ontwijken in één poging: "Wraak!" (+200 sap, sticker Wraak in het Album) en hij is de rest van die poging trager.
- [ ] Eindscherm: "Aartsvijand: ... (N× geraakt)" met "wraak genomen!" of "N× ontweken".

## v0.29 Duel van de dag (Spellen)
- [ ] Knop Speel: 90 seconden, start op level 10, score = sap. Je tegenstander (of De Chef) speelt als doorzichtige schim mee met zijn naam eronder.
- [ ] Als de schim gesneden wordt zie je "X is gesneden na N s"; na afloop een eindscherm met Gewonnen!/Gelijkspel/verloren en de pot.
- [ ] Je kunt maar één duel per dag spelen; de knop wordt "Gespeeld".
- [ ] Vriendenduel: Vrienden > kaartje van een vriend > "Daag uit voor een duel". De uitdaging staat in het blok Duels. De verliezer draagt het Pannetje (pauzescherm, vriendenlijst, andere spelers zien het).
- [ ] Rivalen van de week (Vrienden): twee spelers net boven je; inhalen geeft 300 sap en een melding bij hen.

## v0.29 Seizoen 1 · Het Laatste Gerecht (Spellen)
- [ ] Hoofdstuk 1 staat open (vanaf 19/10), hoofdstuk 2 vanaf 26/10, enzovoort; de lijst toont de data.
- [ ] De Chef: 60 s overleven, brede hakbijl-lijnen plus gewone messen, elk hoofdstuk een eigen regel (hoofdstuk 2: dubbel mes).
- [ ] Gehaald: +500 sap en de Regenboogkiwi wordt speelbaar (Fruit); na hoofdstuk 2 een glinsterspoor, na 3 goud, na 4 een gloed.

## v0.30 Jouw Keuken (menuknop Keuken)
- [ ] Lege keuken met vier toestellen te koop; na de eerste koop maakt de keuken sap per uur (bovenaan te zien).
- [ ] Sluit het spel en kom later terug: "Klaar om op te halen" groeit, maar na 8 uur niet meer. "Haal op" geeft het sap.
- [ ] Bij 5 niveaus word je Bistro en krijg je de bordskin Bistrotafel (Winkel > bordskins > Gebruik).
- [ ] Bestellingen: drie briefjes met voortgang; een klaar briefje heeft een knop Ontvang.
- [ ] Vrienden met een keuken staan onder "Keuken van de week"; Bezoek toont hun keuken; "Geef een fooi" kost 50 sap en lukt één keer per vriend per dag (vraagt de nieuwe serverdeploy).

## Algemeen
- [ ] Pauzescherm toont "Muziek: keuken-x-....mp3": verandert dit bij een nieuwe keuken (level 6, 11, 16, ...)?
- [ ] Engels (vlagknop): geen Nederlandse woorden meer in de nieuwe schermen.
- [ ] Oude voortgang (level, fruit, sap) is er nog na de update.
