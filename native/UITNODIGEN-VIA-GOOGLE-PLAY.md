# Uitnodigen via Google Play (v0.32.9)

Vanaf v0.32.9 gaat elke link die een speler deelt naar de Google Play-pagina van de app, niet meer naar de webversie:

    https://play.google.com/store/apps/details?id=com.dontsliceme.app&referrer=f%3DK7F4QX

`f=K7F4QX` is de vriendencode van wie deelt. Google Play onthoudt dat stukje en geeft het na de installatie aan de app
("install referrer"). Bij de eerste start leest de app het één keer, vraagt een naam ("Lotte nodigde je uit: kies een naam en jullie
zijn meteen vrienden") en maakt de vriendschap, met de kaart "Je bent nu vrienden met Lotte!".

## Wat jij op je pc moet doen (één keer)

Daarvoor is één nieuwe plugin nodig: `@capawesome/capacitor-install-referrer` (versie 0.1.2, gratis, MIT-licentie). Hij staat al in
`native/package.json`. De map `android` staat alleen op jouw pc, dus:

1. Zet de nieuwe bestanden van v0.32.9 in je projectmap (zoals altijd).
2. Open een terminal in de map `native` en typ:

       npm install
       npm run sync

   (`npm run sync` kopieert het spel naar `www` en doet daarna `npx cap sync android`. Je mag ook `npx cap sync android` los doen na
   `npm run www`.)
3. Open Android Studio (`npm run open`), verhoog `versionCode` (en `versionName` naar 0.32.9) in `android/app/build.gradle`, bouw de
   app-bundel en zet hem in de interne test zoals de vorige keer.

Er komt geen nieuwe toestemming bij die de speler moet goedkeuren. De plugin gebruikt de officiële Google-bibliotheek
`com.android.installreferrer:installreferrer:2.2`.

## Server

De server krijgt een kleine nieuwe actie `invitepeek` (de naam van wie uitnodigde, zodat de app "Lotte nodigde je uit" kan tonen).
Zet de server dus ook online:

    cd native/tourney
    firebase deploy --only functions

De Firestore-regels veranderen niet.

## Goed om te weten

- De install referrer werkt alleen als de app via Google Play geïnstalleerd wordt. Zolang de app in de interne of gesloten test staat,
  kunnen alleen testers de Play-pagina openen. Iemand die geen tester is en op de link tikt, ziet "niet gevonden" tot de app openbaar is.
- Wie de app al heeft, typt gewoon de code (staat ook in de uitnodiging: "of typ mijn code K7F-4QX bij Vrienden").
- Oude uitnodigingslinks naar de webversie (`?f=...`) blijven werken voor wie ze nog opent.
- De webversie blijft bestaan voor wie er al speelt. Daar staat een kaart "Speel verder in de app" met de knop naar Google Play en een
  koppelcode. In de app zet de speler zijn spel over met "Al gespeeld in de browser? Zet je spel over met je code".
- Een oude app zonder de plugin doet gewoon niets met de referrer (geen fout).

## Zelf testen (kan pas met de nieuwe app in Google Play)

1. Deel vanuit de app (Vrienden > Deel uitnodiging) een uitnodiging naar een tweede toestel met een testaccount dat de app nog niet heeft.
2. Tik op de link op dat toestel: de Play-pagina opent. Installeer en open de app.
3. Het spel vraagt een naam met de regel "... nodigde je uit". Na "Klaar" zie je "Je bent nu vrienden met ...".
4. Sluit de app en open opnieuw: niets meer (één keer per installatie).
