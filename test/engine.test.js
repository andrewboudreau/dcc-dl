import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game, TIMING, START_LIVES, validateScenes } from '../src/engine.js';
import { SCENES } from '../src/scenes.js';
import { sketch } from '../src/sketches.js';

const TINY = [
  {
    id: 'a', title: 'A', intro: 'intro a', clear: 'clear a',
    beats: [
      { text: 'jump', input: 'up', death: 'splat' },
      { text: 'duck', input: 'down', death: 'bonk', timeout: 'too slow' },
    ],
  },
  {
    id: 'b', title: 'B', intro: 'intro b', clear: 'clear b',
    beats: [{ text: 'hit', input: 'action', death: 'ow' }],
  },
];

// Drive a game to the start of the cue window for the current beat.
function toCue(game, t) {
  game.update(t += TIMING.intro);
  if (game.state.phase === 'lead') game.update(t += TIMING.lead);
  assert.equal(game.state.phase, 'cue');
  return t;
}

test('shipped scenes are valid', () => {
  assert.doesNotThrow(() => validateScenes(SCENES));
});

test('validation rejects bad input names', () => {
  assert.throws(() => validateScenes([{ ...TINY[0], beats: [{ text: 'x', input: 'jump', death: 'y' }] }]), /bad input/);
});

test('full clean run reaches victory', () => {
  const g = new Game(TINY);
  let t = 0;
  g.press('action', t);                 // title -> intro
  assert.equal(g.state.phase, 'intro');
  t = toCue(g, t);
  g.press('up', t);
  assert.equal(g.state.phase, 'success');
  g.update(t += TIMING.success);
  assert.equal(g.state.phase, 'lead');
  g.update(t += TIMING.lead);
  g.press('down', t);
  g.update(t += TIMING.success);
  assert.equal(g.state.phase, 'clear');
  assert.equal(g.state.message, 'clear a');
  g.press('action', t += TIMING.minHold);
  assert.equal(g.state.sceneIndex, 1);
  t = toCue(g, t);
  g.press('action', t);
  g.update(t += TIMING.success);
  g.press('action', t += TIMING.minHold);
  assert.equal(g.state.phase, 'victory');
  assert.equal(g.state.lives, START_LIVES);
  assert.equal(g.state.score, 3 * 200); // instant presses earn max speed bonus
});

test('input before the cue is ignored', () => {
  const g = new Game(TINY);
  g.press('action', 0);
  g.update(TIMING.intro);
  g.press('left', TIMING.intro + 10);
  assert.equal(g.state.phase, 'lead');
  assert.equal(g.state.lives, START_LIVES);
});

test('wrong input kills and restarts the scene', () => {
  const g = new Game(TINY);
  let t = 0;
  g.press('action', t);
  t = toCue(g, t);
  g.press('left', t);
  assert.equal(g.state.phase, 'death');
  assert.equal(g.state.message, 'splat');
  assert.equal(g.state.lives, START_LIVES - 1);
  g.press('action', t + 10);            // too soon: ignored
  assert.equal(g.state.phase, 'death');
  g.press('action', t += TIMING.minHold);
  assert.equal(g.state.phase, 'intro');
  assert.equal(g.state.beatIndex, 0);
});

test('timeout uses timeout message when present', () => {
  const g = new Game(TINY);
  let t = 0;
  g.press('action', t);
  t = toCue(g, t);
  g.press('up', t);
  g.update(t += TIMING.success);
  g.update(t += TIMING.lead);
  g.update(t += TIMING.window);
  assert.equal(g.state.phase, 'death');
  assert.equal(g.state.message, 'too slow');
});

test('losing all lives ends the game, then returns to title', () => {
  const g = new Game(TINY);
  let t = 0;
  g.press('action', t);
  for (let i = 0; i < START_LIVES; i++) {
    t = toCue(g, t);
    g.press('left', t);
    g.press('action', t += TIMING.minHold);
  }
  assert.equal(g.state.phase, 'gameover');
  g.press('action', t += TIMING.minHold);
  assert.equal(g.state.phase, 'title');
  assert.equal(g.state.lives, START_LIVES);
});

test('cutscene beats advance on their own and can be skipped', () => {
  const g = new Game([{
    id: 'c', title: 'C', intro: 'i', clear: 'done',
    beats: [
      { text: 'watch this' },
      { text: 'and this', hold: 500 },
      { text: 'now act', input: 'up', death: 'x' },
    ],
  }]);
  let t = 0;
  g.press('action', t);
  g.update(t += TIMING.intro);
  assert.equal(g.state.message, 'watch this');
  g.press('left', t += 10);             // any key skips a cutscene beat, never kills
  assert.equal(g.state.message, 'and this');
  assert.equal(g.state.lives, START_LIVES);
  g.update(t += 500);
  assert.equal(g.state.phase, 'lead');
  assert.equal(g.state.message, 'now act');
  g.update(t += TIMING.lead);
  assert.equal(g.state.phase, 'cue');
});

test('canon scenes are fully storyboarded', () => {
  for (const id of ['prologue', 'registration']) {
    const scene = SCENES.find((s) => s.id === id);
    scene.beats.forEach((beat, i) => {
      const frames = beat.input ? ['setup', 'success', 'death'] : ['setup'];
      for (const f of frames) assert.ok(sketch(id, i, f), `${id} beat ${i} missing ${f} sketch`);
    });
  }
});
