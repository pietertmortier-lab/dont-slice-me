# Keukentoernooi server (Firebase)

The game ships with a simulated division (49 seeded opponents) so the whole tournament can be played and tested without a server. This folder holds the real backend: one HTTPS Cloud Function with nine actions (tournament, profile, friends), a scheduled close on Sunday 23:00 (Europe/Brussels), Firestore rules, and anonymous Firebase Auth for identity.

## Deploy (once, on the developer's PC)

1. https://console.firebase.google.com: create a project `dont-slice-me`, register a **Web app** (its `firebaseConfig` goes into `native/bridge.js` as `FIREBASE_CONFIG`), enable **Authentication → Anonymous** and **Firestore** (production mode, `europe-west1`). Cloud Functions need the Blaze plan.
2. Install a current Node LTS (24 or newer) and the Firebase CLI: `npm install -g firebase-tools`, then `firebase login`.
3. In this folder: `npm install`, `firebase use --add` (pick the project), `firebase deploy --only functions,firestore` (rules and the composite index for the group lookup).
4. Copy the URL of the `tourney` function from the deploy output into `native/bridge.js` (`FV_TOURNEY_URL`). The Capacitor app then talks to the server; the web version keeps the simulation.

## API (POST JSON, `Authorization: Bearer <Firebase ID token>`)

| action   | body                                        | reply                                                |
|----------|---------------------------------------------|------------------------------------------------------|
| `submit` | `ev, score, seconds, level, division, name` | `{ ok, group, division, week }` (best score is kept) |
| `ladder` | `level, division`                           | `{ rows: [{name, score, me}], rank, event, week }`   |
| `result` | –                                           | `{ result: { rank, prize, nextDivision, fragment } }` once per week |
| `meter`  | –                                           | `{ total }` forks of the hunt this week              |
| `fork`   | `n`                                         | adds forks to the meter                               |
| `profile` | `name, level, best, fruits, hat, streak, runs, stamps, division, weekKey, weekEv, weekScore` | `{ ok, code }`: upserts the public profile and hands out the player's friend code |
| `befriend` | `code` | `{ ok, friend, reward }` or `{ ok: false, error: 'unknown' \| 'self' \| 'full' }`: both players become friends; the first time the inviter gets a pending 300-sap reward |
| `friends` | – | `{ ok, code, friends: [profile…], rewards: [{ from, sap }] }`; pending rewards are handed out once |
| `unfriend` | `uid` | removes the friendship in both directions |
| `save` | `data` (FV1 code), `rev`, `level`, `runs` | stores the save blob of this identity unless the stored one is ahead |
| `load` | – | `{ ok, data, rev, level }`: the stored save, if any |
| `linkcode` | – | `{ ok, code }`: an eight-character code, valid ten minutes, to join this identity from another device |
| `link` | `code` | `{ ok, data }`: this device becomes an alias of the code's identity (`devices/{uid}.primary`) and receives its save |

Plausibility: a score above `seconds × MAX_PER_SEC[event] + 50` is refused. Groups fill to 50 per division in order of arrival; a player stays in their group for the week. `closeWeek` writes a `results/{uid}` document per player (rank, prize, promotion/relegation, fragment for the top 10) that the client claims once.

## Duels, challenges and rivals (v0.29)

- `duelfind` `{ day, level }` -> `{ opp }`: a finished entry of today's duel from a similar level band (its score, time and ghost path), or `null`.
- `duel` `{ day, score, seconds, level, fruit, name, ghost, t, vs, vsScore }`: stores my entry once per day (`duels/{day}/entries/{uid}`), notes the picked opponent, settles friend challenges whose both sides played.
- `challenge` `{ uid, day }`: challenges a friend to today's duel (`duels/{day}/challenges/{a_b}`); the loser pays 200 juice and wears the pan hat for a day (applied client-side from the note).
- `friends` now also takes `{ day }` and returns `notes` (duel results, challenges, picks, passes; handed out once) and today's `challenges`.
- `rivals` `{ level, keep }` -> two profiles just above my level (fresh views of `keep` while the week lasts); `passed` `{ uid }` notes a rival that I passed them.
- Deploy again after pulling: `firebase deploy --only functions,firestore` from this folder. No new indexes are needed (equality filters and a single-field order on `profiles.level`).

## Kitchens (v0.30)

- `profile` also takes `kitchen` `{ lv: {plank, oven, koelkast, vitrine}, tier, fruit, hat, tips, score }` and `friends` returns it per friend, so friends can visit each other's kitchen from their profile data.
- `tip` `{ uid, day }`: once per friend per day; the receiver gets 100 juice by note (`tips/{day_from_to}`), the giver pays 50 client-side.

