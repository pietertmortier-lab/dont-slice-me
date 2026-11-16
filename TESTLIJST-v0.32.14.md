# Testlijst v0.32.14 - het Mes van de dag korter en harder

Wat er nieuw is (jouw keuzes van 15 november: 1A, 2B en 3A):
- In het Mes van de dag telt de levelbalk klontjes: een gewoon klontje 1, een gouden 2. Een level is 5 klontjes, plus 1 per 10 levels.
- Na een level krijg je maar een halve seconde rust, en de messen worden de hele poging sneller. Na ongeveer 45 seconden komen er ook twee messen tegelijk.
- De prijs voor level 100 haal je niet meer in het Mes van de dag (wel in het gewone spel).

v0.32.14 bevat ook alles van v0.32.13 en ouder. Staat v0.32.12 of v0.32.13 nog niet in de interne test? Dan hoef je die
**niet** apart te uploaden: je mag meteen v0.32.14 uploaden. Lees dan wel eerst stap 0 hieronder.

Gaat iets mis? Stuur een schermafbeelding met het nummer van de stap. Gaat alles goed: "alles ok".

## 0. Eerst: welke versie staat er nu op je telefoon?

0a. Open de app en tik op het **tandwiel**. Onderaan staat de versie.
0b. Staat er **"Versie v0.32.13"**? Ga dan naar stap 1.
0c. Staat er **"Versie v0.32.11"** of **"Versie v0.32.12"**, of heb je v0.32.13 nog niet getest? Dan gelden twee stappen uit
    `TESTLIJST-v0.32.13.md` nog altijd, als je ze nog niet deed:
    - **stap 0**, alleen als je telefoon nog **v0.32.11** heeft (vóór je iets nieuws uploadt: de bewaarde tickets en de
      bestellingen nakijken). Staat er al v0.32.12, dan sla je stap 0 over (die kan alleen op v0.32.11);
    - **stap 14** (de drie ticketproducten `tickets_5`, `tickets_15` en `weekpass` op inactief in Play Console, pas **nadat**
      je zelf hebt bijgewerkt). Dat doe je hieronder bij stap 14.
0d. Staat er nog **"Versie v0.32.10"**? Zet dan eerst v0.32.11 in de interne test met `TESTLIJST-v0.32.11.md`, werk je
    telefoon bij en doe dan stap 0c.

## 1. Bouwen en uploaden (versie 0.32.14)

Er is geen server-update: **geen** `firebase deploy`.

1. Open een opdrachtvenster in de map `dont-slice-me`. Typ `git pull` en druk op Enter.
2. Typ `cd native` en druk op Enter.
3. Typ `npm run sync` en druk op Enter. Wacht tot het klaar is.
4. Open Android Studio. Open `app` > `build.gradle` (Module :app).
5. Zet daar **`versionCode 8`** en **`versionName "0.32.14"`**. (Ook als je v0.32.12 of v0.32.13 oversloeg: 8.)
6. Klik bovenaan op **Sync Now** als die balk verschijnt.
7. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
8. Typ je wachtwoord in Android Studio (dezelfde sleutel als altijd) > **Next**.
9. Kies **release** > **Create**. Je ziet rechtsonder "Generate Signed Bundle: ... successfully".
10. Play Console (log in met `dont.slice.me@gmail.com`): **Testen en releasen** > **Testen** > **Interne test** >
    **Nieuwe release maken**.
11. Sleep `native\android\app\release\app-release.aab` naar **App-bundels**. Je ziet: "8 (0.32.14)".
12. Releaseopmerkingen: vervang alles in het vak door het blok "Voor v0.32.14 in de interne test" uit
    `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`).
13. **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.
14. Alleen als je de drie ticketproducten nog niet op inactief zette (stap 0c): doe dat pas na stap 16 hieronder, met
    `PLAY-CONSOLE-v0.32.12.md` vanaf stap 3. Waar daar "0.32.12" staat, lees je "0.32.14".

## 2. Bijwerken

15. Werk de app bij naar **0.32.14** uit de interne test. Open de app.
16. Tandwiel: onderaan staat **"Versie v0.32.14"**.
17. Alleen als je v0.32.13 nooit testte: doe `TESTLIJST-v0.32.13.md`, stap 17 tot en met 45. Waar daar "0.32.13" staat, lees
    je "0.32.14". Eén uitzondering: het privacybeleid (stap 44 daar) zegt nog altijd "spelversie 0.32.13"; dat klopt, want
    v0.32.14 stuurt of bewaart niets nieuws.

## 3. Mes van de dag: speel het een paar dagen

