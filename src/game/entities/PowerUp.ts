export type PowerUpType = 'shield' | 'speed' | 'antigravity';

export interface PowerUpDef {
  x: number;
  y: number;
  type: PowerUpType;
}

export class PowerUp {
  x: number;
  y: number;
  width = 24;
  height = 24;
  type: PowerUpType;
  collected = false;
  bobTimer = 0;
  originY: number;

  constructor(def: PowerUpDef) {
    this.x = def.x; this.y = def.y;
    this.type = def.type;
    this.originY = def.y;
  }

  update(dt: number) {
    if (this.collected) return;
    this.bobTimer += dt * 0.003;
    this.y = this.originY + Math.sin(this.bobTimer) * 6;
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
