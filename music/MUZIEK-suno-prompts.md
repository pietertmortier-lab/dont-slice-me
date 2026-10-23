# Fruitvlucht - muziek per keukenblad (Suno-prompts)

Het spel speelt per keukenblad een eigen nummer en vloeit over naar het volgende bij een nieuwe keuken (elke
5 levels). Zonder bestanden speelt een klein ingebouwd deuntje. Muziek staat standaard **aan** (sinds v0.13.1, nu de
nummers er zijn); uitzetten kan via "Muziek: uit" onderaan het hoofdmenu.

## Bestandsnamen (exact, kleine letters)

| Waar het speelt                     | Bestand                              |
|-------------------------------------|--------------------------------------|
| Menu's, Vandaag, winkel, game-over  | `music/menu.mp3`                     |
| Keuken 1 - Houten plank (lvl 1-5)   | `music/keuken-1-houten-plank.mp3`    |
| Keuken 2 - Marmeren blad (6-10)     | `music/keuken-2-marmeren-blad.mp3`   |
| Keuken 3 - Leisteen (11-15)         | `music/keuken-3-leisteen.mp3`        |
| Keuken 4 - Bamboe (16-20)           | `music/keuken-4-bamboe.mp3`          |
| Keuken 5 - Koperen blad (21-25)     | `music/keuken-5-koperen-blad.mp3`    |
| Keuken 6 - Nachtkeuken (26+)        | `music/keuken-6-nachtkeuken.mp3`     |

De map `music/` staat naast `index.html` in de fruitvlucht-repository (GitHub Pages). Uploaden kan via
GitHub (Add file > Upload files) of je stuurt mij de bestanden en ik zet ze erbij.

## Technische eisen per bestand

- MP3, 128 of 160 kbps, stereo, 44,1 kHz. Liefst 1:00 tot 1:30 lang, hoogstens ~2 MB per bestand.
- **Geen stilte** aan begin of einde (het spel herhaalt het bestand; stilte hoor je als een gat).
- **Geen vocalen, geen woorden**, ook geen "ooh"-koortjes: in Suno de knop *Instrumental* aan.
- Gelijkmatig volume van begin tot einde: geen lange intro, geen uitfade, geen plotse stilte of drop.
- Begin en einde op hetzelfde akkoord en hetzelfde tempo, zodat de herhaling natuurlijk klinkt.
- Suno maakt vaak 2 tot 4 minuten. Knip dan het beste stuk van 1 tot 1,5 minuut uit op een maatgrens
  (Audacity: knippen op een tel, 20 ms in- en uitfade) of gebruik het hele nummer; de naad is dan hoorbaar
  maar niet storend.

## Hoe in Suno

1. Create > **Custom** aan > **Instrumental** aan.
2. Plak de *Style of Music* tekst hieronder (de Engelse tekst). Laat Lyrics leeg of zet er `[Instrumental]`.
3. Titel: de naam uit de tabel. Maak 2 varianten en kies de meest "catchy": de melodie die je na één keer
   luisteren kunt nafluiten.
4. Als er een optie *Exclude styles* is: `vocals, lyrics, choir, rap, dubstep, heavy drums, distorted guitar,
   trap, EDM drop, orchestra, sad, dark, aggressive`.
5. Download MP3, hernoem exact zoals in de tabel, upload in `music/`.

Samenhang: alle nummers delen dezelfde "keukenfamilie" (ukelele, marimba/klokkenspel, zachte bas, houten en
kleine percussie zoals shaker, woodblock, zacht handgeklap) en zitten tussen 84 en 96 BPM. Elke keuken
voegt één eigen kleur toe. Zo klinkt het als één spel en toch voelt elke keuken anders.

---

## 1. `menu.mp3` - Menu (warm, uitnodigend, rustig)

```
Cozy relaxed instrumental for a cute mobile game menu, 88 BPM, C major. Warm ukulele strums and a soft
upright bass, a simple catchy 4-bar melody played on marimba and glockenspiel that repeats and is easy to
whistle, light percussion with shaker, woodblock and gentle finger snaps, a hint of vinyl crackle and kitchen
ambience. Calm, friendly, sunny Sunday-morning kitchen feeling, playful but never busy, no tension. Steady
volume, no intro build-up, no drums fill, no fade out, ends on the same chord it starts so it loops seamlessly.
Instrumental only, no vocals, no words. Lo-fi acoustic pop, chill, Nintendo-style cozy game soundtrack.
```

## 2. `keuken-1-houten-plank.mp3` - Houten plank (levels 1-5, zonnig, houtig)

```
Light upbeat acoustic instrumental for the first levels of a cute mobile game, 92 BPM, C major. Fingerpicked
ukulele and nylon guitar, a catchy whistled-style hook played on marimba (4 bars, repeated, very memorable),
wooden percussion: cajon, woodblock, claves, soft shaker, a warm plucked bass. Bright, sunny, encouraging,
easy-going, like a wooden kitchen on a summer morning. Rhythmic but relaxed, no heavy drums, no cymbals.
Even loudness from first to last second, no intro, no outro, no fade, loops seamlessly on the same chord.
Instrumental only, no vocals. Folk pop, chillhop, cozy game soundtrack.
```

