import { EnemyDef } from '../entities/Enemy';
import { PlatformDef } from '../entities/Platform';
import { ObstacleDef } from '../entities/Obstacle';
import { PowerUpDef } from '../entities/PowerUp';
import { QuizQuestion } from '../systems/QuizSystem';
import { GROUND_Y, LEVEL_COLORS } from '../constants';

export interface LevelDef {
  id: number;
  year: number;
  name: string;
  story: string;
  length: number; // total world width
  platforms: PlatformDef[];
  enemies: EnemyDef[];
  obstacles: ObstacleDef[];
  powerUps: PowerUpDef[];
  quizzes: QuizQuestion[];
  scrollSpeed: number;
}

const PH = 16; // platform height

function makePlatforms(level: number): PlatformDef[] {
  const base: PlatformDef[] = [];
  const color = LEVEL_COLORS[level];
  // Each level gets increasingly complex platforms
  const count = 8 + level * 3;
  for (let i = 0; i < count; i++) {
    const x = 500 + i * (300 + Math.random() * 200);
    const y = GROUND_Y - 80 - Math.random() * 200;
    const w = 80 + Math.random() * 120;
    const moving = level >= 3 && Math.random() > 0.6;
    base.push({
      x, y, width: w, height: PH,
      moving,
      moveRange: moving ? 40 + Math.random() * 60 : 0,
      moveSpeed: moving ? 0.5 + Math.random() * 1 : 0,
      moveDir: Math.random() > 0.5 ? 'horizontal' : 'vertical',
    });
  }
  return base;
}

const ENEMY_TYPES: Record<number, { types: string[]; color: string }> = {
  1: { types: ['vacuum_tube', 'coil'], color: '#00ffff' },
  2: { types: ['short_circuit', 'static_shock'], color: '#ff00ff' },
  3: { types: ['packet_ghost', 'disconnect_wave'], color: '#3366ff' },
  4: { types: ['silicon_bug', 'logic_trap'], color: '#00ff00' },
  5: { types: ['floppy_virus', 'blue_screen'], color: '#9933ff' },
  6: { types: ['404_monster', 'popup_ad'], color: '#ff6600' },
  7: { types: ['data_breach', 'firewall'], color: '#ff3399' },
  8: { types: ['hallucination', 'bias_grenade'], color: '#ffaa00' },
};

function makeEnemies(level: number): EnemyDef[] {
  const enemies: EnemyDef[] = [];
  const { types, color } = ENEMY_TYPES[level];
  const count = 5 + level * 2;
  for (let i = 0; i < count; i++) {
    enemies.push({
      type: types[i % types.length],
      x: 600 + i * (250 + Math.random() * 200),
      y: GROUND_Y - 40 - Math.random() * 80,
      width: 28, height: 28,
      speed: 0.5 + level * 0.2 + Math.random() * 0.5,
      pattern: Math.random() > 0.5 ? 'horizontal' : 'static',
      color,
    });
  }
  return enemies;
}

function makeObstacles(level: number): ObstacleDef[] {
  const obs: ObstacleDef[] = [];
  const count = 4 + level * 2;
  const color = LEVEL_COLORS[level].primary;
  for (let i = 0; i < count; i++) {
    obs.push({
      x: 700 + i * (350 + Math.random() * 150),
      y: GROUND_Y - 30,
      width: 20, height: 30,
      type: 'spike',
      color,
    });
  }
  return obs;
}

function makePowerUps(level: number): PowerUpDef[] {
  const pups: PowerUpDef[] = [];
  const length = 3000 + level * 1500;
  // Shield and speed at intervals
  pups.push({ x: length * 0.3, y: GROUND_Y - 140, type: 'shield' });
  pups.push({ x: length * 0.6, y: GROUND_Y - 120, type: 'speed' });
  // Anti-gravity button 1-2 times
  pups.push({ x: length * 0.45, y: GROUND_Y - 160, type: 'antigravity' });
  if (level >= 5) pups.push({ x: length * 0.8, y: GROUND_Y - 150, type: 'antigravity' });
  return pups;
}

