import { ANTIGRAVITY_DURATION, ANTIGRAVITY_COOLDOWN } from '../constants';

export class AntiGravitySystem {
  active = false;
  activatedAt = 0;
  cooldownUntil = 0;
  available = true; // start each level with one charge
  floatOffset = 0;

  canActivate(): boolean {
    return this.available && !this.active && Date.now() > this.cooldownUntil;
  }

  activate() {
    if (!this.canActivate()) return false;
    this.active = true;
    this.activatedAt = Date.now();
    this.available = false;
    return true;
  }

  toggle(): boolean {
    if (this.active) {
      this.deactivate();
      return false;
    }
    return this.activate();
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.cooldownUntil = Date.now() + ANTIGRAVITY_COOLDOWN;
  }

  collect() {
    // Collecting a pickup recharges and clears any remaining cooldown
    this.available = true;
    this.cooldownUntil = 0;
  }

  update(dt: number) {
    if (this.active) {
      this.floatOffset += dt * 0.004;
      if (Date.now() - this.activatedAt > ANTIGRAVITY_DURATION) {
        this.deactivate();
      }
    } else {
      this.floatOffset *= 0.95;
    }
  }

  getFloatY(baseY: number, entityIndex: number): number {
    if (!this.active) return baseY;
    const phase = entityIndex * 1.7;
    const drift = Math.sin(this.floatOffset + phase) * 25;
    const lift = -30 - Math.sin(this.floatOffset * 0.5 + phase * 0.3) * 15;
    return baseY + lift + drift;
  }

  getCooldownProgress(): number {
    if (this.active) return 1 - (Date.now() - this.activatedAt) / ANTIGRAVITY_DURATION;
    if (Date.now() < this.cooldownUntil) return (Date.now() - (this.cooldownUntil - ANTIGRAVITY_COOLDOWN)) / ANTIGRAVITY_COOLDOWN;
    return 0;
  }

  isOnCooldown(): boolean {
    return !this.active && Date.now() < this.cooldownUntil;
  }

  reset() {
    this.active = false;
    this.available = true;
    this.activatedAt = 0;
    this.cooldownUntil = 0;
    this.floatOffset = 0;
  }
}
