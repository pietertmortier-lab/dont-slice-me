# Play Console bij v0.32.15 (16 november 2026)

Wat v0.32.15 doet (jouw keuzes "1A, 2A, 3A, 4A" uit `VOORSTEL-sapprijzen.md`): de sapprijzen van hartjes, startboosts, het
Reeksschild en de sapverdubbelaar gaan één keer per ronde van 30 levels omhoog (level 1-30 blijft precies zoals nu). De twee
sappotten groeien mee en geven nooit minder dan nu: de **Kleine sappot** (`sap_3000`, € 0,99) geeft minstens 3.000 sap, de
**Grote sappot** (`sap_10000`, € 2,49) minstens 10.000 sap. De sapverdubbelaar voor geld (`doubler_1h`) kost in het spel
**€ 1,99** in plaats van € 0,99.

De product-ID's blijven **dezelfde** (`sap_3000`, `sap_10000`, `doubler_1h`): Google Play laat geen nieuwe naam voor een ID
toe, en spelers zien de ID nooit. In **RevenueCat hoeft niets**: het blijven consumables zonder entitlement, en RevenueCat
neemt de prijs over van Google Play.

Log in met `dont.slice.me@gmail.com` (in Play Console is dat `/u/2/` in het adres).

## Wanneer

**Pas als v0.32.15 in de interne test staat en je zelf hebt bijgewerkt.** Niet eerder:
- Zet je de verdubbelaar eerder op € 1,99, dan toont de oudere app nog "€0,99" op de knop, terwijl Google € 1,99 vraagt
  (het venster van Google toont wel de echte prijs, maar dat is verwarrend).
- De nieuwe naam "Kleine sappot / Grote sappot" en de beschrijving "Minstens 3.000 sap, op hogere levels meer" kloppen pas
  als het spel de pot ook laat meegroeien.

Wie daarna nog een oudere versie heeft: die krijgt voor een sappot gewoon 3.000 / 10.000 sap (zoals nu; niemand verliest
iets), en voor de verdubbelaar toont de knop daar nog "€0,99" terwijl Google € 1,99 vraagt, tot die speler bijwerkt.

## In deze volgorde

1. **De app bouwen en in de interne test zetten** zoals altijd (`UITROL-STAPPEN.md`, deel C en E):
   - Haal eerst de nieuwe bestanden binnen en zet ze in de app:
     ```
     git pull
     cd native
     npm run sync
     ```
     (nodig: `index.html` is veranderd; `native/bridge.js` niet. Zonder `npm run sync` zit de oude `index.html` in de app,
     met de oude prijzen.)
   - Zet in Android Studio **`versionCode 9`** en `versionName "0.32.15"` (ook als je v0.32.12, v0.32.13 of v0.32.14 oversloeg).
     De stappen één voor één staan in `TESTLIJST-v0.32.15.md`, deel 1.
   - Er is geen server-update: geen `firebase deploy`.
   - Releaseopmerkingen bij de upload (vervangen het vorige blok; max 500 tekens; ze noemen ook het Mes van de dag van 0.32.14):
     ```
     <nl-NL>
     Versie 0.32.15: sapprijzen groeien mee met je ronde. Per ronde van 30 levels kosten hartjes, startboosts, het Reeksschild en de sapverdubbelaar wat meer sap (level 1-30 blijft hetzelfde). De sappotten groeien mee en geven nooit minder dan vroeger. De sapverdubbelaar voor geld kost € 1,99. Ook nieuw (0.32.14): het Mes van de dag is korter en harder. Testadvertenties: je ziet alleen voorbeeldreclame van Google. Vind je een fout? Mail naar dont.slice.me@gmail.com.
     </nl-NL>
     <en-US>
     Version 0.32.15: juice prices grow with your round. Every round of 30 levels, hearts, start boosts, the Streak shield and the juice doubler cost a bit more juice (levels 1-30 stay the same). The juice pots grow too and never give less than before. The juice doubler for money costs €1.99. Also new (0.32.14): the Knife of the day is shorter and harder. Test ads: you only see Google's sample ads. Found a bug? E-mail dont.slice.me@gmail.com.
     </en-US>
     ```
     Dit blok staat ook in `store/winkelteksten.md` ("Voor v0.32.15 in de interne test").

