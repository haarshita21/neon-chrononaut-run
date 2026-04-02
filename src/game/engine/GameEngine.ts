import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y } from '../constants';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Platform } from '../entities/Platform';
import { Obstacle } from '../entities/Obstacle';
import { PowerUp } from '../entities/PowerUp';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Renderer } from './Renderer';
import { ParticleSystem } from '../systems/ParticleSystem';
import { QuizSystem, QuizQuestion } from '../systems/QuizSystem';
import { AntiGravitySystem } from '../systems/AntiGravity';
import { ScoreManager, unlockLevel } from '../systems/ScoreManager';
import { getLevelDef, LevelDef } from '../levels/LevelData';

export type GameState = 'story' | 'playing' | 'quiz' | 'paused' | 'gameover' | 'victory' | 'levelcomplete';

export interface GameCallbacks {
  onStateChange: (state: GameState) => void;
  onHealthChange: (health: number) => void;
  onScoreChange: (score: number) => void;
  onLevelChange: (level: number, year: number, name: string) => void;
  onQuiz: (question: QuizQuestion) => void;
  onStory: (story: string, year: number, name: string) => void;
  onAntiGravityChange: (active: boolean, available: boolean, cooldownProgress: number) => void;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputManager;
  audio: AudioManager;
  renderer: Renderer;
  particles: ParticleSystem;
  quiz: QuizSystem;
  antiGravity: AntiGravitySystem;
  scoreManager: ScoreManager;

  player: Player;
  enemies: Enemy[] = [];
  platforms: Platform[] = [];
  obstacles: Obstacle[] = [];
  powerUps: PowerUp[] = [];

  currentLevel = 1;
  levelDef: LevelDef | null = null;
  cameraX = 0;
  state: GameState = 'story';
  callbacks: GameCallbacks;

