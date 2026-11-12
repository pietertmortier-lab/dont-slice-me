# Play Console: de formulieren van "App-content", klik voor klik

*Voor Don't Slice Me! v0.32.6, pakketnaam `com.dontsliceme.app` (app aangemaakt op 10 november 2026, standaardtaal
Engels (VS)). Geschreven op 10 november 2026.*

Je vindt al deze formulieren in Play Console op de pagina **App-content** (ingelogd als `dont.slice.me@gmail.com`):
`https://play.google.com/console/u/2/developers/4671644808703726207/app/4972954736761844619/app-content/overview`
Of via het **Dashboard** > "Instelling van je game afronden" > **Taken tonen**. Niet via het schildje in de balk
links: dat is "Beveiligd met Play". Niet elk formulier staat in de takenlijst op het dashboard; op App-content staan
ze allemaal, onder **Te doen** of **Actie vereist**. Elk formulier eindigt met **Opslaan**; daarna staat er een
groen vinkje bij. Na elk formulier staat "Versturen voor beoordeling in Publicatieoverzicht": dat doe je nog niet
(Google beoordeelt alles samen met je eerste testversie).

Stand op 10 november 2026: **Advertenties (punt 3) is gedaan**. Privacybeleid (punt 1) en App-toegang (punt 2) zijn
waarschijnlijk ook opgeslagen: kijk of ze een groen vinkje hebben. Het volgende formulier is **Advertentie-ID**
(punt 4), daarna **Contentclassificatie** (punt 5).

Belangrijk:
- De namen van knoppen kunnen een beetje anders zijn dan hier (Google wijzigt ze vaak). Kies dan de knop die
  hetzelfde betekent.
- Ik kon de hulppagina's van Google (support.google.com) vanuit mijn omgeving niet openen, alleen zoekresultaten
  ervan. Waar het formulier iets vraagt wat hier niet staat: stuur me een schermafbeelding.
- Antwoord altijd eerlijk. Wat hier staat, klopt met wat het spel en de server vandaag doen (gecontroleerd in
  `index.html`, `native/bridge.js` en `native/tourney/index.js`).

---

## 1. Privacybeleid (waarschijnlijk al gedaan: kijk naar het vinkje)

1. Klik **Privacybeleid**.
2. Plak: `https://pietertmortier-lab.github.io/dont-slice-me/privacy.html`
3. Klik **Opslaan**.

Je ziet: een groen vinkje. (De link werkt nu al, met de versie van 6 november. Claude zet de nieuwe `privacy.html`
van 10 november online op hetzelfde adres; die noemt de app, AdMob en het verwijderen. Jij hoeft de link daarna
niet opnieuw in te vullen.)

## 2. App-toegang (waarschijnlijk al gedaan: kijk naar het vinkje)

1. Klik **App-toegang**.
2. Kies **Alle functionaliteit is beschikbaar zonder speciale toegang**.
3. Klik **Opslaan**.

Waarom: er is geen login. Het spel maakt bij de start zelf een anonieme account aan. Een reviewer kan alles
spelen, ook het vriendenscherm (een tweede speler is niet nodig om het te zien).

## 3. Advertenties: GEDAAN

**[GEDAAN, 10 november]** Je koos **Ja, mijn app bevat advertenties** en Play Console toonde "Wijziging opgeslagen".
Niets meer te doen. (Ter info, zo ging het: **Advertenties** > **Ja, mijn app bevat advertenties** > **Opslaan**.)

Waarom: de app toont AdMob-video's (beloningsvideo's en soms een video tussen twee pogingen).

## 4. Advertentie-ID (het volgende formulier)

1. Klik **Advertentie-ID**.
2. Bij "Gebruikt je app een advertentie-ID?": kies **Ja**.
3. Vink als doel aan: **Advertenties of marketing**, **Analyse** en **Fraudepreventie, beveiliging en naleving**.
   (De advertentiesoftware van Google gebruikt het ID daarvoor; het spel zelf leest het niet.)
4. Klik **Opslaan**.