2. **Zelf bijwerken.** Werk je telefoon bij naar 0.32.15 (`TESTLIJST-v0.32.15.md`, deel 2). De tests in het spel doe je na
   stap 3 tot 5 hieronder (`TESTLIJST-v0.32.15.md`, deel 4).

3. **De Kleine sappot: naam en beschrijving.**
   - **Inkomsten genereren** > **Producten** > **Eenmalige producten** > klik op **`sap_3000`**.
   - Bij **Productgegevens** (Engels, de standaardtaal):
     - Naam: `Small juice pot`
     - Beschrijving: `At least 3,000 juice, more at higher levels. You see the amount before you buy.`
   - Dan de Nederlandse vertaling (bij **Vertalingen** of het taalmenu, Nederlands):
     - Naam: `Kleine sappot`
     - Beschrijving: `Minstens 3.000 sap, op hogere levels meer. Je ziet het aantal vóór je koopt.`
   - **Opslaan**. De prijs (€ 0,99) blijft.
   NIET NAGEKEKEN hoe het vak voor de vertaling bij jou precies heet; het is dezelfde plek waar je op 12 november de
   Nederlandse tekst invulde.

4. **De Grote sappot: naam en beschrijving.** Hetzelfde voor **`sap_10000`**:
   - EN naam: `Big juice pot`
   - EN beschrijving: `At least 10,000 juice, more at higher levels. You see the amount before you buy.`
   - NL naam: `Grote sappot`
   - NL beschrijving: `Minstens 10.000 sap, op hogere levels meer. Je ziet het aantal vóór je koopt.`
   - **Opslaan**. De prijs (€ 2,49) blijft.

5. **De sapverdubbelaar naar € 1,99.**
   - **Inkomsten genereren** > **Producten** > **Eenmalige producten** > klik op **`doubler_1h`** > de aankoopoptie **`buy`**.
   - Bij **Prijzen** (of "Prijs instellen"): vul **1,99 EUR** in en laat Google de andere landen omrekenen.
   - Net als in stap 1 van `store/producten-play.md` (deel E, punt 1): Google leest dat bedrag als prijs **zonder** btw.
     Klik daarom bij **België** en daarna bij **Nederland** op het potloodje en vul zelf de prijs **met** btw in:
     **€ 1,99** (dezelfde prijs als op de knop in het spel).
   - **Opslaan** (en bevestig als Google vraagt of de nieuwe prijs mag gelden).
   - Je ziet bij België en Nederland: € 1,99.
   Naam en beschrijving van `doubler_1h` blijven ("1 uur dubbel sap" klopt nog).
   NIET NAGEKEKEN: in de andere landen rekent Google zelf om vanaf het bedrag zonder btw; daar kan de prijs iets anders
   zijn dan "€1,99" op de knop (zoals bij de andere producten).

6. **RevenueCat: niets.** Kijk eventueel na dat de drie producten daar nog staan (consumable, geen entitlement). Een nieuwe
   import is niet nodig: de ID's zijn niet veranderd.

7. **Winkelvermelding en gegevensveiligheid: niets verplicht.** De winkeltekst noemt geen sapprijzen. Er gaat geen nieuwe
   informatie naar iemand (het spel bewaart alleen een vinkje "kaartje getoond" in de bestaande opslag).

8. **Producttabel: al gedaan.** `store/producten-play.md` heeft de nieuwe rijen van `sap_3000`, `sap_10000` en `doubler_1h`
   al (deel A), de regel "Nieuw in v0.32.15" en deel E, punt 7. Zet daar "[GEDAAN]" bij punt 7 als je stap 3 tot 5 deed.
