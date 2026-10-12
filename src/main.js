import { Game } from './engine.js';
import { SCENES } from './scenes.js';
import { sketch } from './sketches.js';

const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'action', Enter: 'action',
};

const GLYPH = { up: '↑', down: '↓', left: '←', right: '→', action: '✊' };

const game = new Game(SCENES);
const startScene = SCENES.findIndex((sc) => sc.id === new URLSearchParams(location.search).get('scene'));
if (startScene >= 0) game.startAt(startScene, performance.now());
const $ = (id) => document.getElementById(id);
const el = {
  stage: $('stage'), art: $('art'), title: $('title'), text: $('text'), cue: $('cue'),
  timer: $('timer'), timerFill: $('timer-fill'), prompt: $('prompt'),
  lives: $('lives'), score: $('score'), scene: $('scene-name'),
};

// --- tiny WebAudio blips -------------------------------------------------
let audio;
function blip(freq, ms, type = 'square') {
  try {
    audio ??= new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + ms / 1000);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + ms / 1000);
  } catch { /* no audio, no problem */ }
}
const SFX = {
  cue: () => blip(880, 120),
  success: () => blip(660, 150, 'triangle'),
  death: () => blip(110, 600, 'sawtooth'),
  clear: () => { blip(523, 150, 'triangle'); setTimeout(() => blip(784, 250, 'triangle'), 150); },
};

// --- input ---------------------------------------------------------------
function press(input) {
  game.press(input, performance.now());
}
addEventListener('keydown', (e) => {
  const input = KEYMAP[e.code];
  if (!input || e.repeat) return;
  e.preventDefault();
  press(input);
});
document.querySelectorAll('[data-input]').forEach((btn) => {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    press(btn.dataset.input);
  });
});

// --- render --------------------------------------------------------------
const PROMPTS = {
  title: 'Press any key (arrows / WASD, Space = action)',
  intro: '',
  death: 'Press any key to respawn',
  clear: 'Press any key to continue',
  gameover: 'Press any key to start over',
  victory: 'Press any key to play again',
};

let lastPhaseStart = -1;

function render(now) {
  const s = game.state;

  if (s.phaseStart !== lastPhaseStart) {
    lastPhaseStart = s.phaseStart;
    if (s.lastEvent) SFX[s.lastEvent]?.();

    el.stage.dataset.phase = s.phase;
    el.stage.dataset.system = ['lead', 'cue'].includes(s.phase) && game.beat.system ? 'yes' : '';
    el.title.textContent =
      s.phase === 'title' ? 'DUNGEON CRAWLER CARL' :
      s.phase === 'intro' ? game.scene.title :
      s.phase === 'death' ? 'YOU DIED' :
      s.phase === 'gameover' ? 'GAME OVER' :
      s.phase === 'victory' ? 'VICTORY' : '';
    el.text.textContent = s.phase === 'title'
      ? 'Dragon\'s Lair edition. Watch the scene. When the cue flashes, react. Too slow or wrong, and you die.'
      : s.message;
    const frame = { lead: 'setup', cue: 'setup', success: 'success', death: 'death' }[s.phase];
    const art = frame && sketch(game.scene.id, s.beatIndex, frame);
    el.art.innerHTML = art || '';
    el.cue.textContent = s.phase === 'cue' ? GLYPH[game.beat.input] : '';
    el.lives.textContent = '♥'.repeat(Math.max(0, s.lives));
    el.score.textContent = s.score;
    el.scene.textContent = s.phase === 'title' ? '' : game.scene.title;
  }

  const held = now - s.phaseStart >= 800;
  const cutscene = s.phase === 'lead' && !game.beat.input;
  el.prompt.textContent = cutscene ? 'Any key to skip' :
    PROMPTS[s.phase] && (s.phase === 'title' || held) ? PROMPTS[s.phase] : '';
  el.timerFill.style.width = `${game.windowRemaining(now) * 100}%`;
}

function frame(now) {
  game.update(now);
  render(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
