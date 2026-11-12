# Testlijst v0.32.9 - account verwijderen, melden en blokkeren, voorwaarden, Plus via Google Play, eerlijke duels, uitnodigen via Google Play

Volgorde: eerst de server en de regels (Pieter: `firebase deploy --only functions,firestore` in `native/tourney`), dan
de nieuwe app (versionCode 3, versionName 0.32.9) in de interne test. Je hebt twee telefoons nodig (A en B), elk met
de app uit de Play-test, een eigen spelersnaam, en liefst al vrienden. Tandwiel: onderaan staat "Versie v0.32.9".

Tekens bij elke stap:
- **[S]** werkt pas als de nieuwe server online staat.
- **[A]** heeft de nieuwe app 0.32.9 nodig (uit de Play-test; de website is niet genoeg).
- **[S+A]** heeft allebei nodig.

Gaat iets mis? Stuur een schermafbeelding met het nummer. Gaat alles goed: "alles ok".
Gebruik voor stap 33 tot 40 een testaccount dat je mag kwijtraken: dat account wordt echt gewist.

**Algemeen**
1. [A] Tandwiel: onderaan staat **Versie v0.32.9**.
2. [A] In het tandwiel staan onder elkaar: **Privacybeleid** (en eventueel **Privacy en advertenties**), de rode knop **Account verwijderen**, dan **Voorwaarden** en **Geblokkeerde spelers**.
3. [A] Tik **Voorwaarden**: de pagina met de regels opent in je browser (punten 1 tot 7). Zet het spel op English en tik **Terms**: de Engelse versie.
4. [A] Hulp (tandwiel, onderaan bij de onderwerpen): er is een onderwerp **Spelregels en voorwaarden** met dezelfde link.

