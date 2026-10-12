// Rough storyboard sketches as inline SVG (viewBox 160x90).
// Drawn in currentColor so the same sketch works on the dark game screen and
// on the paper-white storyboard page. Donut uses the --donut accent.
//
// Keyed by `${sceneId}/${beatIndex}/${frame}`, frame = setup | success | death.
// Missing keys render as "sketch TBD" placeholders on the storyboard.

export const FRAMES = ['setup', 'success', 'death'];

// --- drawing kit ----------------------------------------------------------

const svg = (body) =>
  `<svg class="sketch" viewBox="0 0 160 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

// Stairs descend left -> right: step k spans x 16k..16k+16 at y 30+7k.
const stepTop = (k) => 30 + 7 * k;
const stairs = () => {
  let d = 'M0 30';
  for (let k = 0; k < 9; k++) d += ' h16 v7';
  return `<path d="${d}"/><path d="M0 6 L160 76" opacity=".6"/>`;
};
const railY = (x) => 6 + 0.4375 * x;

// Carl: stick figure, feet at (x, y), ~30 tall. Poses change arms/legs.
const POSES = {
  stand: { arms: (x, y) => `M${x - 6} ${y - 12} L${x} ${y - 20} L${x + 6} ${y - 12}`, legs: (x, y) => `M${x - 5} ${y} L${x} ${y - 10} L${x + 5} ${y}` },
  armsUp: { arms: (x, y) => `M${x - 5} ${y - 30} L${x} ${y - 20} L${x + 5} ${y - 30}`, legs: (x, y) => `M${x - 3} ${y} L${x} ${y - 10} L${x + 3} ${y}` },
  run: { arms: (x, y) => `M${x - 8} ${y - 16} L${x} ${y - 20} L${x + 7} ${y - 14}`, legs: (x, y) => `M${x - 8} ${y - 3} L${x} ${y - 10} L${x + 6} ${y}` },
  kick: { arms: (x, y) => `M${x - 7} ${y - 17} L${x} ${y - 20} L${x + 4} ${y - 26}`, legs: (x, y) => `M${x - 3} ${y} L${x} ${y - 10} L${x + 11} ${y - 9}` },
};
const carl = (x, y, pose = 'stand', rotate = 0) => {
  const p = POSES[pose];
  return `<g transform="rotate(${rotate} ${x} ${y - 15})">
    <circle cx="${x}" cy="${y - 26}" r="4"/>
    <path d="M${x} ${y - 22} V${y - 10}"/>
    <path d="M${x - 3} ${y - 21} L${x - 3} ${y - 14} M${x + 3} ${y - 21} L${x + 3} ${y - 14}" opacity=".5"/>
    <path d="${p.arms(x, y)}"/><path d="${p.legs(x, y)}"/>
  </g>`;
};

// Princess Donut: seated cat with a tiara, base at (x, y).
const donut = (x, y) => `<g style="color:var(--donut)">
  <ellipse cx="${x}" cy="${y - 3}" rx="4" ry="3"/>
  <circle cx="${x + 3}" cy="${y - 8}" r="2.5"/>
  <path d="M${x + 1.5} ${y - 10} l.5 -2.5 l1 2 l1 -2 l1 2 l.5 -2.5"/>
  <path d="M${x - 4} ${y - 2} q-4 -1 -3 -6"/>
</g>`;
const carlWithDonut = (x, y, pose) => carl(x, y, pose) + donut(x + 9, y - 19);

const rat = (x, y, s = 1) => `<g>
  <ellipse cx="${x}" cy="${y - 2.5 * s}" rx="${5 * s}" ry="${2.5 * s}"/>
  <circle cx="${x - 5 * s}" cy="${y - 3.5 * s}" r="${1.6 * s}"/>
  <path d="M${x + 5 * s} ${y - 2 * s} q${4 * s} ${2 * s} ${7 * s} ${-1 * s}"/>
