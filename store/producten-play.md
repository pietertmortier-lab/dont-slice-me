# Producten voor Google Play en RevenueCat (16 november 2026: spel v0.32.10 in de test; v0.32.11 uitgebracht in je repo, v0.32.12 tot en met v0.32.15 klaar om te uploaden)

Deze lijst komt rechtstreeks uit het spel: `PRODUCTS` en `skuFor()` in `index.html` (v0.32.10: regel 7282-7283) en de prijzen
op de knoppen van de winkel (`openShop`, v0.32.10: vanaf regel 8374). Vanaf v0.32.12 (jouw keuzes 1A, 2A, 3A en 4A van
15 november) staat in `PRODUCTS` alleen nog: `sap_3000`, `sap_10000`, `hearts_5`, `doubler_1h`, `coins_5`, `pass`, `noads`,
`plus_month`, `plus_year` en `bundle_all`. De product-ID moet in Play Console **letter voor letter**
gelijk zijn aan de kolom "Product-ID", anders vindt de app het product niet.

Twee soorten in Play Console:
- **Eenmalig product** (Monetize > Products > In-app products / One-time products). In RevenueCat:
  "Consumable" (je kunt het opnieuw kopen) of "Non-consumable" (je koopt het één keer, blijft van jou).
- **Abonnement** (Monetize > Products > Subscriptions), met een basisabonnement (base plan) dat automatisch verlengt.

Entitlements in RevenueCat (de namen die het spel leest bij "Aankopen herstellen"): `noads`, `pass`, `plus`. Vanaf v0.32.12 leest
het spel alleen nog `noads` en `plus`: de Fruitpas wordt nooit hersteld (keuze 2A). De lege entitlement `pass` mag blijven staan.

**Stand 13 november 2026:** alle producten van deel A bestaan in Play Console en staan op **Actief** (12 november), en ze
staan in RevenueCat met de soort en entitlement uit de tabel. Wat je precies deed, staat in deel E hieronder en in
`UITROL-STAPPEN.md`, deel G.

**Nieuw in v0.32.12 (15 november 2026, nog niet uitgebracht):** `tickets_5`, `tickets_15` en `weekpass` zijn uit het spel (deel A2).
Zet ze in Play Console pas op inactief als v0.32.12 in de interne test staat (zie `PLAY-CONSOLE-v0.32.12.md`). In RevenueCat
hoeft niets.

**Nieuw in v0.32.15 (16 november 2026, nog niet in de interne test):** de sappotten groeien mee met je ronde en heten Kleine
sappot en Grote sappot; de sapverdubbelaar kost € 1,99. De product-ID's blijven. Pas naam, beschrijving en prijs aan in Play
Console als v0.32.15 in de interne test staat (zie `PLAY-CONSOLE-v0.32.15.md` en deel E, punt 7). In RevenueCat hoeft niets.

## A. Maak deze aan voor de interne en de gesloten test

