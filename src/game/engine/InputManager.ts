export class InputManager {
  keys: Set<string> = new Set();
  private keyDownHandler: (e: KeyboardEvent) => void;
  private keyUpHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.keyDownHandler = (e: KeyboardEvent) => {
      this.keys.add(e.key.toLowerCase());
      if (['arrowup', 'arrowdown', ' ', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  isPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  isLeft(): boolean {
    return this.isPressed('arrowleft') || this.isPressed('a');
  }

  isRight(): boolean {
    return this.isPressed('arrowright') || this.isPressed('d');
  }

  isJump(): boolean {
    return this.isPressed(' ') || this.isPressed('arrowup') || this.isPressed('w');
  }

  isAntiGravity(): boolean {
    return this.isPressed('g');
  }

  // For mobile controls
  pressKey(key: string) {
    this.keys.add(key.toLowerCase());
  }

  releaseKey(key: string) {
    this.keys.delete(key.toLowerCase());
  }

  destroy() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }
}
