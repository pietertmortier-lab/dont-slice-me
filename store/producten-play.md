# Producten voor Google Play en RevenueCat (spel v0.32.6, 10 november 2026)

Deze lijst komt rechtstreeks uit het spel: `PRODUCTS` en `skuFor()` in `index.html` (regel ~6904) en de prijzen
op de knoppen van de winkel (`openShop`, regel ~8000-8040). De product-ID moet in Play Console **letter voor letter**
gelijk zijn aan de kolom "Product-ID", anders vindt de app het product niet.

Twee soorten in Play Console:
- **Eenmalig product** (Monetize > Products > In-app products / One-time products). In RevenueCat:
  "Consumable" (je kunt het opnieuw kopen) of "Non-consumable" (je koopt het één keer, blijft van jou).
- **Abonnement** (Monetize > Products > Subscriptions), met een basisabonnement (base plan) dat automatisch verlengt.

Entitlements in RevenueCat (de namen die het spel leest bij "Aankopen herstellen"): `noads`, `pass`, `plus`.

## A. Maak deze aan voor de interne en de gesloten test

| Product-ID | Naam in de winkel (NL) | Prijs in het spel | Soort in Play | RevenueCat | Entitlement | Wat je krijgt |
|---|---|---|---|---|---|---|
| `sap_3000` | 3.000 sap | € 0,99 | eenmalig | consumable | - | 3.000 sap |
| `sap_10000` | 10.000 sap | € 2,49 | eenmalig | consumable | - | 10.000 sap |
| `hearts_5` | 5 hartjes | € 0,99 | eenmalig | consumable | - | 5 hartjes (wat niet past, wordt sap) |
| `doubler_1h` | Sapverdubbelaar 1 uur | € 0,99 | eenmalig | consumable | - | 1 uur dubbel sap (max 5 uur opgeteld) |
| `coins_5` | 5 spelletjesmunten | € 0,99 | eenmalig | consumable | - | 5 munten voor de losse spelletjes onder Dagmes |
| `tickets_5` | 5 toernooitickets | € 0,99 | eenmalig | consumable | - | 5 extra rondes in het Keukentoernooi (zie C) |
| `tickets_15` | 15 toernooitickets | € 1,99 | eenmalig | consumable | - | 15 extra rondes (zie C) |
| `weekpass` | Weekpas | € 2,99 | eenmalig | consumable | - | deze week onbeperkt tickets + 1 extra fruitfragment op zondag (zie C) |
| `pass` | Fruitpas | € 4,99 | eenmalig | consumable (zie B) | `pass` | het betaalde spoor van dit seizoen: hartjes, schilden, sap en gereedschap |
| `noads` | Reclamevrij | € 3,99 | eenmalig | **non-consumable** | `noads` | geen filmpjes meer; je krijgt de beloning meteen (de brug slaat de video over, zie `native/bridge.js`) |
| `bundle_all` | Alles-in-één fruit | € 9,99 | eenmalig | **non-consumable** | - (zie B) | de gewone fruitsoorten (20) die je nog niet hebt; geen toernooifruit en geen laat fruit (zie C: level) |
| `plus_month` | Don't Slice Me! Plus (maand) | € 2,99 per maand | abonnement, basisabonnement maandelijks, **geen proefperiode** | subscription | `plus` | zie "Plus" hieronder |
| `plus_year` | Don't Slice Me! Plus (jaar) | € 19,99 per jaar | abonnement, basisabonnement jaarlijks, **geen proefperiode** | subscription | `plus` | idem |

