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

  constructor(def: ObstacleDef) {
    this.x = def.x; this.y = def.y;
    this.width = def.width; this.height = def.height;
    this.type = def.type; this.color = def.color;
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