  private animFrameId = 0;
  private lastTime = 0;
  private jumpPressed = false;
  private antiGravityPressed = false;
  private distanceScore = 0;
  private wasOnGround = false;
  private lastMilestone = 0;
  private prevAntiGravActive = false;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    this.input = new InputManager();
    this.audio = new AudioManager();
    this.renderer = new Renderer(this.ctx);
    this.particles = new ParticleSystem();
    this.quiz = new QuizSystem();
    this.antiGravity = new AntiGravitySystem();
    this.scoreManager = new ScoreManager();
    this.player = new Player(100, GROUND_Y - 48);
  }

  startLevel(level: number) {
    this.currentLevel = level;
    this.levelDef = getLevelDef(level);
    this.player.reset(100, GROUND_Y - 48);
    this.cameraX = 0;
    this.distanceScore = 0;
    this.lastMilestone = 0;
    this.quiz.reset();
    this.antiGravity.reset();
    this.scoreManager.reset();
    this.prevAntiGravActive = false;

    this.enemies = this.levelDef.enemies.map(e => new Enemy(e));
    this.platforms = this.levelDef.platforms.map(p => new Platform(p));
    this.obstacles = this.levelDef.obstacles.map(o => new Obstacle(o));
    this.powerUps = this.levelDef.powerUps.map(p => new PowerUp(p));

    this.state = 'story';
    this.callbacks.onStory(this.levelDef.story, this.levelDef.year, this.levelDef.name);
    this.callbacks.onStateChange('story');
    this.callbacks.onHealthChange(this.player.health);
    this.callbacks.onScoreChange(0);
    this.callbacks.onLevelChange(level, this.levelDef.year, this.levelDef.name);
  }

  startPlaying() {
    this.state = 'playing';
    this.callbacks.onStateChange('playing');
    this.audio.playLevelStart();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private loop = (time: number) => {
    if (this.state !== 'playing') {
      this.animFrameId = requestAnimationFrame(this.loop);
      return;
    }

    const dt = Math.min(time - this.lastTime, 33);
    this.lastTime = time;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (!this.levelDef) return;

    // Input
    const isLeft = this.input.isLeft();
    const isRight = this.input.isRight();
    const isJump = this.input.isJump();
    const isAG = this.input.isAntiGravity();

    // Jump (edge trigger)
    if (isJump && !this.jumpPressed) {
      if (this.player.jump()) {
        this.audio.playJump();
        this.particles.emit(this.player.x + 16, this.player.y + 48, '#ffffff', 5);
      }
    }
    this.jumpPressed = isJump;

    // Anti-gravity toggle (edge trigger)
    if (isAG && !this.antiGravityPressed) {
      this.toggleAntiGravity();
    }
    this.antiGravityPressed = isAG;

    // Update anti-gravity system
    this.antiGravity.update(dt);

    // Sync player gravity state
    this.player.gravityFlipped = this.antiGravity.active;

    // Detect anti-gravity deactivation for SFX
    if (this.prevAntiGravActive && !this.antiGravity.active) {
      this.audio.playAntiGravityDeactivate();
      // Reset float offsets
      for (const e of this.enemies) e.setFloatOffset(0);
      for (const o of this.obstacles) o.setFloatOffset(0);
    }
    this.prevAntiGravActive = this.antiGravity.active;

    this.callbacks.onAntiGravityChange(
      this.antiGravity.active,
      this.antiGravity.available || this.antiGravity.active,
      this.antiGravity.getCooldownProgress()
    );

    // Player movement (game continues during anti-gravity!)
    this.wasOnGround = this.player.onGround;
    this.player.update(dt, isLeft, isRight, this.currentLevel);

    // Landing SFX
    if (!this.wasOnGround && this.player.onGround) {
      this.audio.playLand();
      this.particles.emit(this.player.x + 16, this.player.y + this.player.height, '#ffffff', 3, 2, 300);
    }

    // Camera follows player
    const targetCameraX = this.player.x - 200;
    this.cameraX = Math.max(0, targetCameraX);

    // Keep player in bounds
    if (this.player.x < this.cameraX) this.player.x = this.cameraX;

    // Distance score + milestones
    const newDist = Math.floor(this.player.x / 10);
    if (newDist > this.distanceScore) {
      this.scoreManager.addPoints(newDist - this.distanceScore);
      this.distanceScore = newDist;
      this.callbacks.onScoreChange(Math.floor(this.scoreManager.score));

      // Milestone SFX every 500 distance points
      const milestone = Math.floor(this.scoreManager.score / 500);
      if (milestone > this.lastMilestone) {
        this.lastMilestone = milestone;
        this.audio.playMilestone();
      }
    }

    // Update entities
    for (const p of this.platforms) p.update();
    for (const e of this.enemies) e.update(dt, this.cameraX);
    for (const pu of this.powerUps) pu.update(dt);
    this.particles.update(dt);

    // Apply anti-gravity float offsets to enemies and obstacles
    if (this.antiGravity.active) {
      for (let i = 0; i < this.enemies.length; i++) {
        const floatY = this.antiGravity.getFloatY(0, i) ;
        this.enemies[i].setFloatOffset(floatY);
      }
      for (let i = 0; i < this.obstacles.length; i++) {
        const floatY = this.antiGravity.getFloatY(0, i + this.enemies.length);
        this.obstacles[i].setFloatOffset(floatY);
      }
    }

    // Platform collision
    this.player.onGround = false;
    const pb = this.player.getBounds();
    
    // Ground
    if (!this.player.gravityFlipped && pb.y + pb.height >= GROUND_Y) {
      this.player.y = GROUND_Y - this.player.height;
      this.player.vy = 0;
      this.player.onGround = true;
      this.player.jumpsLeft = this.player.maxJumps;
    } else if (this.player.gravityFlipped && pb.y <= 10) {
      this.player.y = 10;
      this.player.vy = 0;
      this.player.onGround = true;
      this.player.jumpsLeft = this.player.maxJumps;
    }

    // Platform collision
    for (const plat of this.platforms) {
      const platB = plat.getBounds();
      if (this.rectIntersect(pb, platB)) {
        if (!this.player.gravityFlipped && this.player.vy > 0 && pb.y + pb.height - this.player.vy <= platB.y + 5) {
          this.player.y = platB.y - this.player.height;
          this.player.vy = 0;
          this.player.onGround = true;
          this.player.jumpsLeft = this.player.maxJumps;
        } else if (this.player.gravityFlipped && this.player.vy < 0 && pb.y - this.player.vy >= platB.y + platB.height - 5) {
          this.player.y = platB.y + platB.height;
          this.player.vy = 0;
          this.player.onGround = true;
          this.player.jumpsLeft = this.player.maxJumps;
        }
      }
    }

    // Enemy collision (uses float-adjusted bounds)
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (this.rectIntersect(pb, e.getBounds())) {
        if (this.player.takeDamage()) {
          this.audio.playHit();
          this.particles.emit(this.player.x + 16, this.player.y + 24, '#ff0000', 10);
          this.callbacks.onHealthChange(this.player.health);
          this.scoreManager.resetCombo();
          if (this.player.health <= 0) {
            this.gameOver();
            return;
          }
        }
      }
    }

    // Obstacle collision (uses float-adjusted bounds)
    for (const o of this.obstacles) {
      if (this.rectIntersect(pb, o.getBounds())) {
        if (this.player.takeDamage()) {
          this.audio.playHit();
          this.particles.emit(o.x, o.getDrawY(), o.color, 8);
          this.callbacks.onHealthChange(this.player.health);
          if (this.player.health <= 0) {
            this.gameOver();
            return;
          }
        }
      }
    }

    // PowerUp collision
    for (const pu of this.powerUps) {
      if (pu.collected) continue;
      if (this.rectIntersect(pb, pu.getBounds())) {
        pu.collected = true;
        this.particles.emit(pu.x + 12, pu.y + 12, '#ffff00', 12);
        switch (pu.type) {
          case 'shield':
            this.player.shielded = true;
            this.audio.playShieldUp();
            break;
          case 'speed':
            this.player.speedBoosted = true;
            this.player.speedBoostEnd = Date.now() + 5000;
            this.audio.playSpeedBoost();
            break;
          case 'antigravity':
            this.antiGravity.collect();
            this.audio.playPowerUp();
            break;
        }
      }
    }

    // Quiz triggers
    const q = this.quiz.checkTrigger(this.levelDef.quizzes, this.player.x);
    if (q) {
      this.state = 'quiz';
      this.callbacks.onQuiz(q);
      this.callbacks.onStateChange('quiz');
    }

    // Level end
    if (this.player.x >= this.levelDef.length) {
      this.levelComplete();
    }

    // Fall death
    if (this.player.y > CANVAS_HEIGHT + 100) {
      this.player.health = 0;
      this.callbacks.onHealthChange(0);
      this.gameOver();
    }
  }

  // Public method for UI button toggle
  toggleAntiGravity() {
    if (this.antiGravity.active) {
      // Deactivate early
      this.antiGravity.deactivate();
    } else if (this.antiGravity.canActivate()) {
      this.antiGravity.activate();
      this.audio.playAntiGravityActivate();
      this.particles.emit(this.player.x + 16, this.player.y + 24, '#ff00ff', 15, 5);
    }
  }

  answerQuiz(index: number) {
    const correct = this.quiz.answer(index);
    if (correct) {
      this.audio.playQuizCorrect();
      this.scoreManager.addPoints(500);
      this.player.shielded = true;
      this.callbacks.onScoreChange(Math.floor(this.scoreManager.score));
    } else {
      this.audio.playQuizWrong();
      this.player.takeDamage();
      this.callbacks.onHealthChange(this.player.health);
      if (this.player.health <= 0) {
        this.quiz.dismiss();
        this.gameOver();
        return;
      }
    }
    setTimeout(() => {
      this.quiz.dismiss();
      this.state = 'playing';
      this.callbacks.onStateChange('playing');
    }, 500);
  }

  quizTimeout() {
    this.audio.playQuizWrong();
    this.player.takeDamage();
    this.callbacks.onHealthChange(this.player.health);
    this.quiz.dismiss();
    if (this.player.health <= 0) {
      this.gameOver();
    } else {
      this.state = 'playing';
      this.callbacks.onStateChange('playing');
    }
  }

  private levelComplete() {
    this.state = 'levelcomplete';
    this.audio.playLevelComplete();
    this.scoreManager.saveScore();
    unlockLevel(this.currentLevel + 1);
    this.callbacks.onStateChange('levelcomplete');
  }

  private gameOver() {
    this.state = 'gameover';
    this.audio.playDeath();
    this.scoreManager.saveScore();
    this.callbacks.onStateChange('gameover');
  }

  nextLevel() {
    if (this.currentLevel >= 8) {
      this.state = 'victory';
      this.callbacks.onStateChange('victory');
    } else {
      this.startLevel(this.currentLevel + 1);
    }
  }

  retry() {
    this.startLevel(this.currentLevel);
  }

  private render() {
    if (!this.levelDef) return;
    const agActive = this.antiGravity.active;

    this.renderer.clear(this.currentLevel);
    this.renderer.drawGrid(this.cameraX, this.currentLevel, agActive);

    // Level end marker
    this.renderer.drawLevelEnd(this.levelDef.length, this.cameraX, this.currentLevel);

    // Platforms
    for (const p of this.platforms) {
      const sx = p.x - this.cameraX;
      if (sx > -p.width && sx < CANVAS_WIDTH + p.width) {
        this.renderer.drawPlatform(p, this.cameraX, this.currentLevel);
      }
    }

    // Obstacles
    for (const o of this.obstacles) {
      const sx = o.x - this.cameraX;
      if (sx > -100 && sx < CANVAS_WIDTH + 100) {
        this.renderer.drawObstacle(o, this.cameraX, agActive);
      }
    }

    // Enemies
    for (const e of this.enemies) {
      const sx = e.x - this.cameraX;
      if (sx > -100 && sx < CANVAS_WIDTH + 100) {
        this.renderer.drawEnemy(e, this.cameraX, agActive);
      }
    }

    // PowerUps
    for (const pu of this.powerUps) {
      const sx = pu.x - this.cameraX;
      if (sx > -100 && sx < CANVAS_WIDTH + 100) {
        this.renderer.drawPowerUp(pu, this.cameraX);
      }
    }

    // Particles
    this.renderer.drawParticles(this.particles, this.cameraX);

    // Player
    this.renderer.drawPlayer(this.player, this.cameraX, this.currentLevel);

    // Anti-gravity overlay
    if (agActive) {
      this.renderer.drawAntiGravityOverlay(this.antiGravity.getCooldownProgress(), this.currentLevel);
    }
  }

  private rectIntersect(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  startLoop() {
    this.lastTime = performance.now();
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  destroy() {
    cancelAnimationFrame(this.animFrameId);
    this.input.destroy();
    this.audio.destroy();
  }
}