## 3. `keuken-2-marmeren-blad.mp3` - Marmeren blad (levels 6-10, elegant, licht jazzy)

```
Elegant relaxed jazz-pop instrumental for a cute mobile game, 90 BPM, F major. Soft felt piano chords, a
warm upright bass walking gently, brushed drums with light rim clicks and a shaker, a catchy 4-bar vibraphone
melody that repeats and sticks in your head, occasional glockenspiel sparkle. Classy, smooth, unhurried, like
a bright marble kitchen in a fancy cafe, still playful and friendly. Keep the same uke-and-marimba family as
a cozy game soundtrack, just dressed up a little. Steady volume, no intro, no solo section, no fade out,
seamless loop ending on the opening chord. Instrumental only, no vocals. Lounge, bossa-tinged, lo-fi jazz.
```

## 4. `keuken-3-leisteen.mp3` - Leisteen (levels 11-15, koel, minimal, gefocust)

```
Cool minimal downtempo instrumental for a cute mobile game, 88 BPM, D dorian (warm minor, not sad). Soft
electric piano (Rhodes) chords, a round sub bass, finger snaps and a tight shaker groove with muted kick, a
catchy 4-bar melody on kalimba doubled by marimba that repeats and is easy to hum, airy pad in the
background. Calm and focused, slightly mysterious slate-grey kitchen at dusk, modern and clean, never dark
or tense. Steady volume, no build-up, no drop, no fade out, ends on the same chord it starts for a seamless
loop. Instrumental only, no vocals. Chillhop, lo-fi beats, cozy puzzle game soundtrack.
```

## 5. `keuken-4-bamboe.mp3` - Bamboe (levels 16-20, zen, licht Aziatisch getint)

```
Serene zen instrumental for a cute mobile game, 86 BPM, G major pentatonic. Plucked koto-like strings and
bamboo flute (shakuhachi style, soft, no breathy noise), kalimba and marimba playing a catchy 4-bar
pentatonic melody that repeats and is easy to whistle, gentle taiko-light hand percussion, soft shaker, a
warm plucked bass, subtle water drops and wind chimes in the background. Peaceful bamboo garden kitchen,
fresh and green, relaxing but with a steady playful groove. Even volume, no intro, no silence, no fade out,
seamless loop ending on the opening chord. Instrumental only, no vocals. Asian-flavoured chillhop, lo-fi,
cozy game soundtrack.
```

## 6. `keuken-5-koperen-blad.mp3` - Koperen blad (levels 21-25, warm, goudkleurig, bossa)

```
Warm golden bossa-nova lounge instrumental for a cute mobile game, 94 BPM, Bb major. Nylon guitar bossa
pattern, a soft muted trumpet playing a catchy 4-bar melody that repeats and is instantly memorable, warm
vibraphone answers, upright bass, shakers, soft bongos and rim clicks, a touch of Hammond organ pad. Rich,
copper-and-honey coloured kitchen, confident and smooth but still relaxed and friendly, no big brass hits,
no loud drums. Steady volume throughout, no intro, no fade out, seamless loop ending on the opening chord.
Instrumental only, no vocals. Bossa nova, lounge, lo-fi, cozy game soundtrack.
```

## 7. `keuken-6-nachtkeuken.mp3` - Nachtkeuken (level 26 en hoger, dromerig, nachtelijk)

```
Dreamy nocturnal lo-fi instrumental for the late levels of a cute mobile game, 82 BPM, A minor with warm
major lifts (gentle, not sad). Music box and celesta playing a catchy 4-bar lullaby-like melody that repeats
and is easy to hum, soft marimba echoes, slow felt piano chords, a deep warm bass, muted kick and soft brush
snare, vinyl crackle, distant night crickets, a sprinkle of twinkling bells. Calm, cozy midnight kitchen lit
by the fridge, dreamy and safe, with a slow steady groove that keeps you playing. Even volume, no intro, no
fade out, seamless loop on the same chord. Instrumental only, no vocals. Lo-fi hip hop, ambient pop, cozy
game soundtrack.
```

## Tips voor het kiezen

- Fluittest: kun je de melodie na één keer meefluiten? Dan is hij catchy genoeg.
- Rusttest: zet het nummer 3 keer achter elkaar op terwijl je iets anders doet. Ergert het? Weg ermee.
- Let op dat Suno er geen zang in sluipt ("ooh", "la la"): dan opnieuw genereren met Instrumental aan.
- Het volume in het spel staat op 55 procent en elke keuken vloeit 1,2 seconde over, dus de nummers mogen
  gerust even hard klinken; maak er geen een extra zacht of extra hard.