</g>`;
const ratPile = (x, y, n, spread) =>
  Array.from({ length: n }, (_, i) => rat(x + ((i * 37) % spread) - spread / 2, y - ((i * 13) % 9), 0.8)).join('');

const speedLines = (x, y) => `<path d="M${x} ${y} h10 M${x + 3} ${y + 5} h12 M${x} ${y + 10} h9" opacity=".6"/>`;
const label = (x, y, text) => `<text x="${x}" y="${y}" font-size="8" fill="currentColor" stroke="none" font-family="inherit">${text}</text>`;
const hole = (x, y, w) => `<path d="M${x} ${y} q${w / 2} 14 ${w} 0 q${-w / 2} 4 ${-w} 0z" fill="currentColor" opacity=".25"/>`;

// --- Scene 1: The Stairwell ----------------------------------------------

const SKETCHES = {
  'stairwell/0/setup': svg(
    stairs() + carlWithDonut(72, stepTop(4)) +
    // crack under Carl's step, chunks falling
    `<path d="M64 61 l4 2 l4 -2 l4 2 l4 -2" stroke-dasharray="2 2"/><path d="M70 74 l3 2 M78 80 l2 2 M64 82 l2 3" opacity=".7"/>` + label(96, 30, 'CRACK'),
  ),
  'stairwell/0/success': svg(
    stairs() + hole(62, 66, 34) +
    carl(98, railY(98) + 30, 'armsUp') + donut(107, railY(98) + 12) +
    `<path d="M92 ${railY(98) + 34} l-2 4 M104 ${railY(98) + 34} l2 4" opacity=".6"/>`,
  ),
  'stairwell/0/death': svg(
    `<rect x="0" y="0" width="160" height="90" fill="currentColor" opacity=".18" stroke="none"/>` +
    `<path d="M0 30 h50 v6 h-50" />` + donut(40, 30) +
    carl(95, 78, 'armsUp', 160).replace('<g ', '<g opacity=".8" ') +
    `<path d="M88 40 v-10 M96 38 v-12 M104 40 v-10" opacity=".5"/>` + label(112, 24, 'aaaa...'),
  ),
  'stairwell/1/setup': svg(
    stairs() + carlWithDonut(56, stepTop(3)) + hole(98, 72, 40) +
    rat(108, stepTop(6) + 1) + rat(124, stepTop(7) + 1) + rat(92, stepTop(5) + 1) +
    ratPile(120, 86, 6, 30) + label(120, 20, 'SQUEAK'),
  ),
  'stairwell/1/success': svg(
    stairs() + `<g transform="rotate(-12 24 ${stepTop(1)})">${carl(24, stepTop(1), 'run')}</g>` + donut(33, stepTop(1) - 20) +
    speedLines(36, stepTop(1) - 20) + rat(90, stepTop(5) + 1) + rat(108, stepTop(6) + 1) + rat(122, stepTop(7) + 1),
  ),
  'stairwell/1/death': svg(
    stairs() + ratPile(72, stepTop(4), 12, 34) +
    // a hand sticking out of the pile
    `<path d="M74 ${stepTop(4) - 10} v-10 l-2 -3 M74 ${stepTop(4) - 20} l0 -4 M74 ${stepTop(4) - 20} l2 -3"/>` + label(96, 34, 'nom'),
  ),
  'stairwell/2/setup': svg(
    stairs() + carlWithDonut(64, stepTop(4)) +
    rat(102, 30, 2) + `<path d="M130 70 q-10 -40 -24 -40" stroke-dasharray="2 3" opacity=".6"/>` + label(4, 12, '!'),
  ),
  'stairwell/2/success': svg(
    stairs() + carl(64, stepTop(4), 'kick') + donut(73, stepTop(4) - 19) +
    `<path d="M78 48 q20 -40 60 -38" stroke-dasharray="2 3" opacity=".6"/>` + rat(146, 12, 1) +
    label(78, 22, 'AGAIN!').replace('fill="currentColor"', 'fill="var(--donut)"'),
  ),
  'stairwell/2/death': svg(
    stairs() + carl(64, stepTop(4)) + rat(68, stepTop(4) - 20, 1.4) +
    // tiara left on the step
    `<path d="M84 ${stepTop(5)} l1 -3 l1.5 2 l1.5 -2.5 l1.5 2.5 l1.5 -2 l1 3z" style="color:var(--donut)"/>` + label(44, 22, '...'),
  ),
};

export function sketch(sceneId, beatIndex, frame) {
  return SKETCHES[`${sceneId}/${beatIndex}/${frame}`] ?? null;
}