## Duels per hour and friends by name (v0.32)

Deploy again: `firebase deploy --only functions,firestore` (or `npm run deploy`, which now does the same) from this folder. This deploys the function, the rules for the new collections and four composite indexes (`ghosts` by band and age; `challenges` by receiver and status, by receiver and age, by sender and age). Wait until the console shows the indexes as built (a few minutes) before testing. Optional, once: a TTL policy so ghosts of players who stopped disappear after three days (an active player overwrites his own 20 slots anyway): `gcloud firestore fields ttls update expireAt --collection-group=ghosts --enable-ttl --project=dont-slice-me`. Since v0.32.2 the TTL is also listed in `firestore.indexes.json` (`fieldOverrides`, ghosts.expireAt, `ttl: true`), so a deploy keeps it and no longer asks to delete it; if an older copy of the file ever asks "delete these field overrides?", answer N. Everything is backward compatible: older clients keep the day-based duel, the old `challenge` flow and instant code friendships; the new client falls back to them when `hello` is unknown.

| action | body | reply |
|--------|------|-------|
| `hello` | - | `{ ok, v: 32, caps: ['find', 'request', 'duel2'], inbox: { req, duel } }`: what this server can do and how many friend requests (of the last two weeks) and open friend duels wait (v0.32.3: `v: 33`, `duel3`, `inbox.notes`) |
| `duelfind` | `v: 2, day, level, seen: [seed], challenge?` | `{ opp: { id, seed, name, fruit, level, score, t, ghost } }` or `null`: a ghost of the last 48 h of my level band (then the bands next to it), never mine and never a seed in `seen`. With `challenge`: the friend's seed and ghost; the first call starts the friend duel (`playing`), a second call is answered only within 20 s (a retry after a slow answer), later `error: 'playing'`. No uid. |
| `duel` | `day, seed, score, seconds, level, fruit, name, ghost, t, quit, vsGhost, challenge?, challengeTo?` | `{ ok, stored, settled, challenge, error }`: stores the duel as a ghost in one of the player's 20 slots, at most 5 (+1) an hour per player, the window anchored at the duel's start (`{ stored: false, limit: true }` beyond); `seconds` is bounded by `t` (at most 95 s); `vsGhost` counts the played ghost (only on its own seed) for its owner's daily summary note; `challenge` settles a friend duel (also beyond the limit); `challengeTo` (a friend's uid) opens one (`error: 'already' \| 'notfriend' \| 'oldapp' \| 'seen' \| 'quit' \| 'limit'`). A friend duel that was started but whose score never comes counts as 0 after 3 minutes. A duel on the day's seed also writes the old daily entry. Without `seed` the old day-based action runs, with the same bound on `seconds`. |
| `challenge` | `uid, day` | unchanged, except `error: 'newapp'` when the friend's client plays friend duels v2 (an old challenge would never be settled) |
| `findplayer` | `q` | `{ players: [{ ref, name, level, fruit, tag, friend }] }`: exact name, and names that start with `q` from three letters; at most 8; only players whose new client allows it (`findable`); 20 searches per 10 minutes per player and 60 per address (`error: 'slow'`) |
| `friendreq` | `ref` | `{ ok, sent }`, or `{ ok, friend, reward, mutual }` when the other player had asked me already; asking again sends no second note; after a refusal `error: 'unknown'` for a week; `error: 'unknown' \| 'self' \| 'full' \| 'friends' \| 'slow'` (20 requests a day, 20 open per receiver; requests expire after two weeks) |
| `friendans` | `ref, yes` | accepts (both become friends, the requester gets a note) or refuses a request |
| `friends` | `day` | now also `requests: { in, out }` and `duels2` (every open or started friend duel v2 and the newest settled ones); the daily ghost summary arrives as a `ghostsum` note; each friend has `v2` (their client plays friend duels v2) |
| `profile` | also `findable`, `fruit` | stores `nameKey` (lowercase, without accents) when `findable` is true and the client version `cv`; every profile gets a public `ref` (10 characters, not the friend code) |

