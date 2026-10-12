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

// Outdoor kit: ground at y=78.
const GROUND = 78;
const ground = () => `<path d="M0 ${GROUND} H160"/>`;
const snow = (n = 24, opacity = 0.7) =>
  `<g fill="currentColor" stroke="none" opacity="${opacity}">` +
  Array.from({ length: n }, (_, i) => `<circle cx="${(i * 53) % 160}" cy="${(i * 29) % 74 + 2}" r=".8"/>`).join('') + '</g>';
const building = (x, y, w, h) => {
  let d = `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  for (let wy = y + 6; wy < y + h - 8; wy += 12)
    for (let wx = x + 5; wx < x + w - 6; wx += 12) d += `<rect x="${wx}" y="${wy}" width="5" height="6" opacity=".6"/>`;
  return d;
};
const rubble = (x, w) => `<path d="M${x} ${GROUND} l6 -10 l5 4 l7 -14 l6 8 l8 -6 l5 9 l7 -5 l${w - 44} ${15}" />` +
  `<path d="M${x + 10} ${GROUND - 4} l4 -3 M${x + 26} ${GROUND - 8} l5 2 M${x + 40} ${GROUND - 3} l3 -4" opacity=".6"/>`;
const dust = (x, y) => `<path d="M${x} ${y} q5 -10 14 -4 q6 -9 15 -1 q9 -3 10 6 q6 6 -2 10 h-33 q-9 -5 -4 -11z" stroke-dasharray="3 2" opacity=".6"/>`;
const severedHead = (x, y) => `<g><circle cx="${x}" cy="${y - 3}" r="3.5"/><path d="M${x - 2} ${y - 4.5} l1.2 1.2 m0 -1.2 l-1.2 1.2 M${x + 0.8} ${y - 4.5} l1.2 1.2 m0 -1.2 l-1.2 1.2"/></g>`;
const lying = (x) => carl(x, GROUND + 12, 'stand', 90);
const carlHoldingDonut = (x, y, pose = 'stand') => carl(x, y, pose) + donut(x + 3, y - 12);
const lightBeam = (x) => `<path d="M${x - 4} 0 L${x - 12} ${GROUND} M${x + 4} 0 L${x + 12} ${GROUND}" opacity=".7"/>` +
  `<path d="M${x - 12} ${GROUND} L${x + 12} ${GROUND} L${x + 8} ${GROUND + 6} L${x - 8} ${GROUND + 6}z" fill="currentColor" opacity=".3"/>` +
  `<path d="M${x - 6} ${GROUND + 2} h12 M${x - 4} ${GROUND + 4} h8" opacity=".8"/>`;
const windowFrame = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/><path d="M${x} ${y + h + 3} h${w}" />`;
POSES.kneel = {
  arms: (x, y) => `M${x - 7} ${y - 13} L${x} ${y - 20} L${x + 6} ${y - 13}`,
  legs: (x, y) => `M${x} ${y - 10} L${x + 7} ${y - 10} L${x + 7} ${y - 2} M${x} ${y - 10} L${x - 6} ${y - 3}`,
};

// --- Scene 1: The Stairwell ----------------------------------------------

const SKETCHES = {
  // --- Prologue: before the collapse -------------------------------------
  'prologue/0/setup': svg(
    windowFrame(80, 14, 50, 44) + `<g clip-path="inset(0)">${snow(14)}</g>` +
    carl(40, 84) + `<path d="M46 72 l8 -3"/><path d="M55 66 q3 -4 0 -7 q-3 -3 1 -7" opacity=".5"/>` +
    `<g transform="rotate(-25 104 34)">${donut(104, 38)}</g>` + `<path d="M84 44 h-8 M86 50 h-10" opacity=".6"/>`,
  ),
  'prologue/0/success': svg(
    snow() + building(10, 4, 70, 74) + ground() +
    carl(98, 60, 'armsUp', -15) + label(110, 30, 'BRRR') + donut(140, GROUND) + `<path d="M120 76 h6 M118 72 h5" opacity=".6"/>`,
  ),
  'prologue/0/death': svg(
    windowFrame(80, 14, 50, 44) + snow(14) + carl(40, 84) + label(10, 22, 'Bea is going') + label(10, 32, 'to kill me.'),
  ),
  'prologue/1/setup': svg(
    snow() + ground() + `<path d="M90 ${GROUND} v-12 h8 l8 -10 h22 l8 10 h8 v12" /><circle cx="102" cy="${GROUND}" r="5"/><circle cx="134" cy="${GROUND}" r="5"/>` +
    donut(118, 56) + carl(64, GROUND, 'kick') + `<path d="M70 58 l10 -2" />`,
  ),
  'prologue/1/success': svg(
    snow() + ground() + `<path d="M100 ${GROUND} v-12 h8 l8 -10 h22 l8 10 h8 v12" opacity=".5"/>` +
    carlHoldingDonut(64, GROUND) + label(76, 36, 'got her'),
  ),
  'prologue/1/death': svg(
    snow() + ground() + `<path d="M90 ${GROUND} v-12 h8 l8 -10 h22 l8 10 h8 v12" /><circle cx="102" cy="${GROUND}" r="5"/><circle cx="134" cy="${GROUND}" r="5"/>` +
    donut(118, 56) + lying(60) + `<path d="M40 ${GROUND - 2} q6 -6 12 0" opacity=".5"/>` + label(100, 30, 'nope'),
  ),
  'prologue/2/setup': svg(
    snow() + building(60, 6, 80, 72) + `<path d="M90 6 l4 16 l-6 14 l7 18 M120 6 l-3 20 l5 12" stroke-width="2"/>` + ground() +
    carlHoldingDonut(30, GROUND) + label(4, 14, 'RUMBLE'),
  ),
  'prologue/2/success': svg(
    snow() + rubble(56, 100) + dust(70, 40) + dust(110, 30) + ground() + lying(26) + donut(42, GROUND),
  ),
  'prologue/2/death': svg(
    snow() + rubble(10, 140) + dust(40, 40) + dust(90, 34) +
    `<path d="M74 ${GROUND - 12} v-10 l-2 -3 M74 ${GROUND - 22} l0 -4 M74 ${GROUND - 22} l2 -3"/>`,
  ),
  'prologue/3/setup': svg(
    snow() + rubble(90, 70) + dust(96, 46) + ground() + carlHoldingDonut(40, GROUND) +
    severedHead(80, GROUND) + `<path d="M100 ${GROUND - 3} q-6 -10 -14 -2" stroke-dasharray="2 3" opacity=".6"/>` + label(4, 14, 'thump thump thump'),
  ),
  'prologue/3/success': svg(
    snow() + rubble(90, 70) + ground() + carl(40, GROUND - 12, 'armsUp') + donut(43, GROUND - 24) + severedHead(46, GROUND) +
    `<path d="M30 ${GROUND - 4} h-8 M30 ${GROUND - 8} h-6" opacity=".6"/>`,
  ),
  'prologue/3/death': svg(
    snow() + rubble(90, 70) + ground() + lying(40) + severedHead(62, GROUND) + label(52, 50, 'bonk'),
  ),
  'prologue/4/setup': svg(
    snow(48, 0.9) + ground() + `<g transform="translate(0 6)">${carl(70, GROUND, 'kneel')}</g>` + donut(73, GROUND - 6) +
    `<rect x="96" y="10" width="58" height="16" opacity=".8"/>` + label(100, 21, 'FROSTBITE'),
  ),
  'prologue/4/success': svg(
    snow(48, 0.9) + ground() + carlHoldingDonut(70, GROUND) + label(84, 40, 'ugh. walk.'),
  ),
  'prologue/4/death': svg(
    snow(48, 0.9) + ground() + `<g transform="translate(0 6)">${carl(70, GROUND, 'kneel')}</g>` +
    `<rect x="56" y="44" width="30" height="${GROUND - 44}" stroke-dasharray="1 2"/><path d="M58 44 v5 M64 44 v4 M72 44 v6 M80 44 v4" />`,
  ),
  'prologue/5/setup': svg(
    `<rect x="0" y="0" width="160" height="90" fill="currentColor" opacity=".12" stroke="none"/>` + snow() + ground() +
    lightBeam(120) + carlHoldingDonut(40, GROUND) + label(64, 20, '!'),
  ),
  'prologue/5/success': svg(
    `<rect x="0" y="0" width="160" height="90" fill="currentColor" opacity=".12" stroke="none"/>` + snow() + ground() +
    lightBeam(120) + `<g transform="rotate(12 90 ${GROUND})">${carl(90, GROUND, 'run')}</g>` + donut(96, GROUND - 12) + speedLines(70, GROUND - 22),
  ),
  'prologue/5/death': svg(
    `<rect x="0" y="0" width="160" height="90" fill="currentColor" opacity=".3" stroke="none"/>` + snow(48) + ground() +
    lightBeam(150) + `<g transform="scale(.6) translate(20 52)">${carl(20, GROUND)}</g>` + label(50, 30, 'wrong way'),
  ),

  // --- Scene 1: The Stairwell ---
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