Plus geeft: geen reclame (ook geen beloningsvideo's: je krijgt de beloning meteen), onbeperkte hartjes, +25% sap, dubbele beloning voor dagreeks en opdrachten, elke maandag
een vaste Plus-kist (1.500 sap + 1 hartje), elke maand een vast fruit dat na 10 levels van jou is, Fruitpas
premium, elke dag 2 munten en 1 Startboost, de Dagdeal voor een derde, en 1 extra gratis toernooiticket per dag.

## B. Nog te beslissen of te herstellen in het spel (niet aanmaken tot het opgelost is)

| Product-ID | Probleem | Voorstel |
|---|---|---|
| `bundle_rood`, `bundle_tropisch`, `bundle_klein`, `bundle_zuur` (de Fruitmanden) | De prijs in het spel hangt af van welke fruit je al hebt (70% van wat je mist, bijvoorbeeld Tropisch € 11,99 voor een nieuwe speler en € 2,99 als je er nog één mist). Een Play-product heeft één vaste prijs. | Eerst het spel aanpassen naar vaste prijzen (bijv. Rood € 4,99, Tropisch € 11,99, Klein € 5,99, Zuur € 4,99, de prijs voor een nieuwe speler) of de manden weghalen. |
| (geen ID) "Laatste stempel" € 0,49 | Deze knop heeft geen product-ID en geeft de stempel in de app gratis. | In het spel een product `stamp_1` maken of de knop weghalen. |
| knop "Koop de Fruitpas · € 4,99" op het Fruitpas-tabblad | Gaat niet via Google Play: in de app krijg je de Fruitpas gratis. | In het spel via hetzelfde product `pass` laten lopen. |
| `pass` | De Fruitpas geldt per seizoen, maar "Aankopen herstellen" geeft hem voor altijd terug als `pass` aan een entitlement hangt. | Kies: één product per seizoen (`pass_2026_12` ...) of herstellen alleen voor het lopende seizoen. Tot dan: consumable, **aan geen enkel entitlement koppelen** in RevenueCat, en niet herstellen. |
| `bundle_all` | Wordt niet hersteld met "Aankopen herstellen" (alleen via de cloud-save). | Entitlement `fruit_all` toevoegen en in het spel lezen, of zo laten (de cloud-save bewaart het fruit). |
| `plus_month`, `plus_year` | De knop "Opzeggen" stopt Plus alleen in het spel; Google Play blijft aanrekenen. Verlengingen en terugbetalingen worden niet gelezen. | In de app "Opzeggen" naar Google Play laten gaan (`FV_NATIVE.manageSubscriptions`) en Plus lezen met `FV_NATIVE.plusStatus()`. Moet klaar zijn voor de productie. |

## C. Pieters eigen regels: controle per product

Pieters regels: geen betaalde toevalsprijzen (Belgische wet), niemand sterker door te betalen in competitieve
spelvormen, alles is ook met spelen te verdienen, geen pure cosmetica.

- **Geen enkel product geeft een toevalsprijs.** Je weet altijd precies wat je koopt. Het Rad van de dag is
  gratis (één draai per dag, plus een vaste 300 sap na een filmpje) en is nooit te koop. De Plus-kist en de Fruitpas
  hebben vaste inhoud.
- **Geen pure cosmetica.** Er worden geen hoedjes of skins verkocht (weg sinds v0.32.4).
- **Alles is ook te verdienen:** sap, hartjes, munten, tickets (gratis per dag en met sap), fruit (met sap),
  Fruitpas-beloningen (gratis spoor), geen reclame (Plus of filmpjes). Klopt voor elk product in A.
- **Competitieve spelvormen:**
  - Het live vriendenduel: eerlijk, beide spelers krijgen hetzelfde fruit te leen.
  - **Let op, moet in het spel opgelost worden vóór de gesloten test:** in de openbare duels en de duels van 24 uur
    speel je met je eigen fruit, en de trucs van dat fruit werken daar (de tweede kers, de avocadopit, de helften van
    de watermeloen, de partjes van de sinaasappel). Alleen de fruitbonussen (sap, rustigere messen) gelden "niet in
    duels". Bovendien geeft `bundle_all` (en een Fruitmand) alle fruit meteen, ook fruit dat pas vanaf een hoger level
    mag (kersen level 6, watermeloen 34, drakenvrucht 60). Wie betaalt, heeft dus sneller sterker fruit in een duel.
    Oplossing in het spel: in die duels krijgen beide spelers hetzelfde fruit (zoals in het live duel), of de trucs
    staan uit; en `bundle_all` geeft alleen fruit tot je eigen level (de rest komt vrij als je dat level haalt).
    Tot dan staat "in duels telt alleen hoe goed je speelt" niet in de winkeltekst.
  - Sap, hartjes, verdubbelaar, munten, Reclamevrij, Fruitpas: maken het sneller, niet sterker in een wedstrijd.
  - **Let op, beslissing van Pieter nodig:** `tickets_5`, `tickets_15`, `weekpass` en Plus (+1 gratis ticket per
    dag) geven meer pogingen in het Keukentoernooi, waar je beste score telt in een wekelijkse ranglijst. Wie betaalt,
    heeft dus meer kansen op een hogere plaats en (met de Weekpas) een extra fruitfragment. Dat botst met "niemand
    sterker door te betalen in competitieve spelvormen", tenzij de geplande toernooiherziening (taak 52) dit oplost.
    Mogelijke keuzes: tickets alleen voor oefenrondes, of een vast maximum aantal rondes per week voor iedereen.
    Tot Pieter beslist, kun je deze drie producten gewoon aanmaken (het is geen Google-regel), maar zet ze niet in de
    productieversie zonder zijn keuze (voorwaarde in UITROL-STAPPEN.md, deel H). Daarom zegt de winkeltekst ook niet
    meer "aankopen maken het alleen sneller", alleen "alles verdien je ook door te spelen".

## D. Niet aanmaken (verouderd)

`key`, `boost_5`, `hat_hoed`, `fruit_<naam>` (losse fruit voor geld), `shield` (staat nog in `PRODUCTS`, maar er is
geen geldknop meer: het Reeksschild is alleen met sap). De fruitkaart toont nog "Later ook € X" bij losse fruit;
dat klopt niet meer (fruit is alleen met sap of in een mand) en moet uit het spel.

## E. In Play Console en RevenueCat

1. Prijzen: vul de europrijs in voor België; laat Google de andere landen omrekenen.
2. Abonnementen: één abonnement per ID (`plus_month`, `plus_year`), elk met één basisabonnement dat automatisch
   verlengt (maandelijks / jaarlijks). Voeg **geen** gratis proefperiode of introductieaanbieding toe.
3. RevenueCat: importeer de producten uit Google Play, zet `noads` en `bundle_all` op non-consumable, koppel
   `noads` aan entitlement `noads` en `plus_month` en `plus_year` aan `plus`. Koppel `pass` (nog) aan **geen**
   entitlement: eerst beslis je hoe de Fruitpas per seizoen werkt (deel B).
4. Beschrijving van `bundle_all` in Play Console: "De gewone fruitsoorten (20) die je nog niet hebt. Geen toernooifruit
   en geen laat fruit." (Pas aan zodra het spel het level respecteert.)
