# Testlijst v0.32.11 - het gedeelde veld met afpakken (stap B), hartjes en reclame

**Eerst, in deze volgorde (Pieter):**

0a. De server en de regels online zetten. Open een opdrachtvenster in de map `dont-slice-me` en typ, één regel per keer:

```
cd native\tourney
firebase deploy --only functions,firestore,database
```

Wacht tot er `Deploy complete!` staat.

0b. Daarna pas de nieuwe app (**versionCode 5, versionName 0.32.11**) in de interne test zetten. Typ eerst in de map `native`
    `npm run sync` (het stukje van de app dat de reclame toont, is veranderd).

0c. In de Play Console de beschrijving van het product `hearts_5` aanpassen (Engels `5 hearts at once, also above your maximum.`,
    Nederlands `5 hartjes meteen, ook boven je maximum.`), en op de lijst Licentietests alleen jezelf laten staan (zie het MANIFEST).

Je hebt twee telefoons nodig (A en B), elk met de app uit de Play-test, een eigen spelersnaam, en A en B zijn vrienden.
Tandwiel: onderaan staat "Versie v0.32.11".

Tekens bij elke stap:
- **[S]** werkt pas als de nieuwe server (met de nieuwe regels van de database) online staat.
- **[A]** heeft de nieuwe app 0.32.11 op beide telefoons nodig.
- **[S+A]** heeft allebei nodig.

Gaat iets mis? Stuur een schermafbeelding met het nummer, liefst met de verborgen controle aan (5 keer snel tikken op de
duelklok bovenaan, zoals in 0.32.10). Gaat alles goed: "alles ok". De lange tests (tien keer racen, 4G) doe je zelf.

**Wat nieuw is in stap B (alleen als jullie allebei 0.32.11 hebben):**
- De messen komen ongeveer 1,7 keer zo vaak en **mikken om de beurt op jou en op je vriend**. Een mes raakt iedereen die in
  de weg staat, ook als het voor de ander bedoeld was.
- **Klontjes en bonussen afpakken:** wie een klontje of bonus het eerst aanraakt, krijgt het. Raakte je vriend het net
  eerder aan, dan zie je **"Lotte pakte het!"** (met de naam van je vriend) en gaat je `+1` terug.
- Bonussen in duelvorm: **Kokspauze** stuurt de messen even naar de ander, **Suikerregen** laat klontjes aan jouw kant
  vallen (de ander mag er ook pakken), **Stroop** maakt de messen trager die op jou mikken.
- Fruittrucs werken weer op het gedeelde veld: de schil van Banaan, het spoor van Druif, de wolk van Durian en de ster van
  Stervrucht liggen voor allebei op het veld.
- De server rekent na het duel de uitslag na met de lijst van wat er gebeurde. Twijfelt hij, dan telt het duel zoals in
  0.32.9 (ieder zijn eigen score, nooit een kapot duel).

In de verborgen controle staan in stap B drie regels extra:
- `claims: jij ... · Lotte ... · terug ...` (hoeveel klontjes/bonussen jij en je vriend kregen, hoeveel er bij jou
  teruggingen);
- `messen op jou: ... · te laat ... · weg ...` (hoeveel messen op jou mikten, hoeveel te laat binnenkwamen);
- `klok: server ... ms · vriend ... ms · rtdb ...` (hoe ver je klok van de server lag, en hoeveel de telefoon denkt dat je
  klok van die van je vriend verschilt; dat laatste is alleen een schatting om te noteren, de klok wordt er niet mee
  verschoven).
Staat er `claims uit: ...`, dan speelt dat duel zonder afpakken (zeg het met de reden die erachter staat).
De regel `vriend: live · achter 0,2 s · 15/s · opnieuw 0 · knip 0` zegt hoe het beeld van je vriend er nu voor staat:
- het eerste woord is wat je ziet: `live` (je ziet je vriend bewegen), `zwak` (de verbinding hapert), `vertraagd` (je ziet
  je vriend alleen nog om de paar seconden, in een stippelrand) of `weg`;
- `achter 0,2 s`: hoeveel seconden het beeld van je vriend nu meer achterloopt dan op zijn beste moment van de laatste
  20 seconden. Normaal is dat 0,0 tot 0,5 s;
- `15/s`: hoeveel berichten van je vriend er de laatste seconde binnenkwamen (normaal 13 tot 16);
- `opnieuw`: hoe vaak je telefoon in dit duel de verbinding opnieuw maakte omdat die vastzat;
- `knip`: hoe vaak je telefoon in dit duel een opgestapelde achterstand wegknipte (de verbinding opnieuw maken, dan komt
  meteen het nieuwste beeld binnen).
Het bolletje naast de duelklok: **groen** = je ziet je vriend live, **oranje** = de verbinding hapert, **grijs** = vertraagd
of weg (je ziet je vriend om de paar seconden).

**Algemeen**
1. [A] Tandwiel: onderaan staat **Versie v0.32.11** (op beide telefoons).
2. [S+A] A nodigt B uit voor een live duel. In de lobby: open het fruitkaartje. Daar staat nu dat jullie op één gedeeld
   veld spelen, dat de messen om de beurt op jou en op je vriend mikken en dat wie een klontje het eerst aanraakt, het
   krijgt.