**Spelersnamen, melden en blokkeren**
5. [S+A] Telefoon B: in het naamvak staat "Kies een gewone naam. Met Klaar ga je akkoord met de spelregels." met de link **Spelregels** (opent de regels). Kies als spelersnaam een scheldwoord, ook eentje met cijfers erachter (zoals Kut123). Je krijgt de vraag om een andere naam te kiezen; op telefoon A zie je B als **Speler**.
6. [S+A] Telefoon B: kies daarna een gewone naam. Op A staat binnen een minuut (of na Vrienden openen) weer de nieuwe naam.
7. [S+A] Telefoon A, Vrienden > Vrienden: naast B staat een knopje **⋯**. Tik erop: het menu **Meld of blokkeer** opent. Sluit het met Sluiten, met een tik ernaast en met de terugknop van Android.
8. [S+A] A: **⋯** > **Meld deze naam** > kies een reden. Je ziet een bedankje. Meld je opnieuw, dan zegt het spel dat je deze naam al meldde.
9. [S+A] Zoek bij Vrienden een andere speler op naam: ook bij het zoekresultaat staat **⋯**. Ook bij een verzoek dat je stuurde of kreeg, bij Duels en bij Rivalen.
10. [S+A] A: **⋯** bij B > **Blokkeer**. Beantwoord de vraag met ja. B verdwijnt meteen uit je vriendenlijst; in het tandwiel staat **Geblokkeerde spelers (1)**.
11. [S+A] B probeert A opnieuw toe te voegen (met A's vriendencode of door te zoeken): het lukt niet (B ziet niet dat hij geblokkeerd is: "onbekend").
12. [S+A] B probeert A uit te dagen of uit te nodigen voor een live duel: dat kan niet meer (A staat niet meer in B's vriendenlijst).
13. [S+A] A: tandwiel > **Geblokkeerde spelers** > **Deblokkeer** bij B. De lijst is leeg. Jullie zijn niet vanzelf weer vrienden: voeg elkaar opnieuw toe.
14. [S+A] Speel een openbaar duel tegen een schim (Vrienden > Duels > Speel). Op het eindscherm staat een knop **Meld of blokkeer** met de naam van die speler (niet bij De Chef of een oefenbot).
15. [A] Zet vliegtuigmodus aan en tik **⋯**: het spel zegt dat melden en blokkeren kan zodra je online bent.

**Eerlijke duels en fruitmanden**
16. [S+A] Vrienden > Duels: onder **Speel** staat **Duelfruit: ...** met de knop **Kies fruit**. Kies een fruit dat je nog **niet** hebt (bijvoorbeeld Kersen) en speel een openbaar duel: je speelt met dat fruit.
17. [S+A] Na het duel staat er "Jij speelde met Kersen (geleend). ... speelde met ...". Je eigen fruit voor gewone pogingen is niet veranderd en Kersen is niet van jou geworden (kijk bij Verzamel > Fruit).
18. [S+A] Daag een vriend uit (open zijn kaartje > Daag uit). In de vraag "... uitdagen?" staat "Je speelt met ... (geleend)." en de knop **Ander fruit**. De vriend speelt de uitdaging; bij allebei staat na het duel met welk fruit jullie speelden.
19. [S+A] Een vriend met de oude app 0.32.8 (als je die nog hebt): een duel en een uitdaging tegen hem lukken gewoon; hij speelt met zijn eigen fruit.
20. [A] Winkel > Aanbod > Fruitmanden op een laag level (bijvoorbeeld level 10): bij **Alles-in-één** staat "Nu 4, de andere 15 zodra je hun level haalt." (de getallen hangen af van je level). Koop je hem (testaankoop), dan krijg je alleen fruit tot je level; de rest staat in de winkel als **Al betaald, komt vanzelf**.
21. [A] Haal daarna een level waarop zo'n fruit vrijkomt: tijdens de poging staat er "Uit je fruitmand: ... is nu van jou!". Bij Verzamel > Fruit staat bij het fruit dat nog wacht "Level ... · betaald".

**Plus via Google Play (alleen de app)**
22. [A] Winkel > Aanbod > Plus, zonder Plus: twee knoppen **Maand · €2,99** en **Jaar · €19,99** (met de prijs die Google Play toont), eronder hoe Plus verlengt en hoe je opzegt, en de links **Voorwaarden** en **Privacybeleid**. Er staat geen knop Opzeggen en geen "+1 maand".
23. [A] Neem Plus met een testaccount (Maand). Na de aankoop staat er **· actief**, "Google Play verlengt je Plus op ..." en één knop **Beheren in Google Play**.
24. [A] Tik **Beheren in Google Play**: je abonnement opent in Google Play. Zeg het daar op en kom terug in het spel: er staat "Je Plus loopt tot ... en verlengt niet meer." (sluit het spel helemaal en open het opnieuw als je het niet meteen ziet).
25. [A] Tweede toestel met hetzelfde Google-account: tandwiel of winkel > **Aankopen herstellen**: "Aankopen hersteld" en Plus staat actief met dezelfde einddatum.
26. [A] Zet vliegtuigmodus aan en open het spel: Plus blijft zoals het was (er verandert niets zonder internet).
27. [S] Pieter: open stats.html de dag na de testaankoop. Bij **gemelde aankopen** staat plus_month (alleen de productnaam, geen bedrag).
28. Op de website (pc-browser) is de Plus-kaart zoals vroeger ("In de app te koop").

**Uitnodigen via Google Play**
29. [A] Vrienden > Vrienden > **Deel uitnodiging**: de tekst bevat een link naar **play.google.com** (met je code), niet meer naar de website. Ook delen na een poging en het dagmes delen geven een Google Play-link.
30. [S+A] Telefoon B zonder de app (of: verwijder de app op B; let op, dan begin je daar opnieuw): tik op de uitnodiging van A, installeer de app via Google Play en open ze. Bij het kiezen van een naam staat "**A** nodigde je uit". Na **Klaar** komt "**Je bent nu vrienden met A!**". (Alleen testers kunnen de Play-pagina openen zolang de app in de test staat.)
31. [A] Sluit de app op B en open ze opnieuw: er gebeurt niets meer met die uitnodiging.
32. [S+A] In de app op een toestel waar je nog niet speelde: op het introscherm, bij Vrienden of bij Hulp staat **Al gespeeld in de browser? Zet je spel over met je code**. Maak in de browser een koppelcode (Hulp > **Je voortgang meenemen**), typ hem in de app: je level, sap en vrienden uit de browser staan in de app. Had je in de app al meer sap dan in de browser, dan houd je het grootste bedrag.

**Account verwijderen (met een testaccount)**
33. [A] Tandwiel > **Account verwijderen**: een kaart met wat er weggaat en wat blijft. **Annuleer** en de terugknop sluiten ze zonder iets te doen.
34. [A] **Verder**: "Typ je spelersnaam (...) om te bevestigen, of wacht 3 seconden." De rode knop telt 3-2-1. Met Plus-tekst en de knop **Plus opzeggen in Google Play** (in de app).
35. [S+A] Zet vliegtuigmodus aan en verwijder: "Verwijderen lukte niet" met "Er is niets gewist op dit toestel". Alles staat er nog.
36. [S+A] Vliegtuigmodus uit, **Probeer opnieuw**: even "Even geduld…", daarna start het spel opnieuw als nieuwe speler met de kaart **Je account is verwijderd**.
37. [S+A] Op telefoon A (vriend van het gewiste account): na Vrienden openen staat die speler niet meer in de lijst, ook niet bij Duels.
38. [S+A] Had het gewiste account een gekoppeld tweede toestel: open daar het spel. Er staat **Je account is verwijderd** met **Wis en begin opnieuw** en **Later**. Tik **Later** en speel even: op telefoon A verschijnt die speler niet opnieuw (ook niet na een uur).
39. [S+A] Was het gewiste account ooit via een uitnodiging binnengekomen: na het verwijderen en een nieuwe naam word je **niet** opnieuw vanzelf vrienden met wie je toen uitnodigde.
40. [A] Een speler zonder naam (net geïnstalleerd): tandwiel > Account verwijderen zegt **Geen account op de server**, met de rode knop **Wis dit toestel**.

**Oudere spelers en de website**
41. Een oude opslag (iemand die al lang speelt) opent gewoon: level, sap, fruit en vrienden zijn er nog.
42. Op de website (pc-browser, de oude link) staat één keer per dag de kaart **Speel verder in de app** met een link naar Google Play en een koppelcode; je kunt ze sluiten, ook met de terugknop van je telefoon (je blijft in het spel). Zolang de app nog in de test staat, zegt de kaart hoe je testspeler wordt.
