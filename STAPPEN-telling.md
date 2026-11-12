# Eigen telling (v0.32.8): wat jij één keer moet doen

De server telt vanaf v0.32.8 per dag een paar totalen (actieve spelers app/web, nieuwe spelers, pogingen, hoogste level,
toernooirondes, duels, vriendenduels, live duels, vriendschappen, gemelde aankopen). Geen Google Analytics, geen gegevens
per speler. Jij bekijkt ze op een privépagina waar je inlogt met je Google-account dont.slice.me@gmail.com.

## Stap 1: inloggen met Google aanzetten (één keer)

1. Ga naar https://console.firebase.google.com en log in met **dont.slice.me@gmail.com**.
2. Klik op het project **dont-slice-me**.
3. Links in het menu: **Build** > **Authentication** (in het Nederlands: **Verificatie**).
4. Bovenaan het tabblad **Sign-in method** (**Inlogmethode**).
5. Klik op **Add new provider** (**Nieuwe provider toevoegen**) en kies **Google**.
6. Zet de schakelaar **Enable** (**Inschakelen**) aan.
7. Bij **Project support email** (**E-mailadres voor projectondersteuning**) kies je **dont.slice.me@gmail.com**.
8. Klik op **Save** (**Opslaan**).
   "Anonymous" (Anoniem) blijft gewoon aan staan: die gebruikt het spel zelf.

## Stap 2: controleren dat GitHub Pages mag inloggen (één keer)

1. Nog steeds in **Authentication**: tabblad **Settings** (**Instellingen**) > **Authorized domains** (**Geautoriseerde domeinen**).
2. Staat **pietertmortier-lab.github.io** in de lijst? Dan is het goed.
3. Staat het er niet: klik **Add domain** (**Domein toevoegen**), typ `pietertmortier-lab.github.io` en klik **Add** (**Toevoegen**).

## Stap 3: de server en de regels bijwerken

In de map `native/tourney` (zoals altijd bij een serverupdate):

```
firebase deploy --only functions,firestore
```

Dat zet de nieuwe server (die telt) én de nieuwe Firestore-regels online (alleen jouw Google-account mag de totalen lezen;
niemand kan ze schrijven behalve de server zelf).

## Stap 4: de pagina openen

Na het uitrollen van v0.32.8 staat de pagina hier:

**https://pietertmortier-lab.github.io/dont-slice-me/stats.html**

Tik op **Inloggen met Google** en kies **dont.slice.me@gmail.com**. Je blijft ingelogd op dat toestel; met **Uitloggen**
stop je. Wie een ander account kiest, ziet alleen "Geen toegang". De pagina staat niet in Google (noindex) en er staat
nergens een link naar.

## Goed om te weten

- De telling begint pas na stap 3. De eerste dag is dus maar een deel van een dag.
- Een dag loopt van middernacht tot middernacht in UTC: in België van 01:00 tot 01:00 (in de zomer van 02:00 tot 02:00).
- Alleen spelers met een spelersnaam praten met de server; wie nooit een naam koos (nooit Toernooi of Vrienden opende),
  wordt niet geteld. De echte aantallen downloads staan in de Google Play Console.
- Spelers met een oudere versie dan v0.32.8 tellen als "onbekend" (niet app, niet web) tot ze bijwerken.
- Aankopen: de server telt alleen wat de app zelf meldt: vanaf v0.32.9 meldt de app elke aankoop via Google Play één keer
  (alleen welk product, geen bedrag), samen met de online opslag. Een speler zonder spelersnaam meldt niets, en een
  terugbetaling wordt niet afgetrokken. De echte verkoop zie je in de Google Play Console (en in RevenueCat).
- Het dagmes en filmpjes voor beloningen gebeuren alleen op het toestel; die telt de server niet.
- De privacyverklaring (punt 11) zegt nu precies dit: geen analysediensten, alleen dagtotalen.
