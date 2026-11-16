# Testlijst v0.32.16 - Engelse woorden tijdens het spel, de prijsregel vanaf level 151 en de levelbanner

Wat er nieuw is (kleine verbeteringen na v0.32.15):
- Speel je in het Engels, dan zijn nu ook de woordjes boven je fruit tijdens het spel Engels (bijvoorbeeld "Split in two!" in
  plaats van "In twee!"). Ook in het live duel, bij het fruit van je vriend.
- Vanaf level 151 zegt de prijsregel niet meer "ronde 6 en verder", maar "het hoogste" prijsniveau. Geen enkele prijs is veranderd.
- De lange regel in de levelbanner op level 151 ("Nieuwe keuken: Houten plank · ronde 6: Feestkeuken") raakt de randen van het
  scherm niet meer.

**v0.32.16 bevat alles van v0.32.15, v0.32.14, v0.32.13 en v0.32.12.** Je uploadt alleen deze nieuwste versie. Staat een van die
oudere versies nog niet in de interne test? Dan hoef je ze **niet** apart te uploaden. Wat bij die oudere versies nog te doen
was, geldt wel nog altijd, als je het nog niet deed. Stap 0 hieronder zegt wat.

Er is geen server-update: **geen** `firebase deploy`.

Gaat iets mis? Stuur een schermafbeelding met het nummer van de stap. Gaat alles goed: "alles ok". Ik label niets als af voor
jij het gespeeld hebt.

## 0. Eerst: welke versie staat er nu op je telefoon?

0a. Open de app en tik op het **tandwiel**. Onderaan staat de versie.
0b. Staat er **"Versie v0.32.15"** en deed je `TESTLIJST-v0.32.15.md`, deel 3 (Play Console) al? Ga dan naar stap 1.
0c. Staat er **"Versie v0.32.15"** of **"Versie v0.32.14"**, maar deed je deel 3 van `TESTLIJST-v0.32.15.md` nog niet? Dan
    doe je dat deel **na** de upload, bij stap 17 hieronder (de namen van de twee sappotten en de verdubbelaar op € 1,99,
    uit `PLAY-CONSOLE-v0.32.15.md`).
0d. Staat er **"Versie v0.32.11"**, **"Versie v0.32.12"** of **"Versie v0.32.13"**? Dan gelden ook twee stappen uit
    `TESTLIJST-v0.32.13.md` nog altijd, als je ze nog niet deed:
    - **stap 0**, alleen als je telefoon nog **v0.32.11** heeft. Doe die **nu**, vóór je iets nieuws uploadt (de bewaarde
      tickets en de bestellingen nakijken). Staat er al v0.32.12 of nieuwer, dan sla je stap 0 over (die kan alleen op v0.32.11);
    - **stap 14** (de drie ticketproducten `tickets_5`, `tickets_15` en `weekpass` op inactief in Play Console, pas **nadat**
      je zelf hebt bijgewerkt). Dat doe je hieronder bij stap 17.
    En deel 3 van `TESTLIJST-v0.32.15.md` doe je dan ook, bij stap 17.
0e. Staat er nog **"Versie v0.32.10"**? Zet dan eerst v0.32.11 in de interne test met `TESTLIJST-v0.32.11.md`, werk je
    telefoon bij en doe dan stap 0d.

## 1. Bouwen en uploaden (versie 0.32.16)

1. Open een opdrachtvenster in de map `dont-slice-me`. Typ `git pull` en druk op Enter.
2. Typ `cd native` en druk op Enter.
3. Typ `npm run sync` en druk op Enter. Wacht tot het klaar is. (Dit is nodig: `index.html` is veranderd. Zonder deze stap zit
   de oude `index.html` in de app.)
4. Open Android Studio. Open `app` > `build.gradle` (Module :app).
5. Zet daar **`versionCode 10`** en **`versionName "0.32.16"`**. (Ook als je een of meer oudere versies oversloeg: 10.)
6. Klik bovenaan op **Sync Now** als die balk verschijnt.
7. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
8. Typ je wachtwoord in Android Studio (dezelfde sleutel als altijd) > **Next**.
9. Kies **release** > **Create**. Je ziet rechtsonder "Generate Signed Bundle: ... successfully".
10. Play Console (log in met `dont.slice.me@gmail.com`): **Testen en releasen** > **Testen** > **Interne test** >
    **Nieuwe release maken**.
11. Sleep `native\android\app\release\app-release.aab` naar **App-bundels**. Je ziet: "10 (0.32.16)".
12. Releaseopmerkingen: vervang alles in het vak door het blok "Voor v0.32.16 in de interne test" uit
    `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`).
13. **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.

## 2. Bijwerken

14. Werk de app bij naar **0.32.16** uit de interne test. Open de app.
15. Tandwiel: onderaan staat **"Versie v0.32.16"**.
16. Alleen als je v0.32.15 nooit testte: doe `TESTLIJST-v0.32.15.md`, deel 4 (de sapprijzen in het spel). Eén verschil: vanaf
    level 151 staat er nu "Prijsniveau: het hoogste (level 151 en hoger). Duurder wordt het niet meer." (stap 27 daar zegt
    nog "... en verder ..."). Dat test je ook hieronder, bij stap 27. Testte je v0.32.14 of v0.32.13 nooit: zie stap 16 en 17
    van `TESTLIJST-v0.32.15.md`.