3. [S+A] Beiden Klaar: het duel start. Tik op beide telefoons 5 keer snel op de duelklok bovenaan: het vak met de
   veldcode en de drie nieuwe regels verschijnt.

**Twee telefoons naast elkaar op wifi**
4. [S+A] Dezelfde messen op hetzelfde moment op beide schermen. Kijk naar `messen op jou` in het vak: op beide telefoons
   gaat dat getal omhoog (de messen mikken om de beurt op A en op B). Een mes dat voor A bedoeld was, kan B ook raken als B
   in de weg staat.
5. [S+A] **Race om één klontje.** Ga met beide fruitjes naar hetzelfde klontje en raak het tegelijk aan. Wie eerst was,
   houdt het; op de andere telefoon verdwijnt het of staat er "A pakte het!" en gaat de `+1` terug (binnen ongeveer een
   halve seconde). Doe dit **tien keer**. Noteer elke keer dat het verkeerd aanvoelt, en schrijf de `claims`-regel van
   beide telefoons op na de tiende keer.
6. [S+A] **Bonussen.** Pak elk een bonus:
   - **Kokspauze**: de messen gaan naar de ander. Op de andere telefoon staat "A stuurt de messen naar jou!".
   - **Suikerregen**: er vallen klontjes aan jouw kant. Kan de ander er een paar afpakken? (Dat mag.)
   - **Stroop**: de messen die op jou mikken, gaan trager.
   - **Schild**: het mes kan je even niet raken.
   Pakken jullie dezelfde bonus tegelijk, dan krijgt maar één van jullie hem; de ander ziet "A was je voor: geen ...".
7. [S+A] **Fruit met een truc.** Kies Banaan, Druif, Durian of Stervrucht: de schil, het spoor, de wolk of de ster
   verschijnt op beide telefoons op dezelfde plaats, en vertraagt (of bij de ster: vangt) ook de messen van de ander.
8. [S+A] Na 90 seconden eindigt het duel op beide telefoons tegelijk en zien jullie allebei dezelfde uitslag.

**Slechtere verbinding**
9. [S+A] Eén telefoon op 4G (wifi uit): doe 4 en 5 opnieuw. Verschijnt "verbinding zwak"? Hoe vaak zie je een mes dat
   **bleek** (doorzichtig) getekend is? Een bleek mes kwam te laat binnen en kan je niet raken.
10. [S+A] Vliegtuigmodus op A voor **3 seconden**: naast het bolletje staat "offline"; klontjes gaan door A's fruit heen
    zonder dat A ze pakt. Vliegtuigmodus uit: binnen een paar seconden kan A weer klontjes pakken.
11. [S+A] Vliegtuigmodus op A voor **6 seconden**: op A staat "Geen verbinding: je speelt even alleen verder", A pakt
    dan wel weer klontjes. Vliegtuigmodus uit: "Weer verbonden". Het duel eindigt gewoon met een uitslag (de server telt
    dan beide spelers zoals in 0.32.9).
12b. [S+A] **Lang duel.** Speel een volledig duel van 90 seconden, liefst één telefoon op 4G. Open het vak op beide
    telefoons en lees de regel `vriend: ...` na 10 seconden en na 80 seconden. Noteer telkens het getal na `achter` en de
    getallen na `opnieuw` en `knip`. Loopt je vriend na een minuut duidelijk meer achter dan in het begin (bijvoorbeeld
    `achter 1,5 s` of meer)? Zie je `knip 1` of meer, en ziet je vriend er daarna weer vlot uit? Zeg het, met de regel.
12. [S+A] Druk op A op pauze (of leg A 5 seconden weg met het scherm uit): op B staat "A pauzeert" en mikt geen enkel mes
    op A. Terug op A: hetzelfde veld als op B (dezelfde veldcode in het vak). Tijdens de pauze en de eerste seconde
    daarna kan A geen klontjes pakken.

**Altijd een duel**
13. [S] Eén telefoon met **0.32.10** (of houd een oude telefoon op 0.32.10) tegen een telefoon met 0.32.11: het duel
    speelt het veld van stap A (dezelfde messen en klontjes, maar niet afpakken, de messen mikken op de klontjes), zonder
    fouten, met een uitslag. Met 0.32.9 tegen 0.32.11: het duel van 0.32.9.
14. [A] Solo, toernooi, Mes van de dag, openbare duels en de uitdaging van 24 uur: alles zoals voorheen.

**De uitslag**
15. [S+A] Klopt de score van de server (de uitslag) met wat de telefoons op het einde van het duel toonden? Een **lagere**
    score bij de server betekent dat de server klontjes niet aanvaardde. Staat er in het vak `claims uit` of speelde je even
    alleen ("alleen verder"), dan telt de server gewoon de score die je telefoon op het einde toonde. Zie je een verschil,
    zeg het dan, met de `claims`-regel uit het vak.

**Pieter in de Firebase-console**
16. [S] Firebase-console > Realtime Database > Gegevens: tijdens een duel staat onder `ld` > de lobby ook een tak `e`
    (de lijst met gebeurtenissen van elke speler) en een getal `s`; na het duel is de hele lobby weer weg.
