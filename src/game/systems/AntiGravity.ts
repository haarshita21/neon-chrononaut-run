import { ANTIGRAVITY_DURATION, ANTIGRAVITY_COOLDOWN } from '../constants';

export class AntiGravitySystem {
  active = false;
  activatedAt = 0;
  cooldownUntil = 0;
  available = false; // collected the button
  floatOffset = 0; // sinusoidal float for enemies/obstacles

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

  // Toggle: can also deactivate early
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
    this.available = true;
  }

  update(dt: number) {
    if (this.active) {
      // Float offset oscillates for floating entities
      this.floatOffset += dt * 0.004;
      if (Date.now() - this.activatedAt > ANTIGRAVITY_DURATION) {
        this.deactivate();
      }
    } else {
      // Dampen float offset back to 0
      this.floatOffset *= 0.95;
    }
  }

  getFloatY(baseY: number, entityIndex: number): number {
    if (!this.active) return baseY;
    // Each entity floats at different phase, drifting upward with wobble
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
    this.available = false;
    this.cooldownUntil = 0;
    this.floatOffset = 0;
  }
}