## 3. Play Console (alleen wat nog niet gedaan is; pas nu: na de upload en nadat je zelf bijwerkte)

17. Deed je deel 3 van `TESTLIJST-v0.32.15.md` (stap 18 tot en met 24) nog niet? Doe het nu. Waar daar "0.32.15" staat, lees
    je "0.32.16". Daarin staan:
    - de drie ticketproducten op inactief (alleen als dat nog niet gedaan is, stap 0d);
    - de nieuwe namen van de twee sappotten: `sap_3000` wordt "Kleine sappot", `sap_10000` wordt "Grote sappot";
    - de sapverdubbelaar `doubler_1h` op **€ 1,99** (en bij België en Nederland zelf € 1,99 invullen).
    Alle details staan in `PLAY-CONSOLE-v0.32.15.md`. Deed je het al, dan hoeft hier niets.

## 4. Engelse woorden tijdens het spel

18. Tandwiel > **Taal** > **English**.
19. Speel met **Watermelon** (Watermeloen) en laat je één keer raken. Boven je fruit staat **"Split in two!"**.
20. Speel met **Orange** (Sinaasappel) en laat je één keer raken: **"Segment lost!"**.
21. Speel met **Cherries** (Kersen) en laat je één keer raken: **"One cherry down!"**.
22. Speel met **Plum** (Pruim) en blijf een tijdje leven. Als je kleiner wordt, staat er **"Shrunk!"**.
23. Speel met **Strawberry** (Aardbei) en pak 10 klontjes in één poging: bij het 10e staat **"Seed planted"**.
    Heb je een van die fruitsoorten niet? Sla die stap over.
24. Alleen in een weekend met het weekendspel **You are the knife** (Jij bent het mes; vrijdag 17 uur tot zondag 23 uur, niet
    elk weekend hetzelfde spel): snijd twee fruitjes met één veeg: **"2 at once! +3"**. Alleen als je de **Rainbow kiwi** (Regenboogkiwi) hebt: bij een trucje
    staat "Rainbow: peel", "Rainbow: magnet", "Rainbow: syrup" of "Rainbow: small". Nergens nog een Nederlands woord.
25. **Live vriendenduel** met een tweede telefoon (bijvoorbeeld die van iemand die meespeelt). Jouw telefoon staat op English, de andere
    mag op Nederlands blijven. De ander kiest Watermeloen (of Sinaasappel, Kersen of Pruim) en laat zich één keer raken.
    - Op **jouw** telefoon staat boven het fruit van de ander **"Split in two!"** (of "Segment lost!", "One cherry down!",
      "Shrunk!").
    - Op de **andere** telefoon (Nederlands) staat bij hetzelfde moment **"In twee!"**. Elke telefoon toont de woordjes in zijn
      eigen taal.
26. Zet de taal terug op Nederlands en speel even: daar staan nog altijd de Nederlandse woordjes ("In twee!", "Partje kwijt!",
    "Eén kers minder!", "Gekrompen!", "Zaadje geplant").

## 5. De prijsregel vanaf level 151 (alleen als je hoogste level 151 of hoger is)

27. Open het hartjesscherm (tik op je hartjes). Onder "Prijs met sap: ..." staat **"Prijsniveau: het hoogste (level 151 en
    hoger). Duurder wordt het niet meer."** Er staat geen "ronde 6" meer.
28. **Winkel**: bovenaan elk subtabblad (Aanbod, Spullen, Sap) staat dezelfde regel.
29. De prijzen zijn dezelfde als in v0.32.15: een hartje 5.000 sap (het 4e van de dag 6.500, het 5e 8.500), een startboost
    2.500, het Reeksschild 5.000, de verdubbelaar met sap 60.000, de Kleine sappot 30.000 sap, de Grote sappot 100.000 sap.
30. Tandwiel > Taal > English: daar staat **"Price level: the highest (level 151 and up). Prices go no higher."** Zet de taal
    daarna terug.
    (Het uitlegkaartje zie je alleen als je het nog nooit zag. Zie je het toch, dan staat er "Jij zit op het hoogste
    prijsniveau (level 151 en hoger)".)

Is je hoogste level lager dan 151? Sla deel 5 en 6 over; ik testte ze automatisch.

## 6. De levelbanner op level 151 op een kleine telefoon (alleen als je hoogste level 151 of hoger is)

Gebruik de kleinste telefoon die je hebt.

31. Op het beginscherm, bij **"Start op level"**: zet het level met **−** op **150** (één tik is één level lager). Tik **Spelen**.
32. Speel tot je level 151 haalt. In de banner staat onder "Level 151" de regel **"Nieuwe keuken: Houten plank · ronde 6:
    Feestkeuken"**.
33. Die regel staat helemaal in beeld, met links en rechts wat ruimte. Hij mag een beetje kleiner zijn dan de andere regels.
    Er valt geen letter weg aan de rand.
34. Haal je ook level 181 (start op 180): daar staat "... ronde 7: Feestkeuken", ook helemaal in beeld.
35. Hetzelfde in het Engels (Tandwiel > Taal > English): **"New kitchen: Wooden board · round 6: Party kitchen"** past ook.
    Zet de taal daarna terug.
