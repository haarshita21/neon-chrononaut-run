export interface EnemyDef {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  pattern: 'static' | 'horizontal' | 'vertical' | 'chase';
  color: string;
}

export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  pattern: string;
  color: string;
  type: string;
  originX: number;
  originY: number;
  alive = true;
  animTimer = 0;
  animFrame = 0;
  dir = 1;
  range = 100;

  constructor(def: EnemyDef) {
    this.x = def.x; this.y = def.y;
    this.width = def.width; this.height = def.height;
    this.speed = def.speed; this.pattern = def.pattern;
    this.color = def.color; this.type = def.type;
    this.originX = def.x; this.originY = def.y;
  }

  update(dt: number, cameraX: number) {
    if (!this.alive) return;
    this.animTimer += dt;
    if (this.animTimer > 150) { this.animFrame = (this.animFrame + 1) % 3; this.animTimer = 0; }

    switch (this.pattern) {
      case 'horizontal':
        this.x += this.speed * this.dir;
        if (Math.abs(this.x - this.originX) > this.range) this.dir *= -1;
        break;
      case 'vertical':
        this.y += this.speed * this.dir;
        if (Math.abs(this.y - this.originY) > this.range) this.dir *= -1;
        break;
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
