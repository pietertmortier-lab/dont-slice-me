# Testlijst v0.32.15 - sapprijzen groeien mee met je ronde

Wat er nieuw is (jouw keuzes van 15 november: 1A, 2A, 3A en 4A):
- Hartjes, startboosts, het Reeksschild en de sapverdubbelaar met sap kosten één keer per ronde van 30 levels wat meer sap.
  Je hoogste level telt. Level 1 tot 30 blijft zoals vroeger.
- De twee sappotten heten nu Kleine sappot (€ 0,99) en Grote sappot (€ 2,49) en geven meer sap op hogere levels (nooit minder
  dan 3.000 en 10.000).
- De sapverdubbelaar met geld kost in het spel € 1,99.
- Wie al op level 31 of hoger zat, ziet één keer een uitlegkaartje. De bonusrun van de Jacht op de Gouden Vork gebruikt geen
  klaargezette startboost meer.

v0.32.15 bevat ook alles van v0.32.14, v0.32.13 en v0.32.12. Staat een van die versies nog niet in de interne test? Dan hoef
je ze **niet** apart te uploaden: je mag meteen v0.32.15 uploaden. Lees dan wel eerst stap 0 hieronder.

Gaat iets mis? Stuur een schermafbeelding met het nummer van de stap. Gaat alles goed: "alles ok". Ik label niets als af voor
jij het gespeeld hebt.

## 0. Eerst: welke versie staat er nu op je telefoon?

0a. Open de app en tik op het **tandwiel**. Onderaan staat de versie.
0b. Staat er **"Versie v0.32.14"**? Ga dan naar stap 1.
0c. Staat er **"Versie v0.32.11"**, **"Versie v0.32.12"** of **"Versie v0.32.13"**, of heb je v0.32.13 nog niet getest? Dan
    gelden twee stappen uit `TESTLIJST-v0.32.13.md` nog altijd, als je ze nog niet deed:
    - **stap 0**, alleen als je telefoon nog **v0.32.11** heeft (vóór je iets nieuws uploadt: de bewaarde tickets en de
      bestellingen nakijken). Staat er al v0.32.12 of nieuwer, dan sla je stap 0 over (die kan alleen op v0.32.11);
    - **stap 14** (de drie ticketproducten `tickets_5`, `tickets_15` en `weekpass` op inactief in Play Console, pas **nadat**
      je zelf hebt bijgewerkt). Dat doe je hieronder bij stap 18.
0d. Staat er nog **"Versie v0.32.10"**? Zet dan eerst v0.32.11 in de interne test met `TESTLIJST-v0.32.11.md`, werk je
    telefoon bij en doe dan stap 0c.

## 1. Bouwen en uploaden (versie 0.32.15)

Er is geen server-update: **geen** `firebase deploy`.

1. Open een opdrachtvenster in de map `dont-slice-me`. Typ `git pull` en druk op Enter.
2. Typ `cd native` en druk op Enter.
3. Typ `npm run sync` en druk op Enter. Wacht tot het klaar is. (Dit is nodig: `index.html` is veranderd. Zonder deze stap zit
   de oude `index.html` in de app, met de oude prijzen.)
4. Open Android Studio. Open `app` > `build.gradle` (Module :app).
5. Zet daar **`versionCode 9`** en **`versionName "0.32.15"`**. (Ook als je v0.32.12, v0.32.13 of v0.32.14 oversloeg: 9.)
6. Klik bovenaan op **Sync Now** als die balk verschijnt.
7. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
8. Typ je wachtwoord in Android Studio (dezelfde sleutel als altijd) > **Next**.
9. Kies **release** > **Create**. Je ziet rechtsonder "Generate Signed Bundle: ... successfully".
10. Play Console (log in met `dont.slice.me@gmail.com`): **Testen en releasen** > **Testen** > **Interne test** >
    **Nieuwe release maken**.
11. Sleep `native\android\app\release\app-release.aab` naar **App-bundels**. Je ziet: "9 (0.32.15)".
12. Releaseopmerkingen: vervang alles in het vak door het blok "Voor v0.32.15 in de interne test" uit
    `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`).
13. **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.

## 2. Bijwerken

