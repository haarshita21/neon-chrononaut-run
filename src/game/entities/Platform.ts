export interface PlatformDef {
  x: number;
  y: number;
  width: number;
  height: number;
  moving?: boolean;
  moveRange?: number;
  moveSpeed?: number;
  moveDir?: 'horizontal' | 'vertical';
}

export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  moving: boolean;
  moveRange: number;
  moveSpeed: number;
  moveDir: 'horizontal' | 'vertical';
  originX: number;
  originY: number;
  dir = 1;

  constructor(def: PlatformDef) {
    this.x = def.x; this.y = def.y;
    this.width = def.width; this.height = def.height;
    this.moving = def.moving || false;
    this.moveRange = def.moveRange || 0;
    this.moveSpeed = def.moveSpeed || 1;
    this.moveDir = def.moveDir || 'horizontal';
    this.originX = def.x; this.originY = def.y;
  }

  update() {
    if (!this.moving) return;
    if (this.moveDir === 'horizontal') {
      this.x += this.moveSpeed * this.dir;
      if (Math.abs(this.x - this.originX) > this.moveRange) this.dir *= -1;
    } else {
      this.y += this.moveSpeed * this.dir;
      if (Math.abs(this.y - this.originY) > this.moveRange) this.dir *= -1;
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
