# Testlijst v0.32.10 - het live vriendenduel op één gedeeld veld (stap A)

Volgorde: eerst de server en de regels (Pieter: `firebase deploy --only functions,firestore,database` in `native/tourney`),
dan de nieuwe app (versionCode 4, versionName 0.32.10) in de interne test. Je hebt twee telefoons nodig (A en B), elk met
de app uit de Play-test, een eigen spelersnaam, en A en B zijn vrienden. Tandwiel: onderaan staat "Versie v0.32.10".

Tekens bij elke stap:
- **[S]** werkt pas als de nieuwe server (met de regels van de database) online staat.
- **[A]** heeft de nieuwe app 0.32.10 op beide telefoons nodig.
- **[S+A]** heeft allebei nodig.

Gaat iets mis? Stuur een schermafbeelding met het nummer (liefst met de verborgen controle aan, zie stap 3). Gaat alles
goed: "alles ok".

**Wat in stap A hetzelfde is op beide telefoons:** de duelklok, de messen (soort, hoek, plaats, moment), de suikerklontjes,
de bonussymbolen (schild, magneet, dubbel sap, krimp) en de vork, op dezelfde plaats op hetzelfde moment.
**Wat nog per telefoon is (tot stap B):** ieder pakt zijn eigen klontjes (een klontje dat B pakte, blijft op A's scherm
staan tot het weggaat), een bonus die je pakt is alleen voor jou, de messen mikken op de klontjes en de speelband (niet op
jou), en je score telt alleen wat jij pakte. Klontjes afpakken ("Lotte pakte het!") bestaat nog niet.

**Let op voor je speelt (jouw keuze):** omdat de messen in stap A op de klontjes mikken en niet op jou, is het duel
ongeveer twee keer makkelijker dan in 0.32.9. Wie klontjes pakt, krijgt ongeveer 6 messen over zijn fruit per duel in
plaats van ongeveer 12; wie stil blijft staan ongeveer 6 in plaats van ongeveer 51 (gemeten met testbots over 100 duels).
En omdat jullie allebei dezelfde klontjes kunnen pakken, eindigen twee spelers die even goed pakken vaak bijna gelijk
(een gelijkspel kan). Wil je meer druk zonder op stap B te wachten, dan kan één getal omlaag (de messen komen dan ongeveer
1,7 keer zo vaak); zeg het en het komt in de volgende versie. De echte oplossing (messen die om beurten op jullie elk
mikken) is stap B.

**Algemeen**
1. [A] Tandwiel: onderaan staat **Versie v0.32.10** (op beide telefoons).
2. [S+A] A nodigt B uit voor een live duel. In de lobby kiest B een fruit en tikt **Klaar**: op A zie je B's keuze en
   Klaar bijna meteen (niet pas na enkele seconden). In het fruitkaartje staat "Jullie spelen op één gedeeld veld:
   dezelfde messen, klontjes en bonussen op hetzelfde moment. De messen mikken op de klontjes, niet op jou. ..."
3. [S+A] Beiden Klaar: het duel start. Tik op beide telefoons 5 keer snel op de duelklok bovenaan. Onderaan verschijnt
   een klein vak met `wt ... s · veld ...`, `klontjes: ...`, `bonus: ...`, `messen: ...` en `vriend: live ... s`.
   Nog eens 5 tikken zet het weg; je fruit stuurt gewoon mee terwijl je tikt.

**Twee telefoons naast elkaar op wifi**
4. [S+A] De messen komen op hetzelfde moment, op dezelfde plaats en in dezelfde richting op beide schermen.
5. [S+A] Met het vak aan: dezelfde `wt` (op een paar honderdsten na), dezelfde veldcode en dezelfde nummers bij
   `messen` en `bonus` op hetzelfde moment. Maak eventueel één foto van beide schermen samen.
6. [S+A] De klontjes en bonussymbolen verschijnen op dezelfde plaats. Pak op A een klontje: op B blijft het staan tot het
   van het veld gaat (dat is zo in stap A). Op A is het weg en telt het voor A.
7. [S+A] Het fruit van je vriend volgt "meteen" (ongeveer 0,2 seconde), zonder sprongen. Naast de liveregel bovenaan staat
   een **groen** bolletje. In het vak staat `vriend: live 0,2 s` of zoiets.
8. [S+A] Pak een bonus op A (schild, magneet, dubbel sap of krimp): het werkt alleen voor A. Op B blijft het symbool staan
   tot het weggaat. Krimpt A, dan zie je A's fruit op B ook kleiner.
9. [S+A] Geen vertraagde tijd: tijdens een bijna-snede of Fever gaan de messen niet trager, en er komen geen level-ups in
   het duel. Fever geeft "8 s: dubbel sap".