- Rewards: `befriend` and accepted requests pay `FRIEND_SAP` once per pair (`pairs/{a_b}`); the inviter at most 10 times (`inviteRewards`), the joiner at most 10 times (`joinRewards`).
- Privacy: name search returns name, level, fruit and a tag (`#` + three characters of `ref`); never a uid, a friend code, a save or activity. Ghost ids are a hash, not the uid. A player can switch `Anderen mogen mij vinden op naam` off; old clients are never findable. The search limit per address stores a hash of the address, never the address. Update privacy.html sections 5 and 6: findable by name (default on, can be switched off), friend requests (kept two weeks; a refusal one week), duel ghosts kept three days and several duels per hour.
- New collections (function only, deny-all rules): `ghosts`, `duelwin`, `limits`, `requests/{uid}/in|out|refused`, `challenges`, `duelsum`, `pairs`.
- Optional hardening for the owner: Firebase App Check on the function makes scripted anonymous accounts much harder.

## Duels per day, unlimited friend duels and duel tickets (v0.32.3)

Deploy: `firebase deploy --only functions` from this folder (only the function changed; the rules and the indexes stay as
they are, so `firebase deploy --only functions,firestore` does no harm either). Deploy it together with the v0.32.3 game:
an older game keeps working (it still limits itself to five duels an hour), and the new game also works against the
v0.32 server, except that friend challenges then still count against that server's hourly limit.

