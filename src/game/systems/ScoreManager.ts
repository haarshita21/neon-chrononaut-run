const STORAGE_KEY = 'coderunner_scores';

export class ScoreManager {
  score = 0;
  combo = 0;
  highScores: number[] = [];

  constructor() {
    this.loadScores();
  }

  addPoints(pts: number) {
    this.score += pts * (1 + this.combo * 0.1);
  }

  incrementCombo() { this.combo++; }
  resetCombo() { this.combo = 0; }

  saveScore() {
    this.highScores.push(Math.floor(this.score));
    this.highScores.sort((a, b) => b - a);
    this.highScores = this.highScores.slice(0, 10);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.highScores)); } catch {}
  }

  private loadScores() {
    try {
      const d = localStorage.getItem(STORAGE_KEY);
      if (d) this.highScores = JSON.parse(d);
    } catch {}
  }

  reset() { this.score = 0; this.combo = 0; }
}

const UNLOCK_KEY = 'coderunner_unlocked';

export function getUnlockedLevels(): number {
  try {
    const d = localStorage.getItem(UNLOCK_KEY);
    return d ? JSON.parse(d) : 1;
  } catch { return 1; }
}

export function unlockLevel(level: number) {
  try {
    const current = getUnlockedLevels();
    if (level > current) localStorage.setItem(UNLOCK_KEY, JSON.stringify(level));
  } catch {}
}