10. [S+A] Na 90 seconden eindigt het duel op beide telefoons tegelijk en zien jullie allebei dezelfde uitslag.

**Fruit met een truc**
11. [S+A] Kies in de lobby Kiwi, Druif, Banaan, Mandarijn of Citroen: het fruitkaartje zegt dat die truc niet werkt op het
    gedeelde veld (bijvoorbeeld "Je spoor vertraagt de messen niet: ..."). In het duel zijn de messen inderdaad op beide
    telefoons gelijk.

**Andere telefoons en slechtere verbinding**
12. [S+A] Twee verschillende telefoons (oud en nieuw, smal en breed): hetzelfde veld; alleen de rand rond het veld
    verschilt. De pauzeknop en de balkjes staan binnen het veld en niets overlapt.
13. [S+A] Eén telefoon op 4G (wifi uit): hetzelfde veld. Noteer of het bolletje oranje wordt ("verbinding zwak") en hoe
    vaak.
14. [S+A] Druk op A op pauze (of leg A 5 seconden weg met het scherm uit): op B verdwijnt A's fruit en staat
    "A pauzeert". Het duel loopt door. Terug op A: de messen en klontjes staan op dezelfde plaats als op B (het vak:
    dezelfde veldcode). Je fruit is daarna nog ongeveer 0,3 seconde veilig (net genoeg om te zien waar alles staat); een
    mes dat daarna nog over je fruit gaat, raakt je wel. Pauzeren vlak voor een mes is dus geen ontsnapping meer.
15. [S+A] Vliegtuigmodus op A voor 3 seconden: op B wordt het bolletje oranje ("verbinding zwak"). Op A zelf wordt het
    na ongeveer 4 seconden grijs ("vertraagd"); op B blijft het oranje tot ongeveer 10 seconden, daarna wordt het ook
    grijs ("vertraagd") en beweegt A's fruit zoals vroeger, ongeveer 5 seconden vertraagd. Vliegtuigmodus uit: binnen een
    paar seconden weer groen en live, zonder dat A's fruit wegspringt. Het duel eindigt gewoon met een uitslag.
16. [S+A] Start A het duel een paar seconden later (A was even weg uit de app tijdens het aftellen): A springt meteen naar
    het juiste moment; het vak toont op A en B dezelfde `wt` en veldcode. A's duel telt toch de volle 90 seconden (de
    uitslag toont A's tijd als 1:30, niet een paar seconden minder).

**Altijd een duel (gewone modus)**
17. [S] Een telefoon met de oude app 0.32.9 tegen een telefoon met 0.32.10 (beide kanten: wie uitnodigt en wie
    uitgenodigd wordt): het duel werkt zoals in 0.32.9 (vriend ongeveer 5 seconden vertraagd, geen bolletje, eigen veld).
    Het vak met 5 tikken verschijnt dan niet. Wie 0.32.10 heeft, maakt dan ook geen verbinding met de Realtime Database
    (in de Firebase-console staat onder `ld` voor die lobby alleen wat de server zelf schreef: `c` en `m`).
18. [S+A] Zet op B vliegtuigmodus aan in de lobby en weer uit net voor jullie allebei Klaar tikken: het duel start gewoon,
    op het gedeelde veld als B's verbinding op tijd terug is, anders zoals in 0.32.9 (geen bolletje). Er is altijd een
    uitslag.
19. [A] Solo, toernooi, Mes van de dag, openbare duels en de uitdaging van 24 uur: alles zoals voorheen (geen rand,
    geen bolletje, gewone level-ups).
19b. Niet getest: de oude webversie in een liggend venster (een telefoon dwars in de browser). Het gedeelde veld past dan
    op de hoogte en wordt klein (de tekst bovenaan is moeilijk te lezen). Rechtop en op een tablet rechtop is het goed.

**Pieter in de Firebase-console**
20. [S] Firebase-console > Realtime Database > Gegevens: tijdens een duel staat er een tak `ld` met de lobby; na het duel is
    die weer weg (blijft er toch iets staan, dan wist de server het bij de volgende activiteit op de server, zodra het
    ouder is dan een uur).
21. [S] Firebase-console > Realtime Database > Gebruik: ongeveer 1 MB per duel (een schatting; een paar duels per dag blijft
    ver onder de gratis grens).
22. Noodschakelaars (alleen als er iets slecht werkt), telkens in `native/tourney/index.js`, daarna
    `firebase deploy --only functions` en opnieuw spelen, zonder nieuwe app:
    - alleen het gedeelde veld uit, het live beeld blijft: `LD_AR_OK = false`;
    - alles uit (geen live beeld, geen gedeeld veld, geen enkele verbinding met de Realtime Database, precies 0.32.9):
      `LD_RTDB_URL = ''`.