| Product-ID | Naam in de winkel (NL) | Prijs in het spel | Soort in Play | RevenueCat | Entitlement | Wat je krijgt |
|---|---|---|---|---|---|---|
| `sap_3000` | Kleine sappot (EN: Small juice pot; tot en met v0.32.14: 3.000 sap) | € 0,99 | eenmalig | consumable | - | minstens 3.000 sap, meer op hogere levels. Level 1-60: 3.000 · 61-90: 6.000 · 91-120: 12.000 · 121-150: 18.000 · vanaf 151: 30.000. Het spel geeft het hoogste van "het getal in de winkel toen je tikte" en "het getal nu" (v0.32.15). Oudere versies geven 3.000 |
| `sap_10000` | Grote sappot (EN: Big juice pot; tot en met v0.32.14: 10.000 sap) | € 2,49 | eenmalig | consumable | - | minstens 10.000 sap, meer op hogere levels. Level 1-60: 10.000 · 61-90: 20.000 · 91-120: 40.000 · 121-150: 60.000 · vanaf 151: 100.000. Zelfde regel als hierboven. Oudere versies geven 10.000 |
| `hearts_5` | 5 hartjes | € 0,99 | eenmalig | consumable | - | 5 hartjes, ook boven je maximum (sinds v0.32.11). Nieuwe beschrijving in Play Console: deel E, punt 5 |
| `doubler_1h` | Sapverdubbelaar 1 uur | **€ 1,99** (vanaf v0.32.15; was € 0,99) | eenmalig | consumable | - | 1 uur dubbel sap (max 5 uur opgeteld). Met sap kost een uur 30.000 tot level 120, 36.000 op level 121-150 en 60.000 vanaf level 151 |
| `coins_5` | 5 spelletjesmunten | € 0,99 | eenmalig | consumable | - | 5 munten voor de losse spelletjes onder Dagmes |
| `pass` | Fruitpas | € 4,99 | eenmalig | consumable | geen (losgekoppeld op 12 november; de entitlement `pass` blijft, leeg) | het betaalde spoor van dit seizoen (een kalendermaand): hartjes, schilden, sap en gereedschap. Vanaf v0.32.12: de koopknop zegt tot wanneer het seizoen loopt ("geldt tot 30 november, nog 17 dagen"); in de laatste 3 dagen van de maand is hij niet te koop; "Aankopen herstellen" geeft hem nooit terug (keuze 2A) |
| `noads` | Reclamevrij | € 3,99 | eenmalig | **non-consumable** | `noads` | geen filmpjes meer; je krijgt de beloning meteen (de brug slaat de video over, zie `native/bridge.js`) |
| `bundle_all` | Alles-in-één fruit | € 9,99 | eenmalig | **non-consumable** | - (zie B) | de gewone fruitsoorten (20) die je nog niet hebt, maar alleen tot je eigen level; de rest komt vanzelf vrij als je dat level haalt (v0.32.9, zie C). Geen toernooifruit en geen laat fruit |
| `plus_month` | Don't Slice Me! Plus (maand) | € 2,99 per maand | abonnement, basisabonnement `monthly` (maandelijks), **geen proefperiode**, "Werkt met eerdere versies" | subscription (`plus_month:monthly`) | `plus` | zie "Plus" hieronder |
| `plus_year` | Don't Slice Me! Plus (jaar) | € 19,99 per jaar | abonnement, basisabonnement `yearly` (jaarlijks), **geen proefperiode**, "Werkt met eerdere versies" | subscription (`plus_year:yearly`) | `plus` | idem |

