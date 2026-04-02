export class AudioManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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

  // Sweep: frequency slides from start to end
  playSweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Noise burst for impacts/whoosh
  playNoise(duration: number, volume = 0.05) {
    try {
      const ctx = this.getCtx();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // fade out noise
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      // Bandpass for whoosh character
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
      filter.Q.value = 2;
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
    } catch {}
  }

  // === GAME SFX ===
  playJump() {
    this.playSweep(250, 500, 0.15, 'square', 0.08);
  }

  playLand() {
    this.playTone(120, 0.08, 'sine', 0.06);
    this.playNoise(0.05, 0.03);
  }

  playHit() {
    this.playTone(150, 0.3, 'sawtooth', 0.15);
    this.playNoise(0.15, 0.08);
  }

  playPowerUp() {
    this.playTone(600, 0.1, 'sine');
    setTimeout(() => this.playTone(800, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(1000, 0.15, 'sine'), 200);
  }

  playShieldUp() {
    this.playSweep(400, 1200, 0.3, 'sine', 0.08);
  }

  playSpeedBoost() {
    this.playSweep(300, 900, 0.2, 'square', 0.06);
    setTimeout(() => this.playSweep(500, 1100, 0.15, 'sine', 0.05), 100);
  }

  playAntiGravityActivate() {
    // Deep whoosh + rising tone
    this.playNoise(0.5, 0.1);
    this.playSweep(100, 800, 0.4, 'sine', 0.12);
    setTimeout(() => this.playSweep(200, 1000, 0.3, 'sine', 0.08), 150);
  }

  playAntiGravityDeactivate() {
    this.playSweep(800, 100, 0.4, 'sine', 0.1);
    this.playNoise(0.3, 0.06);
  }

  playEnemyDodge() {
    this.playSweep(600, 800, 0.1, 'sine', 0.04);
  }

  playMilestone() {
    [700, 880, 1050].forEach((f, i) => setTimeout(() => this.playTone(f, 0.12, 'sine', 0.06), i * 80));
  }

  playQuizCorrect() {
    this.playTone(523, 0.1, 'sine');
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 200);
  }

  playQuizWrong() {
    this.playTone(300, 0.15, 'sawtooth', 0.12);
    setTimeout(() => this.playTone(200, 0.3, 'sawtooth', 0.1), 100);
  }

  playDeath() {
    this.playTone(300, 0.15, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(200, 0.15, 'sawtooth', 0.15), 150);
    setTimeout(() => this.playTone(100, 0.4, 'sawtooth', 0.15), 300);
    setTimeout(() => this.playNoise(0.3, 0.1), 400);
  }

  playLevelComplete() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, 'sine', 0.12), i * 150));
    setTimeout(() => this.playNoise(0.2, 0.04), 600);
  }

  playLevelStart() {
    this.playSweep(200, 600, 0.3, 'sine', 0.06);
    setTimeout(() => this.playTone(600, 0.15, 'square', 0.05), 300);
  }

  // === COMIC INTRO SFX ===
  playComicBlip(panelIndex: number) {
    // Each panel gets a slightly higher pitch
    const baseFreq = 400 + panelIndex * 80;
    this.playTone(baseFreq, 0.08, 'sine', 0.06);
    setTimeout(() => this.playTone(baseFreq + 100, 0.06, 'sine', 0.04), 50);
  }

  playComicWhoosh() {
    // Dramatic whoosh for the runner panel
    this.playNoise(0.6, 0.12);
    this.playSweep(200, 1200, 0.4, 'sine', 0.1);
    setTimeout(() => this.playSweep(400, 100, 0.3, 'sine', 0.06), 200);
  }

  playComicBegin() {
    // Dramatic start button sound
    this.playTone(440, 0.1, 'sine', 0.08);
    setTimeout(() => this.playTone(554, 0.1, 'sine', 0.08), 100);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.08), 200);
    setTimeout(() => this.playTone(880, 0.2, 'sine', 0.1), 300);
  }

  destroy() {
    this.ctx?.close();
    this.ctx = null;
  }
}
