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

Deploy again: `firebase deploy --only functions,firestore` (or `npm run deploy`, which now does the same) from this folder. This deploys the function, the rules for the new collections and four composite indexes (`ghosts` by band and age; `challenges` by receiver and status, by receiver and age, by sender and age). Wait until the console shows the indexes as built (a few minutes) before testing. Optional, once: a TTL policy so ghosts of players who stopped disappear after three days (an active player overwrites his own 20 slots anyway): `gcloud firestore fields ttls update expireAt --collection-group=ghosts --enable-ttl --project=dont-slice-me`. Everything is backward compatible: older clients keep the day-based duel, the old `challenge` flow and instant code friendships; the new client falls back to them when `hello` is unknown.

| action | body | reply |
|--------|------|-------|
| `hello` | - | `{ ok, v: 32, caps: ['find', 'request', 'duel2'], inbox: { req, duel } }`: what this server can do and how many friend requests (of the last two weeks) and open friend duels wait |
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

## Costs

Firestore reads are the main cost: one ladder read per screen open (≤ 50 documents). At 10,000 players that is a few euros a month on the Blaze plan; the Spark plan covers the first tests.
