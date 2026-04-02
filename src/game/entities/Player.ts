import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, PLAYER_JUMP_FORCE, GRAVITY, GROUND_Y, MAX_HEALTH } from '../constants';

export class Player {
  x: number;
  y: number;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  vx = 0;
  vy = 0;
  health = MAX_HEALTH;
  score = 0;
  onGround = false;
  jumpsLeft = 2;
  maxJumps = 1; // upgraded to 2 from level 3+
  shielded = false;
  speedBoosted = false;
  speedBoostEnd = 0;
  invincibleUntil = 0;
  gravityFlipped = false;
  facing = 1; // 1 right, -1 left
  animFrame = 0;
  animTimer = 0;
  trail: { x: number; y: number; alpha: number }[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(dt: number, isLeft: boolean, isRight: boolean, levelNum: number) {
    const speed = this.speedBoosted && Date.now() < this.speedBoostEnd ? PLAYER_SPEED * 1.5 : PLAYER_SPEED;
    if (this.speedBoosted && Date.now() >= this.speedBoostEnd) this.speedBoosted = false;
    
    this.maxJumps = levelNum >= 3 ? 2 : 1;

    this.vx = 0;
    if (isLeft) { this.vx = -speed; this.facing = -1; }
    if (isRight) { this.vx = speed; this.facing = 1; }

    const gDir = this.gravityFlipped ? -1 : 1;
    this.vy += GRAVITY * gDir;
    this.vy = Math.max(-15, Math.min(15, this.vy));

    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (!this.gravityFlipped && this.y + this.height > GROUND_Y) {
      this.y = GROUND_Y - this.height;
      this.vy = 0;
      this.onGround = true;
      this.jumpsLeft = this.maxJumps;
    } else if (this.gravityFlipped && this.y < 10) {
      this.y = 10;
      this.vy = 0;
      this.onGround = true;
      this.jumpsLeft = this.maxJumps;
    }

    // Animation
    this.animTimer += dt;
    if (this.animTimer > 100) {
      this.animFrame = (this.animFrame + 1) % 4;
      this.animTimer = 0;
    }

    // Trail
    this.trail.unshift({ x: this.x + this.width / 2, y: this.y + this.height / 2, alpha: 0.6 });
    if (this.trail.length > 8) this.trail.pop();
    this.trail.forEach(t => t.alpha -= 0.07);
    this.trail = this.trail.filter(t => t.alpha > 0);
  }

  jump() {
    if (this.jumpsLeft > 0) {
      this.vy = this.gravityFlipped ? -PLAYER_JUMP_FORCE : PLAYER_JUMP_FORCE;
      this.jumpsLeft--;
      this.onGround = false;
      return true;
    }
    return false;
  }

  takeDamage(): boolean {
    if (Date.now() < this.invincibleUntil) return false;
    if (this.shielded) { this.shielded = false; return false; }
    this.health--;
    this.invincibleUntil = Date.now() + 1500;
    return true;
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  reset(x: number, y: number) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.health = MAX_HEALTH;
    this.onGround = false;
    this.shielded = false;
    this.speedBoosted = false;
    this.gravityFlipped = false;
    this.invincibleUntil = 0;
    this.trail = [];
  }
}
