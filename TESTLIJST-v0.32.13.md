# Testlijst v0.32.13 - je tegenspeler zoals die zichzelf ziet, het fruitvenster en het deuntje

Wat er nieuw is (jouw wensen van 15 november):
- In een live vriendenduel zie je je tegenspeler zoals die zichzelf ziet (de twee meloenhelften, krimpen, bonussen, ...).
- Tik je op een fruit, dan opent onderaan een venster met de uitleg en de knop Koop of Kies.
- Het Level Complete-deuntje begint nooit meer opnieuw.

v0.32.13 bevat ook alles van v0.32.12. Je hoeft v0.32.12 **niet** apart te uploaden: je mag meteen v0.32.13 uploaden.

Gaat iets mis? Stuur een schermafbeelding met het nummer van de stap. Gaat alles goed: "alles ok".

## 0. Eerst, nog op v0.32.11 (vóór je iets nieuws uploadt)

Doe dit vóór je een nieuwe versie in de interne test zet. Daarna kan het niet meer: je telefoon (en die van je vriendin)
kan de nieuwe versie vanzelf binnenhalen, en dan zijn de bewaarde tickets en de Weekpas van v0.32.11 al sap geworden.

Staat v0.32.11 nog niet in de interne test (je telefoon toont bij het tandwiel nog "Versie v0.32.10")? Zet dan eerst v0.32.11 erin
met `TESTLIJST-v0.32.11.md` en werk je telefoon bij. Pas dan stap 0a.

0a. Doe op je telefoon met v0.32.11 `TESTLIJST-v0.32.12.md`, stap 0 (0a tot en met 0e, 0e mag je overslaan).
0b. Doe `PLAY-CONSOLE-v0.32.12.md`, stap 0 (de bestellingen nakijken).

## 1. Bouwen en uploaden (versie 0.32.13)

Er is geen server-update: **geen** `firebase deploy`.

1. Open een opdrachtvenster in de map `dont-slice-me`. Typ `git pull` en druk op Enter.
2. Typ `cd native` en druk op Enter.
3. Typ `npm run sync` en druk op Enter. Wacht tot het klaar is.
4. Open Android Studio. Open `app` > `build.gradle` (Module :app).
5. Zet daar **`versionCode 7`** en **`versionName "0.32.13"`**. (Ook als je v0.32.12 oversloeg: 7.)
6. Klik bovenaan op **Sync Now** als die balk verschijnt.
7. **Build** > **Generate Signed App Bundle or APK** > kies **Android App Bundle** > **Next**.
8. Typ je wachtwoord in Android Studio (dezelfde sleutel als altijd) > **Next**.
9. Kies **release** > **Create**. Je ziet rechtsonder "Generate Signed Bundle: ... successfully".
10. Play Console (log in met `dont.slice.me@gmail.com`): **Testen en releasen** > **Testen** > **Interne test** >
    **Nieuwe release maken**.
11. Sleep `native\android\app\release\app-release.aab` naar **App-bundels**. Je ziet: "7 (0.32.13)".
12. Releaseopmerkingen: vervang alles in het vak door het blok "Voor v0.32.13 in de interne test" uit
    `store/winkelteksten.md` (van `<nl-NL>` tot en met `</en-US>`).
13. **Volgende** > **Opslaan en publiceren**. Wacht tot er "Beschikbaar voor interne testers" staat.
14. Daarna gelden de stappen van `PLAY-CONSOLE-v0.32.12.md` vanaf stap 3 nog altijd, voor deze upload. Waar daar "0.32.12"
    staat, lees je "0.32.13". Belangrijk: zet `tickets_5`, `tickets_15` en `weekpass` pas op inactief (stap 4) **nadat** je zelf
    hebt bijgewerkt en stap 15 tot 17 hieronder deed.

## 2. Bijwerken en de punten van v0.32.12

15. Werk de app bij naar **0.32.13** uit de interne test. Open de app.
16. Tandwiel: onderaan staat **"Versie v0.32.13"**.
17. Doe `TESTLIJST-v0.32.12.md`, stap 3 tot en met 27. Waar daar "0.32.12" staat, lees je "0.32.13". Stap 26 daar (de tickets
    op inactief) is dezelfde als stap 14 hierboven: doe ze één keer. Eén uitzondering: bij
    stap 24b staat bovenaan het privacybeleid nu "Laatst bijgewerkt: 16 november 2026 (spelversie 0.32.13" (zie stap 44 hieronder).

## 3. Live vriendenduel: je tegenspeler zoals die zichzelf ziet

Je hebt de telefoon van je vriendin nodig. **Allebei** moeten jullie 0.32.13 hebben (tandwiel: "Versie v0.32.13").
Leg de twee telefoons naast elkaar, zodat je beide schermen tegelijk ziet. Links haar eigen scherm, rechts het jouwe: op
het jouwe moet haar fruit er hetzelfde uitzien (alleen een beetje doorzichtig, met haar naam en de lichtblauwe ring).

18. Nodig je vriendin uit voor een live duel. In de lobby kiest zij **Watermeloen**. Tik allebei **Klaar**.
19. Laat haar één keer geraakt worden. Op haar scherm valt de meloen in **twee helften** en wordt breder. Kijk op jouw
    scherm: ook twee helften, even breed.