17. [S] Firebase-console > Realtime Database > Gebruik: nog altijd ongeveer 1 MB per duel.

**Noodschakelaars** (alleen als er iets slecht werkt), telkens in `native/tourney/index.js`. Daarna: open een
opdrachtvenster in de map `dont-slice-me`, typ `cd native\tourney` en dan `firebase deploy --only functions`, en speel
opnieuw, zonder nieuwe app:
18. Afpakken en mikkende messen uit, het gedeelde veld van stap A blijft: `LD_AB_OK = false`.
19. Het hele gedeelde veld uit (de gewone modus, met het live beeld): `LD_AR_OK = false`.
20. Alles uit (geen live beeld, geen gedeeld veld, geen lijst met gebeurtenissen, geen enkele verbinding met de Realtime
    Database, precies 0.32.9): `LD_RTDB_URL = ''`.

**Hartjes en reclame** (op één telefoon met de nieuwe app 0.32.11; geen tweede telefoon nodig)
21. [A] Tandwiel > Hulp > "Hartjes en spelvormen": er staat dat je er gewoonlijk hoogstens 3 hebt, en dat hartjes met geld
    of als prijs altijd blijven. Een nieuwe speler begint met 3 hartjes.
22. [A] Je maximum is 3, plus 1 voor de keukenbonus "Extra hartje" (vanaf level 31), plus 1 voor "Tweede extra hartje" (vanaf
    level 51), plus 1 per extra hartjesplek, plus 1 met Plus. Had je vóór de update meer hartjes dan dat nieuwe maximum, dan
    houd je ze: je ziet je maximum aan hartjes met "+N" ernaast, en op het hartjesscherm "Alle hartjes vol, +N extra". Speel tot
    je onder je maximum zit: pas dan loopt "Volgend hartje over ...". Zit je boven level 51 (dan is je maximum 5 of meer), dan
    zie je na de update gewoon volle hartjes zonder "+N". Test "+N" dan zo: koop met volle hartjes "5 hartjes · €0,99" (als
    licentietester is dat gratis) en kijk of je "+5" ziet.
23. [A] Hartjesscherm met volle hartjes: "+1 hartje · je hartjes zijn vol" is grijs (met sap niet boven je maximum). De knop
    "5 hartjes · €0,99 (ook boven je maximum)" werkt wel: je krijgt alle 5 hartjes, geen sap. (Ben je licentietester, dan is
    die aankoop gratis.)
24. [A] Een prijs met hartjes terwijl je hartjes vol zijn (bijvoorbeeld de dagreeks of een trede van de Fruitpas): je krijgt
    alle hartjes. Er staat nergens meer "wacht tot je een hartje kwijt bent" of "als sap".
25. [A] Bij 0 hartjes: op het hartjesscherm staat "Bij 0 hartjes: een filmpje voor 1 hartje (samen met Verder hoogstens 2
    filmpjes per dag)", en de knop "Filmpje: +1 hartje (nog 2 van 2 vandaag)". Kijk het filmpje: de poging begint. Gebruik daarna in een
    poging één keer "Verder" na een snee: daarna zijn beide filmpjes op voor vandaag, ook op een ander level ("vandaag al 2
    filmpjes gebruikt").
26. [A] Reclame: speel twee gewone pogingen (elk kost een hartje) en ga telkens van het eindscherm weg (Opnieuw of Ander
    fruit). Na de eerste komt er geen reclame, na de tweede wel: eerst "Reclame laden...", dan een testreclame van Google.
    Een poging die je zelf stopt (pauze > Stoppen) kost ook een hartje en telt dus ook mee: stop één poging en speel er daarna
    één tot het eindscherm; bij het weggaan van dat eindscherm komt de reclame.
27. [A] De fout van de reclame tijdens het spelen: tik op het eindscherm, wanneer er een reclame moet komen, 3 keer snel op
    Opnieuw. Je ziet "Reclame laden...", de extra tikken doen niets, na de reclame begint één poging (één hartje minder), en
    tijdens de poging komt er nooit een reclame. Zet daarna wifi en mobiele data uit en doe het nog eens (2 hartjes verliezen):
    na ongeveer 4 seconden ga je zonder reclame verder, en er komt ook later geen reclame over je poging.
28. [A] Met Reclamevrij of Plus: nooit een reclame, ook niet na 2 verloren hartjes.
29. [A] Ga, terwijl er "Reclame laden..." staat, snel naar het startscherm van je telefoon en kom na een paar seconden terug
    in het spel. Je staat weer op het eindscherm, er is geen poging begonnen (geen hartje minder) en er komt ook geen reclame
    meer. Tik Opnieuw: de poging begint meteen.
30. [A] Als Google je om toestemming voor advertenties vraagt (het venster van Google, bijvoorbeeld als de app de eerste keer
    zonder internet startte): zolang dat venster open staat, begint er geen poging en gaat er geen hartje af, ook niet na 4
    seconden. Pas als je het venster sluit, komt de reclame (of ga je verder).