Waarom: de AdMob-software voegt de toestemming `AD_ID` automatisch aan de app toe. Zonder "Ja" weigert Play
Console de upload of geeft een waarschuwing.

## 5. Contentclassificatie (IARC-vragenlijst, na de advertentie-ID)

1. Klik **Contentclassificatie** > **Vragenlijst starten**.
2. E-mailadres: `dont.slice.me@gmail.com`.
3. Categorie: **Game** (spel).
4. Beantwoord de vragen zo:

| Vraag (in het kort) | Antwoord | Waarom |
|---|---|---|
| Geweld? | **Ja**, maar alleen: cartoon- of fantasiegeweld tegen niet-menselijke figuren | Een keukenmes snijdt getekend fruit met een gezichtje. Geen mensen, geen dieren. |
| Bloed of verminking? | **Nee** | Er spat sap, geen bloed. Het fruit valt in twee helften, getekend. |
| Realistisch geweld, geweld tegen mensen of dieren? | **Nee** | |
| Angst of schrik (horror)? | **Nee** | |
| Seksualiteit, naakt? | **Nee** | |
| Grof taalgebruik? | **Nee** | De teksten van het spel zijn netjes. Spelers kiezen wel zelf een naam (zie opmerking hieronder). |
| Drugs, alcohol, tabak? | **Nee** | |
| Grove humor? | **Nee** | |
| Gokken of gesimuleerd gokken (casino, weddenschappen)? | **Nee** | Het Rad van de dag is één gratis draai per dag; je zet niets in en je kunt het nooit met geld kopen. Er zijn geen casinospelletjes. |
| Koop je met echt geld willekeurige voorwerpen (lootboxen)? | **Nee** | Elk product heeft een vaste inhoud (Pieters regel en de Belgische wet). |
| Kunnen gebruikers met elkaar communiceren of iets delen? | **Ja**, gebruikers kunnen met elkaar interageren | Spelers zien elkaars spelersnaam, fruit en score, kunnen vrienden worden en elkaar uitdagen. Er is **geen chat** en geen vrije tekst behalve de spelersnaam. |
| Deelt de app de locatie van de gebruiker met anderen? | **Nee** | |
| Digitale aankopen in de app? | **Ja** | Sap, Fruitpas, Reclamevrij, Plus enzovoort via Google Play. |
| Onbeperkte toegang tot internet (browser)? | **Nee** | |
| Persoonlijke gegevens delen met anderen? | **Nee** | Alleen spelersnaam, level, fruit en score zijn zichtbaar voor andere spelers. |

5. Klik **Opslaan** en daarna **Classificatie berekenen** > **Classificatie toepassen**.

Je ziet: een leeftijd per land (in Europa een PEGI-cijfer, waarschijnlijk PEGI 7 of 12, plus de vermelding
"In-game aankopen" en "Gebruikers werken samen"). Dat cijfer is van IARC, niet van ons; schrijf het nergens zelf.

Opmerking over namen: spelers kiezen zelf een naam (2 tot 16 letters, cijfers, spaties of streepjes) die
vrienden en duelspelers zien. Sinds v0.32.9 weigert de server ongepaste namen (Nederlands en Engels; de speler moet een
andere kiezen en heet zolang "Speler"), staat bij elke andere speler een knopje ⋯ om de naam te melden of de speler te
blokkeren, en staan de regels in `voorwaarden.html` (NL en EN). Drie meldingen verbergen een naam tot jij ernaar kijkt
(`node tools/reports.cjs list` in `native/tourney`). Het antwoord hier blijft hetzelfde: spelers kunnen met elkaar
interageren.

## 6. Doelgroep en content

