# DCC: Dragon's Lair

A small fan project: a *Dragon's Lair*-style reaction game set in the *Dungeon Crawler Carl* universe.
Watch the scene, and when the cue flashes, hit the right move before the timer runs out.
If you're wrong or too slow, you die and replay the scene.

## Play

Live: https://andrewboudreau.github.io/dcc-dl/ (storyboard: https://andrewboudreau.github.io/dcc-dl/storyboard.html)

To run it locally:

```sh
npm start            # or: python3 -m http.server 8080
```

Open http://localhost:8080 to play, or http://localhost:8080/storyboard.html for the storyboard. Controls: arrows / WASD to move, Space / Enter for action. On touch devices, use the on-screen pad.

> The game uses ES modules, so it has to be served over HTTP. Opening `index.html` directly from disk won't work.

## Deploy

Every push runs the tests. Pushes to `main` also deploy to GitHub Pages (`.github/workflows/pages.yml`).

## Test

```sh
npm test
```

## Layout

| File | What |
|---|---|
| `src/engine.js` | Pure game state machine (phases, timing, lives, score). No DOM, so it's unit-tested. |
| `src/scenes.js` | Scene and beat data. Add content here. |
| `src/sketches.js` | Rough storyboard sketches (inline SVG), keyed by scene/beat/frame. Shown in-game and on the storyboard. |
| `src/main.js` | Browser glue: input, rendering, sound blips. |
| `storyboard.html` | Every beat as three panels (setup, success, death), with a placeholder wherever a sketch is missing. |
| `docs/book-1-notes.md` | Book 1 story notes: what we've confirmed, what's from memory, open questions, and which scenes are canon. |
| `test/` | `node --test` tests for the engine. |

Each beat in a scene is `{ text, input, death, success?, timeout?, lead?, window? }`.
A beat with no `input` is a cutscene, shown for `hold` ms (any key skips). Add `system: true` to style it as a System AI message.
Dev shortcut: `?scene=<id>` jumps straight to a scene, e.g. `/?scene=registration`.
The engine waits `lead` ms, flashes the cue, then gives the player `window` ms to press `input`.

## Ideas / next steps

- Sketch the rest of the storyboard (Goblin Hallway, Dragon's Lair), then replace the sketches with finished art or animation
- Hard mode: hide the cue arrow so you have to read the scene
- More floors and a System AI announcer with random quips
- Achievements and loot boxes between scenes
- Save high scores

---
Unofficial fan project. *Dungeon Crawler Carl* belongs to Matt Dinniman; *Dragon's Lair* belongs to its respective owners.