Plus geeft: geen reclame (ook geen beloningsvideo's: je krijgt de beloning meteen), onbeperkte hartjes, +25% sap, dubbele beloning voor dagreeks en opdrachten, elke maandag
een vaste Plus-kist (1.500 sap + 1 hartje), elke maand een vast fruit dat na 10 levels van jou is, Fruitpas
premium, elke dag 2 munten en 1 Startboost en de Dagdeal voor een derde. Tot en met v0.32.11 gaf Plus ook 1 extra gratis
toernooiticket per dag; vanaf v0.32.12 niet meer (iedereen krijgt er 10).

## A2. Weg uit het spel in v0.32.12 (keuze 1A): op inactief zetten

| Product-ID | Naam | Prijs | Wat er in v0.32.12 gebeurt |
|---|---|---|---|
| `tickets_5` | 5 toernooitickets | € 0,99 | Geen knop meer. Komt er toch nog een aankoop binnen (een betaling die nog liep, een aankoop in een oude versie die pas later verwerkt wordt, of na "Aankopen herstellen"), dan krijgt de speler **5.000 sap** met een kaartje "Aankoop omgezet in sap" (NL en EN). Eén keer per aankoop. Een aankoop die v0.32.10 of v0.32.11 op die telefoon al gaf, wordt herkend aan het tijdstip en niet nog eens betaald. Alleen aankopen van ten vroegste 7 dagen vóór de eerste start van v0.32.12 tellen (bij een nieuwe installatie: vanaf die start). |
| `tickets_15` | 15 toernooitickets | € 1,99 | Idem, **15.000 sap**. |
| `weekpass` | Weekpas | € 2,99 | Idem, **9.000 sap**, en het fragment van zondag komt nog (al een Weekpas deze week: het fragment komt meteen). |

Wat de speler nog had: bewaarde tickets worden één keer 1.000 sap per ticket, een lopende Weekpas één keer 9.000 sap (het
fragment van zondag komt nog). Iedereen krijgt nu 10 gratis tickets per dag; het ticket voor sap en het ticket na een
filmpje zijn ook weg. Zet de drie producten op **inactief**, maar pas als v0.32.12 in de interne test staat: een oudere
versie toont de knop nog, en die doet dan niets meer (`PLAY-CONSOLE-v0.32.12.md`, stap 4). Niet verwijderen.

## B. Nog te beslissen of te herstellen in het spel (niet aanmaken tot het opgelost is)

| Product-ID | Probleem | Voorstel |
|---|---|---|
| `bundle_rood`, `bundle_tropisch`, `bundle_klein`, `bundle_zuur` (de Fruitmanden) | **[BESLIST, 15 november: 3A]** De vier manden zijn weg uit het spel in v0.32.12; alleen Alles-in-één (`bundle_all`) blijft. Ze bestonden nooit in Play Console: niets te doen. Fruit dat een mand al gaf of dat nog op zijn level wacht, blijft van de speler. | - |
| (geen ID) "Laatste stempel" € 0,49 | **[BESLIST, 15 november: 4A]** De code is weg in v0.32.12 (er was nooit een knop in de app). Niets te doen. | - |
| knop "Koop de Fruitpas · € 4,99" op het Fruitpas-tabblad | **[GEDAAN in v0.32.7]** De knop gaat via het product `pass`. | - |
| `pass` | **[BESLIST, 15 november: 2A]** Eén product `pass` (consumable, per kalendermaand), aan **geen** entitlement, nooit hersteld. De herstelknop zegt vanaf v0.32.12 alleen nog "Plus of Reclamevrij". | - |
| `bundle_all` | Wordt niet hersteld met "Aankopen herstellen" (alleen via de cloud-save). | Entitlement `fruit_all` toevoegen en in het spel lezen, of zo laten (de cloud-save bewaart het fruit). |
| `plus_month`, `plus_year` | **[GEDAAN in v0.32.9]** De knop "Opzeggen" stopt Plus alleen in het spel; Google Play blijft aanrekenen. Verlengingen en terugbetalingen worden niet gelezen. | In de app "Opzeggen" naar Google Play laten gaan (`FV_NATIVE.manageSubscriptions`) en Plus lezen met `FV_NATIVE.plusStatus()`. Moet klaar zijn voor de productie. |

## C. Pieters eigen regels: controle per product

Pieters regels: geen betaalde toevalsprijzen (Belgische wet), niemand sterker door te betalen in competitieve
spelvormen, alles is ook met spelen te verdienen, geen pure cosmetica.

- **Geen enkel product geeft een toevalsprijs.** Je weet altijd precies wat je koopt. Het Rad van de dag is
  gratis (één draai per dag, plus een vaste 300 sap na een filmpje) en is nooit te koop. De Plus-kist en de Fruitpas
  hebben vaste inhoud.
- **Geen pure cosmetica.** Er worden geen hoedjes of skins verkocht (weg sinds v0.32.4).
- **Alles is ook te verdienen:** sap, hartjes, munten, tickets (10 gratis per dag; vanaf v0.32.12 nergens te koop), fruit (met sap),
  Fruitpas-beloningen (gratis spoor), geen reclame (Plus of filmpjes). Klopt voor elk product in A.
- **Competitieve spelvormen:**
  - Het live vriendenduel: eerlijk, elke speler kiest uit alle 20 gewone fruitsoorten (te leen).
  - **Opgelost in v0.32.9 (Pieters keuze "Alle fruit lenen"):** in de openbare duels en de duels van 24 uur mag
    iedereen elk van de 20 gewone fruitsoorten lenen, ook fruit dat hij nog niet heeft, net als in het live duel
    (Vrienden > Duels > "Kies fruit", en in de vraag "uitdagen?"). Wie niets kiest, speelt met zijn eigen fruit. De
    trucs van het fruit werken nog (de tweede kers, de avocadopit ...), maar die kan nu iedereen kiezen; sapverdubbelaar,
    uitrusting, fruitbonussen en een extra schil tellen in een duel niet (zoals al zo was). `bundle_all` (en tot en met
    v0.32.11 de Fruitmanden) geeft alleen fruit tot je eigen level; de rest is betaald en komt vanzelf vrij als je dat level haalt
    (je betaalt het nooit twee keer). Wie betaalt, heeft dus geen sterker fruit in een duel en ook niet sneller fruit
    van een hoger level.
    Let op: wie nog een oudere versie heeft (v0.32.8 of ouder), speelt zijn duels met zijn eigen fruit tot hij de app
    bijwerkt; een duel tegen zo iemand werkt gewoon. Daarom mag de winkeltekst nu weer zeggen: "in duels telt alleen
    hoe goed je speelt" (zie winkelteksten.md, EERLIJK SPELEN).
  - Sap, hartjes, verdubbelaar, munten, Reclamevrij, Fruitpas: maken het sneller, niet sterker in een wedstrijd.
  - **[v0.32.15, jouw keuzes 1A-4A]** Sapprijzen groeien per ronde van 30 levels mee (hartjes, startboosts, Reeksschild,
    verdubbelaar). Hartjes en startboosts tellen alleen in gewone pogingen; sinds v0.32.15 ook niet meer in de bonusrun van
    de Jacht op de Gouden Vork (die telt op de toernooiladder): daar wordt geen klaargezette startboost gebruikt, ook niet
    het gratis Schild van Plus. Geen enkel europroduct verkoopt een boost, een Reeksschild of een hartjesplek.
  - **[OPGELOST in v0.32.12, jouw keuze 1A van 15 november]** Toernooitickets zijn nergens meer te koop: `tickets_5`,
    `tickets_15` en `weekpass` zijn weg, Plus geeft geen extra ticket, en het ticket voor sap en het ticket na een
    filmpje zijn ook weg. Iedereen krijgt elke dag 10 gratis tickets. Zo heeft wie betaalt geen extra pogingen in het
    Keukentoernooi. De winkeltekst zegt nog altijd "alles verdien je ook door te spelen"; een regel over gratis tickets
    erbij zetten mag (zie winkelteksten.md).

## D. Niet aanmaken (verouderd)

`key`, `boost_5`, `hat_hoed`, `fruit_<naam>` (losse fruit voor geld), `shield` (sinds v0.32.12 ook uit `PRODUCTS`: het
Reeksschild is alleen met sap), `stamp_1` (de stempel voor geld is weg in v0.32.12), `bundle_rood`, `bundle_tropisch`,
`bundle_klein`, `bundle_zuur` (de Fruitmanden zijn weg in v0.32.12). De fruitkaart toonde "Later ook € X" bij losse fruit; dat
is weg in v0.32.12 (er staat nu alleen "Kost ... sap."): losse fruit is alleen met sap.

## E. In Play Console en RevenueCat

**[GEDAAN, 12-13 november]** Punt 1 tot 4 zijn gedaan; punt 5 doe je bij v0.32.11, punt 6 bij v0.32.12, punt 7 bij v0.32.15.

1. **[GEDAAN, 12 november]** Prijzen: vul de europrijs in voor België; laat Google de andere landen omrekenen.
   Wat er echt gebeurde: "Prijzen instellen" las het eurobedrag als bedrag **zonder** btw. Daarom zette je bij
   **België** en **Nederland** met het potloodje de prijs **met** btw er zelf in (dezelfde prijs als in het spel, zie de
   tabel). Elk eenmalig product heeft één aankoopoptie met ID **`buy`** (soort "Bestellen", gewoon kopen),
   leeftijdsclassificatie de laagste en belastingcategorie "Digitale app-verkoop".
   Let op (NIET NAGEKEKEN): in de andere landen rekende Google zelf om vanaf het bedrag zonder btw, en daar komt de btw
   van dat land nog bij. Daar kan de prijs in Google Play dus hoger zijn dan de prijs op de knop in het spel (de knoppen
   tonen een vaste prijs, bijvoorbeeld "€0,99" in `index.html` regel 8391; alleen Plus toont de prijs van Google). Kijk
   voor de gesloten test na welke prijs er staat in de landen van je testers buiten België en Nederland.
2. **[GEDAAN, 12 november]** Abonnementen: één abonnement per ID (`plus_month`, `plus_year`), elk met één basisabonnement dat automatisch
   verlengt (maandelijks / jaarlijks). Voeg **geen** gratis proefperiode of introductieaanbieding toe.
   Gedaan: `plus_month` met basisabonnement `monthly` (€ 2,99) en `plus_year` met `yearly` (€ 19,99), voordelen in het
   Engels en Nederlands, allebei **"Werkt met eerdere versies"** (achterwaarts compatibel), pauzeren aan (standaard).
3. **[GEDAAN, 12 november]** RevenueCat: importeer de producten uit Google Play, zet `noads` en `bundle_all` op non-consumable, koppel
   `noads` aan entitlement `noads` en `plus_month` en `plus_year` aan `plus`. Koppel `pass` (nog) aan **geen**
   entitlement: eerst beslis je hoe de Fruitpas per seizoen werkt (deel B).
   Gedaan: 9 producten geïmporteerd (`bundle_all` non-consumable, de andere consumable) naast de bestaande `noads`
   (non-consumable, aan `noads`) en `pass` (losgekoppeld; de entitlement `pass` blijft, leeg); `plus_month:monthly` en
   `plus_year:yearly` aan `plus`; de oude entitlement `don_t_slice_me_pro` is weg. Serviceaccount: Valid credentials.
   Google-meldingen (RTDN) aan, met als inhoud abonnementen, ingetrokken aankopen en alle eenmalige producten.
   Testaankoop `sap_3000` twee keer gelukt (Customers > Sandbox).
4. **[GEDAAN, 12 november: het product werd meteen met deze tekst gemaakt]** Beschrijving van `bundle_all` in Play Console (vanaf v0.32.9): NL "De gewone fruitsoorten (20) die je nog niet hebt.
   Fruit tot je eigen level krijg je meteen, de rest komt vanzelf als je dat level haalt. Geen toernooifruit en geen
   laat fruit." EN "The classic fruits (20) you do not have yet. Fruit up to your level is yours at once, the rest comes
   by itself when you reach its level. No tournament fruit and no late fruit." 
5. **[NOG TE DOEN, bij v0.32.11]** Beschrijving van `hearts_5` in Play Console. Vanaf v0.32.11 mogen gekochte hartjes
   boven je maximum gaan; er wordt niets meer sap. Vervang de beschrijving pas als v0.32.11 in de test staat
   (**Inkomsten genereren** > **Producten** > **Eenmalige producten** > `hearts_5`, Engels en daarna de Nederlandse vertaling > **Opslaan**):
   (De huidige tekst hieronder is die uit de plaklijst van 12 november; staat er bij jou iets anders, vervang dan wat er staat.)
   - EN nu: "5 hearts at once. Hearts that do not fit become juice." wordt: "5 hearts at once, also above your maximum."
   - NL nu: "5 hartjes meteen. Wat niet past, wordt sap." wordt: "5 hartjes meteen, ook boven je maximum."
   (Wie nog een oudere versie heeft, krijgt tot hij bijwerkt nog sap voor wat niet past.)
6. **[NOG TE DOEN, bij v0.32.12]** Zet `tickets_5`, `tickets_15` en `weekpass` op **inactief**, maar pas als v0.32.12 in de
   interne test staat en je zelf hebt bijgewerkt (de stappen staan in `PLAY-CONSOLE-v0.32.12.md`). Niet verwijderen: een
   aankoop die nog binnenkomt, zet het spel om in sap. In RevenueCat hoeft niets (laat de producten daar staan).
7. **[NOG TE DOEN, bij v0.32.15]** `sap_3000` en `sap_10000`: nieuwe naam en beschrijving; `doubler_1h`: prijs € 1,99 met
   de hand voor België en Nederland (zoals punt 1). Pas als v0.32.15 in de interne test staat en je zelf hebt bijgewerkt
   (`PLAY-CONSOLE-v0.32.15.md`, stap 3 tot 5). De beschrijvingen:
   - `sap_3000`: EN "At least 3,000 juice, more at higher levels. You see the amount before you buy." /
     NL "Minstens 3.000 sap, op hogere levels meer. Je ziet het aantal vóór je koopt."
   - `sap_10000`: EN "At least 10,000 juice, more at higher levels. You see the amount before you buy." /
     NL "Minstens 10.000 sap, op hogere levels meer. Je ziet het aantal vóór je koopt."