Neem een klok of de stopwatch van een andere telefoon. Je hebt één poging per dag (om 7 uur 's morgens komt een nieuw mes).
Speel het daarom een paar dagen na elkaar, elke dag één keer, en schrijf telkens je tijden op. Stap 18 tot 23 hoef je maar
één keer te doen; stap 24 tot 28 elke dag.

18. Open **Spelen** > **Dagmes**. Tik bij het Mes van de dag op **Hoe werkt het?** en lees de uitleg. Daar staat nu:
    "de messen komen 20% sneller", "maar een halve seconde rust", "na ongeveer 45 seconden komen er ook twee messen tegelijk", "Een level is 5 klontjes,
    plus 1 per 10 levels; een gouden klontje telt voor 2" en "geen ... prijs voor level 100". Klopt dat met wat je speelt?
19. Start het **Mes van de dag**. Bovenaan staat de regel van vandaag, met daarachter "level 10 · 0/6".
20. Pak een gewoon klontje: de teller gaat **+1** omhoog ("1/6"). Pak een gouden klontje: **+2**.
21. Haal een level. In het midden komt de banner met "**Kort en hard · 6 klontjes nodig**" (vanaf level 20 staat er 7, vanaf
    level 30 staat er 8).
22. Bij elk level hoor je een korte **pling**. Op level **20**, **30** en **40** hoor je het **hele deuntje**; daarna komt de
    keukenmuziek terug. Het deuntje begint nooit opnieuw.
23. Na een level krijg je maar een **halve seconde** rust. De messen gaan daarna **niet** terug naar rustig.
24. Tijd tot **level 20**: ______ (verwacht: ongeveer 1 minuut bij een goede poging).
25. Tijd tot **level 30**: ______ of "niet gehaald" (verwacht: ongeveer 2,5 minuten bij een goede poging).
26. **Twee messen tegelijk**: vanaf ongeveer ______ seconden (verwacht: rond 45 seconden). Hoe vaak daarna:
    af en toe / geregeld / te vaak.
27. Is het vandaag een dag met **Dubbel mes** (de regels staan bovenaan bij de start)? Dan komen er nooit **drie** messen
    tegelijk. (Geen Dubbel mes vandaag? Sla deze stap over.)
28. **Fruit Fever**: hoeveel levels kreeg je erbij tijdens de Fever? ______ (verwacht: 2 à 3).
29. Het **sap** bij een klontje is nog even hoog als vroeger (bijvoorbeeld "+30 sap" tijdens Fruit Fever met combo). Alleen de
    levelbalk telt klontjes.
30. Op het eindscherm staan je tijd, je doelen van vandaag en de deelknop zoals vroeger. Een gehaald doel geeft nog 250 sap,
    alle drie samen nog eens 500 en een Chefstempel.
31. De prijs voor **level 100** (5 hartjes) kan je in het Mes van de dag niet meer halen. Dat hoef je niet te testen (level 100
    haal je daar niet); in het gewone spel blijft die prijs.
32. Tandwiel > **Taal: English**. Open **Play** > **Daily**, tik op **How does it work?** en lees de uitleg in het
    Engels: "half a second of rest", "after about 45 seconds two knives also come at once", "A level is 5 cubes, plus 1 per
    10 levels; a gold cube counts as 2". Ook de uitleg tussen haakjes achter elke regel van vandaag is Engels. Zet de taal
    daarna terug.
33. (Mag je overslaan) Speel op een volgende dag je poging met de taal op English: de banner zegt dan "**Short and sharp ·
    6 cubes needed**". Zet de taal daarna terug.

## 4. Wat vind je ervan? (antwoord met een letter)

Het Mes van de dag is nu veel zwaarder dan vroeger. Dat komt vooral door je keuze 2B (bijna geen rust en de messen blijven
sneller worden). In onze test met de testspelers haalt een goede speler level 30 ongeveer de helft van de keren. Een gemiddelde
speler haalt level 20 meestal en level 30 alleen op een goede dag: veel pogingen gaan dood tussen 1 en 2,5 minuten.

**Vraag 1: hoe zwaar?**
- **A.** Zo laten.
- **B.** De twee messen tegelijk komen later: pas na 60 à 70 seconden in plaats van na 45.
- **C.** Na elk level worden de messen even een beetje trager (de klok van de messen gaat half terug), maar niet helemaal
  rustig zoals vroeger.
- **D.** Terug naar zoals vroeger: anderhalve seconde rust en elk level begint weer rustig (je oude keuze A).

**Vraag 2: hoeveel klontjes?**
Om level 20 rond 1 minuut en level 30 rond 2,5 minuten te krijgen, vallen er in het Mes van de dag nu iets meer klontjes
dan in de eerste versie (één om de 1,1 seconde op level 10, was 1,45 seconde).
- **A.** Zo laten.
- **B.** Terug naar minder klontjes (zoals de eerste versie): je levelt trager en level 30 lukt bijna nooit.

Stuur bijvoorbeeld: "1A 2A" of "1B 2A".