- Random (public) duels: at most 15 per player per game day (`duelwin/{uid}` now holds `{ day, n, gk }`; the day is the
  game day, 07:00, of the duel's start): 5 free, 2 more after a video each and up to 8 with duel tickets. The client keeps
  the exact split; the server only refuses the 16th (`{ stored: false, limit: true }`). Duel tickets are earned only by
  completing an album set (10 per set in the first phase, 30 in the second); they live in the save, the server never sees them.
- Friend duels are unlimited: a duel with `challengeTo` (you challenge a friend) or `challenge` (you play a friend's
  challenge) never counts and its ghost never goes into the public `ghosts` pool. No sap prize for friend duels (client).
- Challenges are per direction: `challenges/{from}-{to}` (v0.32 used `{a_b}`; open ones keep working). `error: 'already'`
  only while your own challenge to that friend is open, so the friend can challenge you back meanwhile.
- `hello` -> `{ ok, v: 33, caps: [..., 'duel3'], inbox: { req, duel, notes } }`: `notes` counts the notes and rewards that
  wait. The game asks `hello` at start, when it comes back to the foreground and every three minutes while it is open, and
  `friends` only when something waits; the challenge and the result arrive as in-game cards, never as phone notifications.
- Notes: a challenge note has `id` (the card's Speel button plays it); a result note has `ch: 'from'` (the challenger's) or
  `ch: 'to'` (the friend's), and `forfeit: true` when a started challenge never got its score.
- `profile` stores `pv` (the v0.32.3 game sends `pv: 33`: it polls for challenges and shows them as in-game cards; an older
  game that sends `findable` resets it to 0), and every friend row (`profileView`) has `v3: pv >= 33` next to `v2`. The game
  tells a challenger before the run when a friend has `v2` but not `v3` (an app that only shows the challenge under
  Vrienden > Duels), and lets him send it anyway.
- Plausibility (`seconds` bounded by `t`, at most 15 sap a second + 50) and everything else is unchanged.

## Save history (v0.32.2)

Next to the one cloud save per player (`saves/{uid}`), the `save` action keeps one copy per day: the first save of each UTC
day goes to `saves/{uid}/history/{YYYY-MM-DD}` (`data`, `rev`, `level`, `runs`, `savedMs`), and copies older than the last 7
days are deleted. Cost: one extra write (and one small list) per player per day.

Restoring a broken save by hand (Firebase console > Firestore):
1. Find the player's uid: `profiles` (by `name`) or `codes/{friend code}`.
2. Open `saves/{uid}/history` and pick the last day before the problem; copy its `data` (it starts with `FV1.`).
3. Put that `data` into `saves/{uid}` (field `data`) and set its `rev` to the copy's `rev`, so the server and the device agree.
4. Send the same `FV1.` code to the player: tandwiel > Je voortgang meenemen > opslagcode plakken. The game restarts with it.
Deleting a player on request (privacy.html section 14) includes `saves/{uid}/history`.

## Live friend duels and push (v0.32.5)

A friend invites a friend to a live 1-on-1 duel: an in-game card (or a push when the friend's app is closed), a small lobby, 2 minutes to
come back for whoever is not there (with one push; the 2 minutes count from that push), a 15 s countdown or the host's [Start nu], a start
fixed 6 s ahead on the server clock (so both phones show the whole 3-2-1),
both play the same round at the same moment and see each other's fruit (5 s behind) and score, and the server decides the winner. No
realtime listeners and no scheduler: the lobby state is derived from timestamps (the 2-minute rule holds even when nobody polls) and is
written by whoever calls next. Friend duels stay unlimited and give no sap; the head-to-head record and the counted wins are status.

### Actions (POST, `Authorization: Bearer <id token>`; every `ld*` reply has `now`, the server time in ms)

| action | body | reply / notes |
|---|---|---|
| `hello` | - | adds `caps` `live`, `push` (only when the secret is set and `web-push` loads), `ldpow` (when a duel power exists; none yet) and `vapid` (the public key); writes `firstMs` once from Firebase Auth |
| `ldpoll` | `busy, lang, hide` | `{ inv, out, lobby }`: presence (written at most every 25 s), the invite for me, my own invite (a refusal or expiry once), my lobby (read-only evaluation; a closed or finished one once); settles a duel nobody reports any more (110 s after its start) |
| `ldfriends` | - | `{ on: [{ uid, lv, on, busy, pu }] }`: the green dots, friends only, never for a player who hides it |
| `ldinvite` | `to, again` | `{ id, exp, here, pushed }` or `error`: `notfriend, oldapp, theyasked, inlobby, open, offline, busy, noday, soon (why no / same / miss), slow`; one transaction. `miss`: two invites in a row to the same friend stayed unanswered, the next one 30 minutes after the last. For a friend who hides her online status the reply is always `here: false` (and `pushed: 1` when her game is open) |
| `ldcancel` | `id` | `{ cancelled }`; one transaction |
| `ldanswer` | `id, yes, fruit, v, pw` | yes: `{ lobby }` (a second tap or device gets the same lobby; the inviter's hourly invite count goes down by one); no: `{ refused: true }`; `gone, cancel, busy, inlobby`; one transaction |
| `ldlobby` | `id, fruit, leave, start, act, v, pw` | `{ lobby }`; `gone` (with the view only for a seat that was removed: `kickedMe`; nothing for anybody else), `otherdevice`; joining needs `act` (a tap); a joined seat's poll keeps the presence fresh (every 25 s); the push decision; one transaction |
| `ldset` | `id, powers, fruit` | host only, before the start: `nopowers` while no power exists, `fruit` 'any' or 'same:<fruit>' |
| `ldbeat` / `ldend` / `ldres` | `id, t, s, k0, p, dead, pz, pause, lag, ev` (+ `quit, died, ghost, gt`) | `{ startAt, started, o, evOk, evNo, res, wait }`; `early, late, left, gone, otherdevice`; positions at most once a second, `t` bounded by server time, `s` by 15 sap a second + 50, frozen after the cut; one final; the beats keep the presence fresh (every 25 s, busy); `ldres` only asks for the result (the game-over calls it every 3 s) |
| `ldpush` | `kind 'web' / 'fcm', sub / tok, lang, inv, off, tz` | `{ n }`; `endpoint` (only known push services), `token` |
| `friends` | - | each friend also `rec { w, l, d }, lv, on, busy, pu`; top level `ld` (my counted wins) |
| `duel` | - | a settled 24 h challenge writes the record and the counted wins; the reply has `ld` (my stats, `r`, `rec`, `counted`, `why`) |
| `duelfind` v2 | - | a challenge made from a live no-show has `opp.same: 1` (the client plays the same round) |

The duel powers are reserved, not built: events in the beats (`ev: [{ i, k, lead, dur, to }]`) are stamped by the server on the shared
duel clock (`at = now - startAt + lead`) and relayed to the other phone, but only when the lobby has `opts.powers`, the kind exists in
`LD_POWERS` (empty) and in every seat's `pw`, and `ldPowerOk` (a stub that returns false) agrees.

### Documents (all function-only; `expireAt` has a TTL policy)

| document | what | kept |
|---|---|---|
| `profiles/{uid}` | new fields `lv, ldSeen, ldBusy, ldHide, ldIn, ldOut, ldLast, ldNo, ldMiss, ldLobby, ldDone, ldPuUntil, ldTz, firstMs, actDay, actBits, actFrom` | with the profile |
| `ldinv/{id}` | the invite (`from, to, names, exp, state, lobby`) | about a day after it ends (TTL) |
| `ldlobby/{id}` and `ldlobby/{id}/live/{uid}` | the lobby (seats, times, seed, result) and each player's run (positions, score, events, final, ghost) | about a day (TTL) |
| `ldpush/{uid}` | at most 4 push subscriptions (web endpoint and keys, or an FCM token; language, time zone, until, `fail`) | 60 days after the last refresh (TTL); at once on 404/410; after 5 pushes in a row that the push service refused |
| `h2h/{a_b}` | the record of a pair of friends and their counted wins today | as long as the players exist |
| `duelstats/{uid}` | counted wins (`won`), wins, losses, draws, played, distinct friends | as long as the player exists |
| `friends/{uid}/of/{other}` | `w, l, d`: a mirror of the record on the friendship | with the friendship |
| `limits/ldinv_{uid}`, `limits/ldpushin_{uid}` | 10 invites an hour that nobody accepted (an accepted invite gives its count back, so rematches are unlimited), 3 invite pushes an hour to one player | as the other limits |

A win counts for the later milestone ladder only when the server decided a 1-on-1 friend duel (live or 24 h challenge) and none of these
holds for the loser: a draw, a forfeit, stopped or dropped out, played less than 30 s, less than 5 sap, friends for less than 24 h, an
account younger than 7 days (Firebase Auth), below level 15, played on fewer than 3 game days of the last 14; and at most 3 a day per pair
and 10 a day per player (the game day starts at 07:00 Belgian time). The played days are recorded only from this version on (`actFrom`
is the first recorded game day of a profile): on a profile's first and second recorded day 1 and 2 played days are enough, so wins count
from the day of the update; from the third day on the rule is 3 of the last 14.

### Deploy (Windows, in the repo; the key pair never lands in a file)

Step 1, ONLY THE VERY FIRST TIME: make the Web Push key pair and store it straight in Google Secret Manager.

```
cd prototypes\dont-slice-me\native\tourney
npx web-push@3.6.7 generate-vapid-keys --json | firebase functions:secrets:set LIVEDUEL_VAPID --data-file -
```

Never run that line again: a new key pair makes every existing web subscription useless (the push services answer 403), so nobody gets
a notification until each player's game has noticed the new key (it then subscribes again by itself, at the latest the next time the
game is opened; the server drops a subscription after 5 refused pushes in a row). The function declares the secret, so a deploy stops
without it.

Step 2, every deploy:

```
cd prototypes\dont-slice-me\native\tourney
npm install
firebase deploy --only functions,firestore
```

The deploy adds the rules, the four TTL policies (`ldinv`, `ldlobby`, `live`, `ldpush`) and gives the function access to the secret.
Never put the keys in `index.html`, `bridge.js` or a commit. Then publish the game (`index.html`, `sw.js`).

The Android app later (nothing on the server): add an Android app in the Firebase console (package `com.dontsliceme.app`), put
`google-services.json` in `native\android\app\`, `cd prototypes\dont-slice-me\native` and `npm install @capacitor/push-notifications@6`,
set `const FCM_READY = true;` in `native\bridge.js`, then `npm run sync` and build. Until then the app behaves like a browser without push.

### Cost (measured on the mock, billed like Firestore, the device lookup of every call included)

| scenario | reads | writes | calls |
|---|---|---|---|
| one live duel, both play 90 s (20 s waiting, about 20 s lobby, the run, the result) | 360 | 104 | 98 |
| one live duel, one player cut at 10 s (his game-over asks for the result every 3 s: 4 reads a call) | 360 | 74 | 98 |
| Vrienden open for 2 minutes with 50 friends (green dots every 60 s above 20 friends) | 329 | 5 | 16 |
| one minute on a menu (presence every 10 s) | 12 | 2 | 6 |

At 0.03-0.06 dollar per 100,000 reads and 0.09-0.18 per 100,000 writes one live duel costs about 0.02-0.04 dollar cent. With 800 players a
day (10 minutes on menus, one live duel per five players) that is about 3 to 6 dollar a month; nothing costs anything when nobody plays.
Levers if needed: the menu poll every 20 s instead of 10 s, beats every 4 s.

### Deleting a player's data on request (privacy.html section 14)

Besides the existing list: the live-duel fields of `profiles/{uid}` (above); `ldpush/{uid}`; `duelstats/{uid}`; the `h2h` documents whose
`a` or `b` is the uid (console: filter `a == uid`, then `b == uid`); `limits/ldinv_{uid}` and `limits/ldpushin_{uid}`. The mirrors on
`friends/*/of/{uid}` go with the friendships. Invites, lobbies and live documents expire by themselves within about one to two days
(Firestore TTL deletes typically within 24 hours after `expireAt`).

## Costs

Firestore reads are the main cost: one ladder read per screen open (≤ 50 documents). At 10,000 players that is a few euros a month on the Blaze plan; the Spark plan covers the first tests.
