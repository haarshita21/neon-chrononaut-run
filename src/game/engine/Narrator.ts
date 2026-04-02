/**
 * Browser-native voiceover narrator using SpeechSynthesis API.
 * Falls back gracefully if TTS isn't available.
 */
export class Narrator {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private enabled = true;
  private queue: string[] = [];
  private speaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.pickVoice();
      // Voices may load async
      window.speechSynthesis.addEventListener('voiceschanged', () => this.pickVoice());
    }
  }

  private pickVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer an English voice with a deeper/dramatic quality
    this.voice =
      voices.find(v => v.name.includes('Daniel') && v.lang.startsWith('en')) ||
      voices.find(v => v.name.includes('Google UK English Male')) ||
      voices.find(v => v.name.includes('Alex') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('en-') && v.localService) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0] || null;
  }

  /** Speak a line. Cancels any ongoing speech first. */
  speak(text: string) {
    if (!this.synth || !this.enabled) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.volume = 0.7;
    this.synth.speak(utterance);
  }

  /** Queue a line to speak after current finishes */
  queueSpeak(text: string) {
    if (!this.synth || !this.enabled) return;
    if (this.synth.speaking) {
      this.queue.push(text);
      if (!this.speaking) this.processQueue();
    } else {
      this.speak(text);
    }
  }

  private processQueue() {
    if (!this.synth || this.queue.length === 0) {
      this.speaking = false;
      return;
    }
    this.speaking = true;
    const text = this.queue.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.volume = 0.7;
    utterance.onend = () => this.processQueue();
    this.synth.speak(utterance);
  }

  /** Stop all speech */
  stop() {
    this.queue = [];
    this.speaking = false;
    this.synth?.cancel();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }

  isEnabled() { return this.enabled; }

  destroy() {
    this.stop();
    this.synth = null;
  }
}

// Singleton for app-wide access
let narratorInstance: Narrator | null = null;

export function getNarrator(): Narrator {
  if (!narratorInstance) {
    narratorInstance = new Narrator();
  }
  return narratorInstance;
}