const QUIZ_BANK: Record<number, QuizQuestion[]> = {
  1: [
    { question: 'What year was ENIAC completed?', options: ['1943', '1946', '1950', '1939'], correctIndex: 1, triggerX: 1500 },
    { question: 'ENIAC was primarily designed for?', options: ['Weather forecasting', 'Artillery tables', 'Code breaking', 'Census data'], correctIndex: 1, triggerX: 3500 },
  ],
  2: [
    { question: 'Who invented the transistor?', options: ['Bell Labs team', 'Alan Turing', 'John von Neumann', 'Grace Hopper'], correctIndex: 0, triggerX: 1500 },
    { question: 'The first integrated circuit was demonstrated in?', options: ['1955', '1958', '1962', '1965'], correctIndex: 1, triggerX: 3500 },
  ],
  3: [
    { question: 'ARPANET sent its first message in?', options: ['1965', '1967', '1969', '1972'], correctIndex: 2, triggerX: 2000 },
    { question: 'The first ARPANET message was?', options: ['"Hello"', '"Login"', '"Lo"', '"Test"'], correctIndex: 2, triggerX: 4000 },
  ],
  4: [
    { question: 'The first commercial microprocessor was?', options: ['Intel 4004', 'Intel 8080', 'Zilog Z80', 'MOS 6502'], correctIndex: 0, triggerX: 2000 },
    { question: 'Intel 4004 had how many transistors?', options: ['500', '2,300', '10,000', '50,000'], correctIndex: 1, triggerX: 4500 },
  ],
  5: [
    { question: 'The Macintosh was introduced in?', options: ['1982', '1984', '1986', '1988'], correctIndex: 1, triggerX: 2000 },
    { question: 'IEEE Computer Society was founded in?', options: ['1946', '1950', '1955', '1960'], correctIndex: 0, triggerX: 5000 },
  ],
  6: [
    { question: 'Tim Berners-Lee invented the WWW at?', options: ['MIT', 'CERN', 'Stanford', 'Bell Labs'], correctIndex: 1, triggerX: 2000 },
    { question: 'The first web browser was called?', options: ['Mosaic', 'Netscape', 'WorldWideWeb', 'Explorer'], correctIndex: 2, triggerX: 4500 },
  ],
  7: [
    { question: 'AWS launched its cloud services in?', options: ['2004', '2006', '2008', '2010'], correctIndex: 1, triggerX: 2500 },
    { question: 'The first iPhone was released in?', options: ['2005', '2006', '2007', '2008'], correctIndex: 2, triggerX: 5000 },
  ],
  8: [
    { question: 'ChatGPT was released in?', options: ['2020', '2021', '2022', '2023'], correctIndex: 2, triggerX: 2500 },
    { question: 'IEEE stands for?', options: ['International Electrical and Electronics Engineers', 'Institute of Electrical and Electronics Engineers', 'International Engineering and Electronics Experts', 'Institute of Engineering and Electronics Experts'], correctIndex: 1, triggerX: 5500 },
  ],
};

const STORIES: Record<number, string> = {
  1: "1946. The ENIAC roars to life — 30 tons of vacuum tubes, the world's first general-purpose electronic computer. Welcome to where it all began.",
  2: "1958. The transistor revolution shrinks computing power from room-sized to palm-sized. Navigate the circuit boards of innovation.",
  3: "1969. ARPANET connects its first nodes. Data packets fly across the nascent network. Don't let the connection drop!",
  4: "1971. Intel unveils the 4004 — the first microprocessor on a single chip. Dive inside the silicon and survive the logic gates.",
  5: "1984. Personal computers enter every home. Navigate the desktop, dodge the viruses, and survive the blue screens of death.",
  6: "1991. Tim Berners-Lee unleashes the World Wide Web. Surf through the browser landscape, but watch out for those popup ads!",
  7: "2010. Computing moves to the cloud. Mobile devices reshape society. Scale the cloud platforms and defend against data breaches.",
  8: "2024. Artificial intelligence transforms everything. Navigate the neural network in this ultimate challenge. The future is now.",
};

export function getLevelDef(level: number): LevelDef {
  const length = 3000 + level * 1500;
  return {
    id: level,
    year: [1946, 1958, 1969, 1971, 1984, 1991, 2010, 2024][level - 1],
    name: ['ENIAC', 'Transistor Era', 'ARPANET', 'Microprocessor', 'Personal Computing', 'World Wide Web', 'Cloud & Mobile', 'AI Era'][level - 1],
    story: STORIES[level],
    length,
    platforms: makePlatforms(level),
    enemies: makeEnemies(level),
    obstacles: makeObstacles(level),
    powerUps: makePowerUps(level),
    quizzes: QUIZ_BANK[level] || [],
    scrollSpeed: 2 + level * 0.3,
  };
}