14. Werk de app bij naar **0.32.15** uit de interne test. Open de app.
15. Tandwiel: onderaan staat **"Versie v0.32.15"**.
16. Alleen als je v0.32.14 nooit testte: doe `TESTLIJST-v0.32.14.md`, deel 3 en 4 (het Mes van de dag, een paar dagen).
17. Alleen als je v0.32.13 nooit testte: doe `TESTLIJST-v0.32.13.md`, stap 17 tot en met 45. Waar daar "0.32.13" staat, lees
    je "0.32.15". Eén uitzondering: het privacybeleid (stap 44 daar) zegt nog altijd "spelversie 0.32.13"; dat klopt, want
    v0.32.14 en v0.32.15 sturen niets nieuws.

## 3. Play Console (pas nu: na de upload en nadat je zelf bijwerkte)

Doe dit niet eerder. Zet je de verdubbelaar eerder op € 1,99, dan toont de oudere app nog "€0,99" op de knop terwijl Google
€ 1,99 vraagt. Alle details staan in `PLAY-CONSOLE-v0.32.15.md`.

18. Alleen als het nog niet gedaan is (stap 0c): zet `tickets_5`, `tickets_15` en `weekpass` op **inactief** met
    `PLAY-CONSOLE-v0.32.12.md` vanaf stap 3. Waar daar "0.32.12" staat, lees je "0.32.15".
19. **Inkomsten genereren** > **Producten** > **Eenmalige producten** > klik op **`sap_3000`**. Bij **Productgegevens**
    (Engels): naam `Small juice pot`, beschrijving `At least 3,000 juice, more at higher levels. You see the amount before you buy.`
20. Bij de Nederlandse vertaling van `sap_3000`: naam `Kleine sappot`, beschrijving `Minstens 3.000 sap, op hogere levels meer.
    Je ziet het aantal vóór je koopt.` > **Opslaan**. De prijs (€ 0,99) blijft.
21. Hetzelfde voor **`sap_10000`**: Engels `Big juice pot` / `At least 10,000 juice, more at higher levels. You see the amount
    before you buy.`, Nederlands `Grote sappot` / `Minstens 10.000 sap, op hogere levels meer. Je ziet het aantal vóór je koopt.`
    > **Opslaan**. De prijs (€ 2,49) blijft.
22. **`doubler_1h`** > de aankoopoptie **`buy`** > **Prijzen**: vul **1,99 EUR** in en laat Google de andere landen omrekenen.
23. Klik bij **België** en daarna bij **Nederland** op het potloodje en vul zelf de prijs **met** btw in: **€ 1,99**.
    **Opslaan** (en bevestig als Google vraagt of de nieuwe prijs mag gelden). Je ziet bij België en Nederland: € 1,99.
24. In RevenueCat hoeft niets (de product-ID's blijven dezelfde).

## 4. Sapprijzen in het spel

Voor alles hieronder telt je **hoogste** level (bovenaan bij Spelen > Levels). Zoek eerst jouw rij op:

| Je hoogste level | Ronde | 1 hartje (1e-3e · 4e · 5e) | Startboost | Reeksschild | Verdubbelaar met sap | Kleine sappot | Grote sappot |
|---|---|---|---|---|---|---|---|
| 1-30 | 1 | 300 · 400 · 500 (zoals vroeger) | 150 | 300 | 30.000 | 3.000 | 10.000 |
| 31-60 | 2 | 500 · 650 · 850 | 250 | 500 | 30.000 | 3.000 | 10.000 |
| 61-90 | 3 | 1.000 · 1.300 · 1.700 | 500 | 1.000 | 30.000 | 6.000 | 20.000 |
| 91-120 | 4 | 2.000 · 2.700 · 3.300 | 1.000 | 2.000 | 30.000 | 12.000 | 40.000 |
| 121-150 | 5 | 3.000 · 4.000 · 5.000 | 1.500 | 3.000 | 36.000 | 18.000 | 60.000 |
| 151 en hoger | 6 | 5.000 · 6.500 · 8.500 | 2.500 | 5.000 | 60.000 | 30.000 | 100.000 |

### Het uitlegkaartje (alleen als je hoogste level al 31 of hoger was vóór je bijwerkte)

25. Ga naar **Winkel**. Bovenaan staat een omkaderd kaartje **"Nieuw: sapprijzen groeien mee met je ronde"**. Het noemt jouw
    ronde en de prijs van een hartje en een startboost (moet kloppen met jouw rij hierboven). Op het hartjesscherm staat
    hetzelfde kaartje korter, onder de prijsregel. Het is geen venster dat over iets anders komt.
26. Tik **OK**: het kaartje verdwijnt, in de winkel en op het hartjesscherm. Sluit de app helemaal af en open ze opnieuw: het
    komt **niet** terug. Het kaartje komt maar één keer: ook als je geen OK tikt, is het na het herstarten van de app weg.
    (Wie pas na de update level 31 haalt, krijgt het kaartje niet; die ziet de zin in de levelbanner, stap 37.)

### Hartjes

27. Open het hartjesscherm (tik op je hartjes). Onder "Prijs met sap: ..." staat een regel **"Prijsniveau: ronde N (level
    ...). Vanaf level ... wordt het duurder."** (vanaf level 151: "... en verder (level 151 en hoger). Duurder wordt het niet
    meer."). De prijzen in "Prijs met sap" kloppen met jouw rij.