1. Klik **Doelgroep en content**.
2. Leeftijdsgroepen: vink **13-15**, **16-17** en **18 en ouder** aan. Vink **niets onder 13** aan.
3. Volgende vraag: "Kan je app per ongeluk kinderen aanspreken?" (of: "Spreken je winkelvermelding of je app
   kinderen aan?"). Antwoord eerlijk. Het fruit met gezichtjes is schattig getekend; Google kan zelf besluiten dat
   het kinderen aanspreekt. Mijn advies: **Nee**, omdat de winkeltekst en de schermafbeeldingen gericht zijn op
   tieners en volwassenen (duels, toernooi, geen kleuterwoorden). Vraagt Google later toch meer uitleg, dan
   antwoorden we samen.
   Let op: als Google zegt dat de app kinderen aanspreekt, moet de app ook de Families-regels volgen (onder meer een
   neutrale leeftijdsvraag bij de start en geen gepersonaliseerde advertenties voor wie jonger is dan 13). Stuur me
   dan meteen de melding; dan bouw ik een leeftijdsvraag. Houd de schermafbeeldingen, het icoon en de teksten gericht
   op tieners en volwassenen (duels, toernooi), zoals nu.
4. Klik **Volgende** en **Opslaan**.

Waarom 13+: het privacybeleid zegt "13 jaar en ouder", in België mag je vanaf 13 zelf toestemming geven voor
gegevens (AVG), en er zijn spelersnamen en duels met anderen.

Wat dat betekent voor de advertenties:
- Omdat er geen kinderen onder 13 in de doelgroep zitten, gelden de strengere regels van het Families-programma
  niet. AdMob is daarnaast zelf een door Google goedgekeurde advertentie-SDK.
- De app vraagt AdMob om advertenties tot "PG" (ParentalGuidance) te tonen (`maxAdContentRating` in `bridge.js`).
  Zet in AdMob hetzelfde: **AdMob > Blokkeringsinstellingen > Inhoud > Maximale advertentie-inhoudsclassificatie:
  PG** (of strenger). Zo krijgt een speler van 13 geen advertenties voor volwassenen.
- In de EER vraagt het toestemmingsformulier van Google (je AVG-bericht in AdMob) of de speler gepersonaliseerde
  advertenties wil. Wie weigert, krijgt alleen niet-gepersonaliseerde advertenties. Wil je extra voorzichtig zijn
  met tieners, dan kun je in AdMob kiezen om in de EER alleen niet-gepersonaliseerde advertenties te tonen
  (minder opbrengst). Dat is een keuze, geen verplichting in Google Play voor een 13+-app.

## 7. Nieuwsapp, overheid, financieel, gezondheid

Elk is een apart formulier onder App-content:

1. **Nieuwsapps**: kies **Nee, mijn app is geen nieuwsapp** > **Opslaan**.
2. **Overheidsapps**: kies **Nee** > **Opslaan**.
3. **Financiële functies**: kies **Mijn app biedt geen financiële functies** > **Opslaan**. (Aankopen via Google
   Play zijn geen financiële functie.)
4. **Gezondheid**: kies **Mijn app heeft geen gezondheidsfuncties** > **Opslaan**.
5. Verschijnt **COVID-19 contacttracering of statusapps**: **Nee**.

## 8. Gegevensveiligheid (Data safety)

1. Klik **Gegevensveiligheid** > **Starten**.

### 8.1 Eerste vragen

| Vraag | Antwoord |
|---|---|
| Verzamelt of deelt je app gegevens van de vereiste typen? | **Ja** |
| Worden alle gegevens versleuteld tijdens het verzenden? | **Ja** (alles gaat over https/TLS: onze server, Firebase, AdMob, RevenueCat) |
| Welke manieren van een account maken biedt je app? | **Andere**: "Anonieme account met een zelfgekozen spelersnaam; geen e-mail of wachtwoord." (Kies niet "Mijn app heeft geen accounts": de server bewaart een profiel per speler.) |
| Kunnen gebruikers vragen om hun gegevens te verwijderen? | **Ja** |
| Link om account en gegevens te verwijderen (web) | `https://pietertmortier-lab.github.io/dont-slice-me/privacy.html#verwijderen` |

Google vraagt voor apps met een account ook een manier om de account **in de app zelf** te verwijderen. Die is er
sinds v0.32.9: Instellingen (tandwiel) > **Account verwijderen**. De link hierboven blijft dezelfde: punt 14 van het
privacybeleid noemt nu eerst die knop en daarna de mail. Een verzoek per mail voer je uit met
`node tools/delete-player.cjs <vriendencode>` in `native/tourney` (zie UITROL-STAPPEN.md, deel 0).

| Vraag | Antwoord |
|---|---|
| Kunnen gebruikers vragen om een deel van hun gegevens te verwijderen, zonder hun account te verwijderen? | **Nee** (alleen alles samen) |

### 8.2 Welke gegevens (vink alleen deze aan)

| Categorie > type | Verzameld | Gedeeld (met een derde voor zijn eigen doel) | Verplicht of optioneel | Doelen om aan te vinken | Waar het vandaan komt |
|---|---|---|---|---|---|
| Persoonlijke info > **Naam** | Ja | Nee | Optioneel (alleen wie online speelt, kiest een naam) | App-functionaliteit, Accountbeheer, Fraudepreventie | De spelersnaam, zichtbaar voor vrienden en in duels; de namenfilter en meldingen van namen (v0.32.9) |
| Persoonlijke info > **Gebruikers-ID's** | Ja | Nee | Verplicht | App-functionaliteit, Accountbeheer, Fraudepreventie | Anoniem Firebase-id, vriendencode, anoniem aankoop-id van RevenueCat |
| Locatie > **Geschatte locatie** | Ja | Ja (Google AdMob) | Verplicht | Advertenties of marketing, Analyse, Fraudepreventie | AdMob leidt een ruwe locatie af uit het IP-adres. Onze eigen server bewaart geen IP-adres (alleen een onomkeerbare code ervan, tegen misbruik). |
| Financiële info > **Aankoopgeschiedenis** | Ja | Nee | Verplicht (zo raadt RevenueCat het aan: de software verzamelt het altijd) | App-functionaliteit, Analyse | Google Play en RevenueCat (aankopen herstellen, Plus). Sinds v0.32.9 meldt de app ook welk product je kocht aan onze eigen server, die het alleen optelt in dagtotalen (niet per speler bewaard); voor dat deel mag "tijdelijk verwerkt" aan |
| App-activiteit > **App-interacties** | Ja | Ja (Google AdMob: interacties met advertenties) | Verplicht | App-functionaliteit, Advertenties of marketing, Analyse, Fraudepreventie | Je voortgang en profiel (level, record, fruit, keuken, dagreeks, divisie, scores), duels en schimmen, live-duelposities, online-bolletje; sinds v0.32.9 ook meldingen van namen (wie meldde wie, met welke reden: een keuze, geen vrije tekst) en je lijst met geblokkeerde spelers; bij AdMob: welke advertentie je zag of aantikte |
| App-activiteit > **Zoekgeschiedenis in de app** | Ja | Nee | Optioneel | App-functionaliteit | Zoeken op spelersnaam bij Vrienden. Bij "tijdelijk verwerkt": **Ja** (de server zoekt met de zoekterm en bewaart hem niet) |
| App-activiteit > **Andere door gebruikers gemaakte content** | Nee | | | | (niet aanvinken: er is geen chat of vrije tekst behalve de naam, die staat al bij Naam) |
| App-info en prestaties > **Crashlogs** | Ja | Ja (Google AdMob) | Verplicht | Advertenties of marketing, Analyse, Fraudepreventie | De AdMob-software (Google noemt crashlogs bij de diagnostische gegevens van de Mobile Ads SDK) |
| App-info en prestaties > **Diagnostiek** | Ja | Ja (Google AdMob) | Verplicht | Advertenties of marketing, Analyse, Fraudepreventie | De AdMob-software (prestaties van advertenties, fouten bij laden). Het spel zelf verzamelt geen crashrapporten of statistieken. |
| Apparaat- of andere ID's | Ja | Ja (Google AdMob: het advertentie-ID) | Verplicht | Advertenties of marketing, Analyse, Fraudepreventie, App-functionaliteit | Advertentie-ID (AdMob); later ook een pushtoken van Firebase Cloud Messaging als meldingen aan staan |

Niet aanvinken (het spel doet dit niet): e-mailadres, adres, telefoonnummer, nauwkeurige locatie, betaalgegevens
(Google regelt het betalen), contacten, berichten, foto's, video's, audio, bestanden, agenda, gezondheid,
webgeschiedenis, geïnstalleerde apps.

Uitleg bij "verzameld" en "gedeeld":
- *Verzameld* = de gegevens verlaten het toestel (naar onze server, Firebase, RevenueCat of Google).
- *Gedeeld* = een andere partij gebruikt ze voor haar eigen doel. Dat is AdMob (advertenties van Google).
  Firebase en RevenueCat werken in onze opdracht (verwerkers): dat telt niet als delen.
- Wat andere spelers in het spel zien (naam, fruit, score), telt niet als "delen" met een derde partij.

Bij elk aangevinkt type vraagt Google of het **tijdelijk verwerkt** wordt: antwoord **Nee** (we bewaren het), behalve
bij **Zoekgeschiedenis in de app**: daar **Ja**.

2. Klik **Volgende** tot **Opslaan**. Je ziet een voorbeeld van de sectie zoals spelers ze zien.

Bronnen (opgezocht op 10 november 2026, alleen via zoekresultaten: de pagina's zelf kon ik niet openen):
- "Google Play's data disclosure requirements" (developers.google.com, Google Mobile Ads SDK voor Android): de SDK
  verzamelt en deelt automatisch onder meer het advertentie-ID, IP-adres (ruwe locatie), app-interacties en
  diagnostische gegevens, "including crash logs", voor advertenties, analyse en fraudepreventie.
- "Google Play's Data Safety" (RevenueCat-documentatie): aankoopgeschiedenis, verzameld, niet tijdelijk, verplicht,
  doelen App-functionaliteit en Analyse; geen crashlogs of diagnostiek.
Controleer zelf nog die twee pagina's (zoek op die titels) vlak voor je indient. Staat daar een type dat hier
ontbreekt, voeg het toe en laat het me weten.

## 9. Handelaarsstatus (EU: Digital Services Act): GEDAAN

**[GEDAAN, 10 november]** Je account staat op **Handelaar**. Dit stond niet bij de app maar bij je account, en het
moest vóór je een app kon aanmaken (samen met de verificatie van je telefoonnummer, ook gedaan op 10 november).

Waar je het terugvindt: Play Console, alle apps, linkerkolom **Account beheren** > **Accountgegevens** (of het
tandwiel/de accountpagina) > **Handelaarsstatus** > **Handelaarsstatus updaten**.

Wat Google in de EU publiek toont bij een handelaar: je naam, een adres, een telefoonnummer en een e-mailadres.
Controleer op die pagina eenmaal welk adres, nummer en e-mail daar staan. Als e-mail is `dont.slice.me@gmail.com` het
best. Wil je je thuisadres niet publiek, overleg dan met je boekhouder (bijvoorbeeld een zakelijk adres).

Buiten Google Play: als handelaar met inkomsten in België (aankopen, advertenties) kun je ook andere verplichtingen
hebben, zoals een inschrijving (KBO) en btw. Je koos op 4 november om dat met een boekhouder te bespreken; doe dat
voor de eerste echte verkoop.

De algemene voorwaarden staan sinds v0.32.9 in `voorwaarden.html` (NL en EN): spelersnamen, eerlijk spelen, melden,
blokkeren en aankopen. Adres: `https://pietertmortier-lab.github.io/dont-slice-me/voorwaarden.html`. In de
winkelvermelding hoeft die link niet: de app toont de spelregels zelf, bij het kiezen van een naam ("Met Klaar ga je
akkoord met de spelregels"), bij Instellingen, bij Hulp en bij Plus. Google vraagt in zijn eigen formulieren alleen de
link naar het privacybeleid en de link om je account te verwijderen (hierboven).

## 10. Wat je pas later invult

- **Rechten voor meldingen**: pas als pushmeldingen aan staan (`FCM_READY = true`), geen apart formulier nodig.
- **app-ads.txt**: AdMob controleert dit op je website (zie UITROL-STAPPEN.md, deel B).
