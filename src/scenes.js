// Scene data. Each scene is a run of beats; each beat waits `lead` ms, flashes
// the cue, then gives the player `window` ms to press `input`.
// Wrong input or timeout plays `death` (or `timeout` if set) and restarts the scene.
//
// Optional per-beat: lead, window, success, timeout.
// Later: an `art`/`video` field per beat for real animation.

export const SCENES = [
  {
    id: 'prologue',
    title: 'Prologue: The Night Before',
    intro: 'A freezing winter night. Carl is cat-sitting Princess Donut, his ex-girlfriend Bea\'s prize-winning Persian. He is up late, smoking at an open window, wearing almost nothing.',
    beats: [
      {
        text: 'Donut bolts past him and leaps out the window into the snow!',
        input: 'left',
        lead: 1400,
        success: 'Carl climbs out after her. No pants. Bad idea. Only idea.',
        death: 'Carl hesitates. A champion Persian vanishes into the night. Bea is going to kill him.',
      },
      {
        text: 'Donut scrambles onto a parked car, just out of reach. Grab her!',
        input: 'action',
        success: 'Got her. She is furious about it.',
        death: 'Carl lunges, slips on the ice, and lies there looking at the sky. Donut looks down at him with contempt.',
      },
      {
        text: 'The ground heaves. Behind Carl, the whole apartment building folds in on itself!',
        input: 'down',
        window: 1200,
        success: 'Carl hits the snow. The building is gone. So is every building he can see.',
        death: 'Carl stands there gawking. The debris does not care.',
      },
      {
        text: 'Something bounces out of the dust cloud and rolls straight at him. It is a head. Just a head.',
        input: 'up',
        window: 1100,
        success: 'Carl hops over it. He will think about that later. Much later.',
        death: 'Carl trips over the head and cracks his own on the curb. Ironic.',
      },
      {
        text: 'The cold is winning. Carl sinks to his knees. Get up!',
        input: 'up',
        lead: 1600,
        success: 'Carl drags himself upright, Donut stuffed in his jacket, complaining.',
        death: 'Carl sits down in the snow, just for a minute. He becomes a lawn ornament.',
      },
      {
        text: 'A column of light stabs down out of the sky across the street: a stairwell, breathing warm air!',
        input: 'right',
        success: 'Carl staggers toward the light.',
        death: 'Wrong way. Nothing out there but snow, and dark, and then not even that.',
      },
    ],
    clear: 'Carl stumbles down out of the cold. A cheerful voice in his head welcomes him to the dungeon. Earth, it explains, has been acquired.',
  },
  {
    id: 'stairwell',
    title: 'Floor 1: The Stairwell',
    intro: 'The world ended ten minutes ago. Now it is a game show. Carl, in boxers and a jacket, keeps heading down the stairs. Princess Donut rides his shoulder, judging everything.',
    beats: [
      {
        text: 'The step under Carl crumbles away into darkness!',
        input: 'right',
        success: 'Carl lunges right and catches the railing.',
        death: 'Carl falls a very long way. Donut lands on her feet. Carl does not.',
      },
      {
        text: 'A wave of rats boils up out of the hole, squeaking for blood!',
        input: 'up',
        success: 'Carl bolts up the stairs, two at a time.',
        death: 'The rats are disappointingly efficient.',
      },
      {
        text: 'One rat, fat as a housecat, leaps at Donut!',
        input: 'action',
        window: 1200,
        success: 'Carl punts it like a field goal. Donut demands he do it again.',
        death: 'Donut is very upset. Briefly.',
      },
    ],
    clear: 'NEW ACHIEVEMENT! Stair Master. Reward: you get to keep walking.',
  },
  {
    id: 'goblins',
    title: 'Floor 1: Goblin Hallway',
    intro: 'A corridor of flickering torches. Something smells like wet socks and bad decisions.',
    beats: [
      {
        text: 'A goblin swings a nail-studded club at Carl\'s head!',
        input: 'down',
        success: 'Carl ducks. The club whistles overhead.',
        death: 'Carl takes the club directly to the face. The audience loves it.',
      },
      {
        text: 'Donut fires a Magic Missile. The goblin staggers, stunned!',
        input: 'action',
        success: 'Carl stomps. Goblin flattened. Donut takes full credit.',
        death: 'The goblin recovers and bites Carl\'s ankle until he stops moving.',
      },
      {
        text: 'Click. Spikes slam out of the right-hand wall!',
        input: 'left',
        window: 1100,
        success: 'Carl dives left. The spikes catch nothing but jacket.',
        death: 'Carl becomes a decorative wall piece.',
      },
    ],
    clear: 'NEW ACHIEVEMENT! Goblin Stomper. Reward: a Bronze Box containing one (1) sock.',
  },
  {
    id: 'lair',
    title: 'Floor 1 Boss: The Dragon\'s Lair',
    intro: 'Mountains of stolen junk. Bones. A heap of gold that is, unfortunately, breathing.',
    beats: [
      {
        text: 'The dragon rears back and inhales. Its throat glows orange!',
        input: 'right',
        lead: 1400,
        success: 'Carl dives behind a pillar. Fire roars past.',
        death: 'Crispy. The audience gives it a nine out of ten.',
      },
      {
        text: 'Its tail sweeps across the floor, scattering coins like shrapnel!',
        input: 'up',
        window: 1100,
        success: 'Carl jumps the tail. Donut screams the whole time.',
        death: 'The tail sends Carl through a wall. And the next one.',
      },
      {
        text: 'The dragon roars, jaws wide open. Carl has one hob-lobber left!',
        input: 'action',
        window: 1000,
        success: 'The bomb sails down its throat. BOOM.',
        death: 'Carl fumbles the bomb. It goes off anyway.',
      },
      {
        text: 'The ceiling is coming down! The exit is to the left!',
        input: 'left',
        success: 'Carl and Donut tumble out as the lair collapses behind them.',
        death: 'So close. The rubble doesn\'t care.',
      },
    ],
    clear: 'BOSS DEFEATED! Your viewer count has doubled. Please don\'t let it go to your head.',
  },
];
