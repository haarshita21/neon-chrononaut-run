export interface ObstacleDef {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: string;
}

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: string;
  baseY: number;
  floatY = 0;

  constructor(def: ObstacleDef) {
    this.x = def.x; this.y = def.y;
    this.width = def.width; this.height = def.height;
    this.type = def.type; this.color = def.color;
    this.baseY = def.y;
  }

  setFloatOffset(offsetY: number) {
    this.floatY = offsetY;
  }

  getDrawY(): number {
    return this.y + this.floatY;
  }

  getBounds() {
    return { x: this.x, y: this.y + this.floatY, width: this.width, height: this.height };
  }
}
