export class AudioManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.1) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  playJump() { this.playTone(400, 0.15, 'square'); }
  playHit() { this.playTone(150, 0.3, 'sawtooth', 0.15); }
  playPowerUp() {
    this.playTone(600, 0.1, 'sine');
    setTimeout(() => this.playTone(800, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(1000, 0.15, 'sine'), 200);
  }
  playQuizCorrect() { this.playTone(523, 0.1, 'sine'); setTimeout(() => this.playTone(659, 0.15, 'sine'), 120); }
  playQuizWrong() { this.playTone(200, 0.3, 'sawtooth', 0.12); }
  playDeath() { this.playTone(300, 0.15, 'sawtooth', 0.15); setTimeout(() => this.playTone(200, 0.15, 'sawtooth', 0.15), 150); setTimeout(() => this.playTone(100, 0.4, 'sawtooth', 0.15), 300); }
  playLevelComplete() { [523,659,784,1047].forEach((f,i) => setTimeout(() => this.playTone(f, 0.2, 'sine', 0.12), i * 150)); }

  destroy() {
    this.ctx?.close();
    this.ctx = null;
  }
}
