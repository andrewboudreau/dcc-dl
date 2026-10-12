// Core game state machine. Pure logic: no DOM, no timers.
// The host calls update(now) every frame and press(input, now) on input,
// then reads `game.state` to render.

export const INPUTS = ['up', 'down', 'left', 'right', 'action'];

export const TIMING = {
  intro: 1800,    // scene title card
  lead: 1200,     // default: narration shown before the cue appears
  window: 1500,   // default: time to react once the cue appears
  success: 700,   // pause after a correct move
  minHold: 800,   // death/clear screens ignore input this long (no accidental skips)
};

export const START_LIVES = 3;

export class Game {
  constructor(scenes) {
    validateScenes(scenes);
    this.scenes = scenes;
    this.reset();
  }

  reset() {
    this.state = {
      phase: 'title',
      phaseStart: 0,
      sceneIndex: 0,
      beatIndex: 0,
      lives: START_LIVES,
      score: 0,
      message: '',
      lastEvent: null, // 'cue' | 'success' | 'death' | 'clear' — for sound/fx hooks
    };
  }

  get scene() {
    return this.scenes[this.state.sceneIndex];
  }

  get beat() {
    return this.scene.beats[this.state.beatIndex];
  }

  // 0..1 of the reaction window remaining, for the timer bar.
  windowRemaining(now) {
    if (this.state.phase !== 'cue') return 0;
    const w = this.beat.window ?? TIMING.window;
    return Math.max(0, 1 - (now - this.state.phaseStart) / w);
  }

  update(now) {
    const s = this.state;
    const elapsed = now - s.phaseStart;
    switch (s.phase) {
      case 'intro':
        if (elapsed >= TIMING.intro) this.#beginBeat(now);
        break;
      case 'lead':
        if (elapsed >= (this.beat.lead ?? TIMING.lead)) this.#enter('cue', now, this.beat.text, 'cue');
        break;
      case 'cue':
        if (elapsed >= (this.beat.window ?? TIMING.window)) this.#die(this.beat.timeout ?? this.beat.death, now);
        break;
      case 'success':
        if (elapsed >= TIMING.success) {
          if (s.beatIndex + 1 < this.scene.beats.length) {
            s.beatIndex++;
            this.#beginBeat(now);
          } else {
            this.#enter('clear', now, this.scene.clear, 'clear');
          }
        }
        break;
    }
  }

  press(input, now) {
    const s = this.state;
    const elapsed = now - s.phaseStart;
    switch (s.phase) {
      case 'title':
        this.reset();
        this.#beginScene(0, now);
        break;
      case 'intro':
        this.#beginBeat(now); // skip the title card
        break;
      case 'cue': {
        const beat = this.beat;
        if (input === beat.input) {
          const w = beat.window ?? TIMING.window;
          s.score += 100 + Math.round(100 * Math.max(0, 1 - elapsed / w)); // speed bonus
          this.#enter('success', now, beat.success ?? '', 'success');
        } else {
          this.#die(beat.death, now);
        }
        break;
      }
      case 'death':
        if (elapsed < TIMING.minHold) break;
        if (s.lives > 0) this.#beginScene(s.sceneIndex, now);
        else this.#enter('gameover', now, 'Your crawl has ended. The audience is already changing the channel.');
        break;
      case 'clear':
        if (elapsed < TIMING.minHold) break;
        if (s.sceneIndex + 1 < this.scenes.length) this.#beginScene(s.sceneIndex + 1, now);
        else this.#enter('victory', now, 'You survived the lair. The System is mildly impressed. Mildly.');
        break;
      case 'gameover':
      case 'victory':
        if (elapsed >= TIMING.minHold) this.reset();
        break;
      // 'lead' and 'success': input ignored. Only the cue window counts.
    }
  }

  #enter(phase, now, message = '', event = null) {
    Object.assign(this.state, { phase, phaseStart: now, message, lastEvent: event });
  }

  #beginScene(index, now) {
    this.state.sceneIndex = index;
    this.state.beatIndex = 0;
    this.#enter('intro', now, this.scenes[index].intro);
  }

  #beginBeat(now) {
    this.#enter('lead', now, this.beat.text);
  }

  #die(message, now) {
    this.state.lives--;
    this.#enter('death', now, message, 'death');
  }
}

export function validateScenes(scenes) {
  if (!Array.isArray(scenes) || scenes.length === 0) throw new Error('No scenes');
  for (const scene of scenes) {
    for (const key of ['id', 'title', 'intro', 'clear']) {
      if (typeof scene[key] !== 'string') throw new Error(`Scene ${scene.id ?? '?'} missing "${key}"`);
    }
    if (!Array.isArray(scene.beats) || scene.beats.length === 0) throw new Error(`Scene ${scene.id} has no beats`);
    scene.beats.forEach((beat, i) => {
      const where = `${scene.id} beat ${i}`;
      if (!INPUTS.includes(beat.input)) throw new Error(`${where}: bad input "${beat.input}"`);
      if (typeof beat.text !== 'string') throw new Error(`${where}: missing text`);
      if (typeof beat.death !== 'string') throw new Error(`${where}: missing death`);
    });
  }
}
