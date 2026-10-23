# Fruitvlucht - promovideo en advertentievarianten

## Promovideo (30 s, staand 1080 x 1920, NL en EN)

Bestanden: `fruitvlucht-promo-30s-nl.mp4` en `fruitvlucht-promo-30s-en.mp4`, gerenderd uit het spel zelf
(beeld voor beeld, 30 per seconde) met de menumuziek eronder. Gebruik per winkelvermelding de taalversie:
Nederlands (België) en Nederlands (Nederland) krijgen de NL-video, alle andere talen de EN-video; Play Console
laat per taal een eigen YouTube-link, feature graphic en schermafbeeldingen toe.

| Seconde | Beeld | Tekst NL | Tekst EN |
|--------:|-------|----------|----------|
| 0 - 3 | titelkaart: appel, logo | Jij bent het fruit. | You are the fruit. |
| 3 - 8 | gameplay level 14, rode lijnen | Ontwijk het mes. | Dodge the knife. |
| 8 - 13 | gameplay, klontjes | Pak sap. Klim de levels op. | Grab sap. Climb the levels. |
| 13 - 16 | de snee in slow motion | Net niet... | Close call... |
| 16 - 24 | kersen, drakenvrucht, citroen | 18 fruitsoorten, elk met een truc | 18 fruits, each with a trick |
| 24 - 27 | Mes van de dag, donkere keuken | Mes van de dag: hetzelfde mes voor iedereen | Knife of the day: the same knife for everyone |
| 27 - 30 | eindkaart met knop | Gratis in de Play Store | Free on the Play Store |

Opnieuw renderen na een spelupdate: `node promo-capture.cjs <map> nl` en daarna het ffmpeg-commando uit de
sessie (staan in de Land-Of-Mortar-repository bij de prototypes).

## Vijf advertentievarianten (15 s, staand, voor TikTok, Reels, Shorts en Google App Campaigns)

Alle vijf zijn echte gameplay; de eerste twee seconden zijn de haak, de laatste drie de knop. Te maken uit
dezelfde opnames als de promovideo; per variant staan de scènes en de teksten.

1. **De fail** (humor). 0-2 s: appel wordt gesneden in slow motion, tekst "Oeps." 2-10 s: drie snelle sneden
   achter elkaar (kers, banaan, watermeloen), tekst "Jij bent het fruit." 10-15 s: eindkaart "Hoe lang overleef
   jij? Gratis." Doelgroep: iedereen, beste starter voor TikTok.
2. **Net niet** (spanning). 0-2 s: mes scheert rakelings langs de kers, "Net niet!" flitst. 2-10 s: reeks
   net-niet-momenten met oplopend level. 10-15 s: "Elke level iets sneller. Gratis in de Play Store."
3. **Het mes van de dag** (sociaal). 0-2 s: donkere keuken, lichtkring, tekst "Hetzelfde mes voor iedereen."
   2-10 s: dagregel Blind mes, dan het eindscherm met level en tijd. 10-15 s: "Daag je vrienden uit." met de
   deelknop in beeld. Doelgroep: vrienden-groepen, 16-30.
4. **De fruitsoorten** (verzamelen). 0-2 s: drakenvrucht spuwt vuur. 2-12 s: vier fruitjes met hun truc, elk 2,5 s
   (kersen twee levens, citroen spuit messen weg, avocado speelt verder als pit, granaatappel spat uiteen).
   12-15 s: "18 fruitsoorten. Welke ben jij?" Doelgroep: casual spelers die van collecties houden.
5. **De keuken** (variatie). 0-2 s: blender zuigt de appel aan. 2-12 s: vork, deegrol, hete pan, garde, ijsblokjes,
   keukenwekker, elk 1,5 s. 12-15 s: "Elke vijf levels een nieuwe keuken. Gratis." Doelgroep: spelers die
   bang zijn dat het saai wordt.

Meetplan: elke variant krijgt twee dagen 10 euro; de twee met de laagste kosten per installatie en de hoogste
dag-1-retentie krijgen de rest van het budget. Engelse versies: dezelfde beelden, teksten uit de tabel hierboven
vertaald, altijd zonder stem (werkt in elk land).
