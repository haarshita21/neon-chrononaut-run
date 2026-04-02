export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;

export const GRAVITY = 0.6;
export const PLAYER_SPEED = 5;
export const PLAYER_JUMP_FORCE = -12;
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;
export const MAX_HEALTH = 5;

export const GROUND_Y = CANVAS_HEIGHT - 60;

export const ANTIGRAVITY_DURATION = 10000; // ms
export const ANTIGRAVITY_COOLDOWN = 30000; // ms

export const QUIZ_TIME_LIMIT = 10; // seconds

export const LEVEL_COLORS: Record<number, { primary: string; glow: string; bg: string }> = {
  1: { primary: '#00ffff', glow: '#00ffff80', bg: '#0a0a1a' },
  2: { primary: '#ff00ff', glow: '#ff00ff80', bg: '#0a0a1a' },
  3: { primary: '#3366ff', glow: '#3366ff80', bg: '#0a0a1a' },
  4: { primary: '#00ff00', glow: '#00ff0080', bg: '#0a0a1a' },
  5: { primary: '#9933ff', glow: '#9933ff80', bg: '#0a0a1a' },
  6: { primary: '#ff6600', glow: '#ff660080', bg: '#0a0a1a' },
  7: { primary: '#ff3399', glow: '#ff339980', bg: '#0a0a1a' },
  8: { primary: '#ffaa00', glow: '#ffaa0080', bg: '#0a0a1a' },
};

export const LEVEL_YEARS = [1946, 1958, 1969, 1971, 1984, 1991, 2010, 2024];
export const LEVEL_NAMES = [
  'ENIAC', 'Transistor Era', 'ARPANET', 'Microprocessor',
  'Personal Computing', 'World Wide Web', 'Cloud & Mobile', 'AI Era'
];
