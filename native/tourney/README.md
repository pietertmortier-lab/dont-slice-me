# Keukentoernooi server (Firebase)

The game ships with a simulated division (49 seeded opponents) so the whole tournament can be played and tested without a server. This folder holds the real backend: one HTTPS Cloud Function with five actions, a scheduled close on Sunday 23:00 (Europe/Brussels), Firestore rules, and anonymous Firebase Auth for identity.

## Deploy (once, on the developer's PC)

1. https://console.firebase.google.com: create a project `dont-slice-me`, register a **Web app** (its `firebaseConfig` goes into `native/bridge.js` as `FIREBASE_CONFIG`), enable **Authentication → Anonymous** and **Firestore** (production mode, `europe-west1`). Cloud Functions need the Blaze plan.
2. Install a current Node LTS (24 or newer) and the Firebase CLI: `npm install -g firebase-tools`, then `firebase login`.
3. In this folder: `npm install`, `firebase use --add` (pick the project), `firebase deploy --only functions,firestore:rules`.
4. Copy the URL of the `tourney` function from the deploy output into `native/bridge.js` (`FV_TOURNEY_URL`). The Capacitor app then talks to the server; the web version keeps the simulation.

## API (POST JSON, `Authorization: Bearer <Firebase ID token>`)

| action   | body                                        | reply                                                |
|----------|---------------------------------------------|------------------------------------------------------|
| `submit` | `ev, score, seconds, level, division, name` | `{ ok, group, division, week }` (best score is kept) |
| `ladder` | `level, division`                           | `{ rows: [{name, score, me}], rank, event, week }`   |
| `result` | –                                           | `{ result: { rank, prize, nextDivision, fragment } }` once per week |
| `meter`  | –                                           | `{ total }` forks of the hunt this week              |
| `fork`   | `n`                                         | adds forks to the meter                               |

Plausibility: a score above `seconds × MAX_PER_SEC[event] + 50` is refused. Groups fill to 50 per division in order of arrival; a player stays in their group for the week. `closeWeek` writes a `results/{uid}` document per player (rank, prize, promotion/relegation, fragment for the top 10) that the client claims once.

## Costs

Firestore reads are the main cost: one ladder read per screen open (≤ 50 documents). At 10,000 players that is a few euros a month on the Blaze plan; the Spark plan covers the first tests.
