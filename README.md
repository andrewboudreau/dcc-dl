# DCC: Dragon's Lair

A small fan project: a *Dragon's Lair*-style reaction game set in the *Dungeon Crawler Carl* universe.
Watch the scene, and when the cue flashes, hit the right move before the timer runs out.
If you're wrong or too slow, you die and replay the scene.

## Play

```sh
npm start            # or: python3 -m http.server 8080
```

Open http://localhost:8080. Controls: arrows / WASD to move, Space / Enter for action. On touch devices, use the on-screen pad.

> The game uses ES modules, so it has to be served over HTTP. Opening `index.html` directly from disk won't work.

## Test

```sh
npm test
```

## Layout

| File | What |
|---|---|
| `src/engine.js` | Pure game state machine (phases, timing, lives, score). No DOM, so it's unit-tested. |
| `src/scenes.js` | Scene and beat data. Add content here. |
| `src/main.js` | Browser glue: input, rendering, sound blips. |
| `test/` | `node --test` tests for the engine. |

Each beat in a scene is `{ text, input, death, success?, timeout?, lead?, window? }`.
The engine waits `lead` ms, flashes the cue, then gives the player `window` ms to press `input`.

## Ideas / next steps

- Art or animation per beat (canvas sprites or video clips, Dragon's Lair style)
- Hard mode: hide the cue arrow so you have to read the scene
- More floors and a System AI announcer with random quips
- Achievements and loot boxes between scenes
- Save high scores

---
Unofficial fan project. *Dungeon Crawler Carl* belongs to Matt Dinniman; *Dragon's Lair* belongs to its respective owners.