28. Koop een hartje met sap (je moet onder je maximum zitten): je sap gaat precies de prijs op de knop omlaag. Hoogstens 5
    per dag, zoals vroeger.

### Winkel

29. **Winkel**: bovenaan elk subtabblad (Aanbod, Spullen, Sap) staat dezelfde regel "Prijsniveau: ...".
30. **Aanbod** > Startboost: de knop toont de prijs uit jouw rij. Koop er één: je sap gaat zoveel omlaag. Boosts die je al
    had, blijven gewoon.
31. **Aanbod** > Sneller vooruit: "Sapverdubbelaar 1 uur" met sap toont de prijs uit jouw rij; die **met geld** toont
    **€1,99**. (Als de Dagdeal vandaag de verdubbelaar is: de helft van de prijs met sap.) Koop je hem met geld, dan toont het
    venster van Google € 1,99 (als je stap 22 en 23 deed).
32. **Spullen** > Hulpmiddelen > Reeksschild: prijs uit jouw rij (ook op Vandaag, bij de dagreeks).
33. **Sap**: "Kleine sappot · ... sap" (€0,99) en "Grote sappot · ... sap" (€2,49), met het getal uit jouw rij. Koop er één
    met de testkaart: je krijgt precies het getal dat er stond. Het venster van Google toont de nieuwe naam (als je stap 19
    tot 21 deed).
    Goed om te weten (jouw keuze 2A): op hoge levels geeft één pot veel meer sap, dus koop je er ook meer mee van wat een vaste
    prijs heeft. Vanaf level 151 kost de hele Gereedschapskist (200.000 sap) twee Grote sappotten (€ 4,98) in plaats van
    twintig (€ 49,80) in v0.32.14. Een poging op level 151 geeft volgens de controle ongeveer 15.000 tot 19.000 sap.
    Wil je dat anders, zeg het dan.
34. Een lopende verdubbelaar, je boosts, Reeksschilden en sleutels van vóór de update zijn er nog.
35. **Kleine telefoon** (of zet de lettergrootte van je telefoon groot): niets valt buiten het scherm op het hartjesscherm en
    in de winkel, in het Nederlands en in het Engels (Tandwiel > Taal).

### De stap naar een nieuwe ronde (als je bijna aan 31, 61, 91, 121 of 151 zit)

36. Speel tot je voor het eerst level 31 (of 61, 91, 121, 151) haalt.
37. In de levelbanner staat onder de gewone tekst één keer **"Nieuwe ronde: sapprijzen gaan mee omhoog"**. Daarna is de regel
    in de winkel een ronde verder.
38. Speel je later opnieuw vanaf een lager level over die grens: de regel komt **niet** nog eens.
39. Haalde je daarbij voor het eerst level 31: in de winkel en op het hartjesscherm staat **geen** uitlegkaartje.

### Jacht op de Gouden Vork (alleen in de week van de Gouden Vork)

40. Zet een startboost klaar (Winkel > Aanbod > Startboost > Zet klaar; met Plus ligt er elke dag een Schild klaar).
41. **Spelen** > **Toernooi** > **Bonusrun**: je begint **zonder** die boost. Na de run staat hij nog klaar ("Startboost
    klaar" op het fruitscherm).
42. Start daarna een gewone poging: nu begin je wel met de boost.

### Engels

43. Tandwiel > Taal > English. Hartjesscherm en winkel: "Price level: round N ...", "Small juice pot", "Big juice pot",
    "Juice doubler 1 h" met "€1.99". Geen Nederlandse woorden in die regels. Zet de taal daarna terug.