20. Na die snee **knippert** haar fruit even. Kijk: het knippert ook op jouw scherm (iets zwakker, want doorzichtig).
21. Boven haar fruit staat op jouw scherm haar eigen woord ("In twee!"), **niet** meer het blauwe "-1". Je ziet ook het sap
    wegspatten.
22. Laat haar de bonus **Krimp** pakken. Kijk: op jouw scherm wordt ze even klein en na ongeveer 10 seconden weer groot.
23. Laat haar een **Schild** pakken: je ziet de bel rond haar fruit. Een **Magneet**: de ring met streepjes. **Dubbel sap**:
    de drie stipjes. Kijk telkens of het er bij jou hetzelfde uitziet als bij haar.
24. Laat haar in **Fruit Fever** komen: je ziet de gloed rond haar fruit.
25. Laat haar zo vaak geraakt worden dat ze **gesneden** is. Kijk: op jouw scherm vliegen de stukken, de ogen, de zonnebril
    en de pitjes weg, zoals op haar scherm. Daarna staat er "... is gesneden na ... s", zoals vroeger.
26. Speel een tweede duel; zij kiest **Kersen**. Laat haar één kers verliezen: op jouw scherm zie je nog één kers.
27. Een derde duel; zij kiest **Banaan**. Laat haar geraakt worden: je ziet de **drie draaiende stukjes** banaan.
28. (Mag je overslaan) Probeer ook Avocado (de pit na een snee), Sinaasappel (een partje minder) en Ananas of Kokosnoot
    (barstjes).
29. Doe stap 18 tot 25 nog eens andersom: jij speelt, zij kijkt naar jouw fruit op haar scherm.
30. Wat je **niet** overgenomen ziet, en dat is zo bedoeld: haar vlekken op de vloer, het flitsen en schudden van haar
    scherm, haar geluiden en het lokaas van de Mandarijn.
31. Ziet iets er anders uit? Maak op **beide** telefoons tegelijk een schermafbeelding en stuur ze met het nummer van de stap.
32. Bekend, geen fout: speelt je vriendin nog met v0.32.12 of ouder, dan zie je haar zoals vroeger, en pakt ze Krimp, dan zie
    je haar op gewone grootte. Dat verdwijnt zodra jullie allebei v0.32.13 hebben.

## 4. Het fruitvenster

33. Open **Verzamel** > **Fruit**. Scrol een eind naar beneden in de lijst.
34. Tik op **Sinaasappel**. Onderaan schuift een venster omhoog met de prent, de naam, de voordelen, je niveau en de knop
    **Koop** (of **Kies** als je hem al hebt). Je hoeft niet naar boven te scrollen.
35. Tik op het **kruisje** rechtsboven. Het venster sluit; de lijst staat nog op dezelfde plek.
36. Tik op een ander fruit. Tik daarna **naast** het venster (boven de lijst). Het venster sluit.
37. Tik op een fruit. Druk op de **terugknop** van je telefoon. Het venster sluit. Druk nog eens: je gaat naar Spelen,
    zoals vroeger.
38. Tik op een fruit dat je kunt kopen en tik **Koop**: je gaat naar Spelen met het kaartje "Nieuw fruit", zoals vroeger.
39. Tik op een fruit dat je al hebt en tik **Kies**: je speelt nu met dat fruit.
40. (Alleen met Plus) Tik op het Plus-fruit van de maand en tik **Houden**: het kaartje "Voorgoed van jou" staat **boven** het
    venster; het venster wordt erachter donkerder. Druk op terug: eerst gaat het kaartje weg, dan het venster.
41. Tik twee keer snel op een fruit: het venster blijft open (het gaat niet meteen weer dicht).
42. (Mag je overslaan) Een fruit met een lange uitleg (bijvoorbeeld de Mispel): scrol in het venster. De knop onderaan en
    het kruisje bovenaan blijven in beeld.

## 5. Het deuntje

43. Speel gewoon (niet het Mes van de dag). Haal twee levels kort na elkaar. Bij het tweede level begint het deuntje **niet**
    opnieuw: je hoort een korte pling en het deuntje speelt gewoon verder. Daarna komt de keukenmuziek terug.
43b. Druk op de thuisknop van je telefoon terwijl het deuntje speelt (de app gaat op de achtergrond). Wacht 15 seconden: je
    hoort geen muziek. Open de app weer: de keukenmuziek speelt weer.
43c. Speel het **Mes van de dag**: bij elk level een korte pling, en op level 20, 30, 40, ... het hele deuntje. Ook daar
    begint het nooit opnieuw.

## 6. Privacybeleid en Engels

44. Tandwiel > **Privacybeleid**: bovenaan "Laatst bijgewerkt: 16 november 2026 (spelversie 0.32.13". Bij "Live beeld" staat:
    "Vanaf spelversie 0.32.13 stuurt je app daarbij ook hoe je fruit eruitziet (de vorm na een snee, gekrompen of niet, welke
    bonus, welke kant het op kijkt en draait) ...". (De pagina komt van de website: NIET NAGEKEKEN of die al bijgewerkt is
    wanneer jij test.)
45. Tandwiel > **Taal: English**. Open **Fruit** en tik op **Orange**: het venster toont "Buy · 2,300 juice" (of "Choose") en
    het kruisje heet "Close". Geen Nederlandse woorden. Zet de taal daarna terug.
