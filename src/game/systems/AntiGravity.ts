import { ANTIGRAVITY_DURATION, ANTIGRAVITY_COOLDOWN } from '../constants';

export class AntiGravitySystem {
  active = false;
  activatedAt = 0;
  cooldownUntil = 0;
  available = false; // collected the button

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

  collect() {
    this.available = true;
  }

  update() {
    if (this.active && Date.now() - this.activatedAt > ANTIGRAVITY_DURATION) {
      this.active = false;
      this.cooldownUntil = Date.now() + ANTIGRAVITY_COOLDOWN;
    }
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
  }
}
