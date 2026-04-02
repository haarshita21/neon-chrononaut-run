import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, LEVEL_COLORS } from '../constants';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Platform } from '../entities/Platform';
import { Obstacle } from '../entities/Obstacle';
import { PowerUp } from '../entities/PowerUp';
import { ParticleSystem } from '../systems/ParticleSystem';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(levelNum: number) {
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawGrid(cameraX: number, levelNum: number, antiGravActive: boolean) {
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    const ctx = this.ctx;
    ctx.strokeStyle = colors.primary + '15';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const offsetX = -(cameraX % gridSize);
    for (let x = offsetX; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
    }

    // Ground line
    ctx.strokeStyle = colors.primary + '60';
    ctx.lineWidth = 2;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_WIDTH, GROUND_Y); ctx.stroke();

    // Ceiling line when anti-gravity active
    if (antiGravActive) {
      ctx.strokeStyle = colors.primary + '40';
      ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(CANVAS_WIDTH, 10); ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }

  drawPlayer(player: Player, cameraX: number, levelNum: number) {
    const ctx = this.ctx;
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    const sx = player.x - cameraX;
    const sy = player.y;

    // Trail
    for (const t of player.trail) {
      ctx.globalAlpha = t.alpha * 0.5;
      ctx.fillStyle = colors.primary;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 6;
      ctx.fillRect(t.x - cameraX - 3, t.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Invincibility flash
    if (Date.now() < player.invincibleUntil && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Flip rendering when gravity is flipped
    ctx.save();
    if (player.gravityFlipped) {
      ctx.translate(sx + player.width / 2, sy + player.height / 2);
      ctx.scale(1, -1);
      ctx.translate(-(sx + player.width / 2), -(sy + player.height / 2));
    }

    // Body
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 15;
    ctx.fillRect(sx + 4, sy + 8, player.width - 8, player.height - 16);

    // Head
    ctx.fillRect(sx + 8, sy, player.width - 16, 12);

    // Visor
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + (player.facing > 0 ? 16 : 8), sy + 3, 8, 4);

    // Legs - animated
    const legOffset = Math.sin(player.animFrame * Math.PI / 2) * 4;
    ctx.fillStyle = colors.primary;
    ctx.fillRect(sx + 8, sy + player.height - 10, 6, 10 + (player.onGround ? legOffset : 0));
    ctx.fillRect(sx + player.width - 14, sy + player.height - 10, 6, 10 + (player.onGround ? -legOffset : 0));

    // Shield glow
    if (player.shielded) {
      ctx.strokeStyle = '#00ff00';
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + player.width / 2, sy + player.height / 2, player.width, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawEnemy(enemy: Enemy, cameraX: number, antiGravActive: boolean) {
    if (!enemy.alive) return;
    const ctx = this.ctx;
    const sx = enemy.x - cameraX;
    const drawY = enemy.getDrawY();

    ctx.fillStyle = enemy.color;
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 10;

    // If floating, add a subtle rotation wobble
    if (antiGravActive && enemy.floatY !== 0) {
      ctx.save();
      ctx.translate(sx + enemy.width / 2, drawY + enemy.height / 2);
      ctx.rotate(Math.sin(Date.now() * 0.003 + enemy.originX) * 0.15);
      ctx.translate(-(enemy.width / 2), -(enemy.height / 2));
      ctx.fillRect(0, 0, enemy.width, enemy.height);
      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < enemy.height; i += 4) {
        ctx.fillRect(0, i, enemy.width, 1);
      }
      // Eyes
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(5 + enemy.animFrame, 8, 4, 4);
      ctx.fillRect(enemy.width - 9 + enemy.animFrame, 8, 4, 4);
      ctx.restore();
    } else {
      ctx.fillRect(sx, drawY, enemy.width, enemy.height);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < enemy.height; i += 4) {
        ctx.fillRect(sx, drawY + i, enemy.width, 1);
      }
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(sx + 5 + enemy.animFrame, drawY + 8, 4, 4);
      ctx.fillRect(sx + enemy.width - 9 + enemy.animFrame, drawY + 8, 4, 4);
    }

    ctx.shadowBlur = 0;
  }

  drawPlatform(platform: Platform, cameraX: number, levelNum: number) {
    const ctx = this.ctx;
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    const sx = platform.x - cameraX;

    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 8;
    ctx.fillRect(sx, platform.y, platform.width, platform.height);
    
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(sx, platform.y, platform.width, 2);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawObstacle(obstacle: Obstacle, cameraX: number, antiGravActive: boolean) {
    const ctx = this.ctx;
    const sx = obstacle.x - cameraX;
    const drawY = obstacle.getDrawY();

    ctx.fillStyle = obstacle.color;
    ctx.shadowColor = obstacle.color;
    ctx.shadowBlur = 8;

    if (antiGravActive && obstacle.floatY !== 0) {
      // Floating + rotating obstacle
      ctx.save();
      ctx.translate(sx + obstacle.width / 2, drawY + obstacle.height / 2);
      ctx.rotate(Math.sin(Date.now() * 0.002 + obstacle.x * 0.1) * 0.3);
      ctx.translate(-(obstacle.width / 2), -(obstacle.height / 2));
      ctx.beginPath();
      ctx.moveTo(0, obstacle.height);
      ctx.lineTo(obstacle.width / 2, 0);
      ctx.lineTo(obstacle.width, obstacle.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.moveTo(sx, drawY + obstacle.height);
      ctx.lineTo(sx + obstacle.width / 2, drawY);
      ctx.lineTo(sx + obstacle.width, drawY + obstacle.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  drawPowerUp(powerUp: PowerUp, cameraX: number) {
    if (powerUp.collected) return;
    const ctx = this.ctx;
    const sx = powerUp.x - cameraX;

    const colors: Record<string, string> = {
      shield: '#00ff88',
      speed: '#ffff00',
      antigravity: '#ff00ff',
    };
    const color = colors[powerUp.type] || '#ffffff';

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    if (powerUp.type === 'antigravity') {
      ctx.save();
      ctx.translate(sx + powerUp.width / 2, powerUp.y + powerUp.height / 2);
      ctx.rotate(powerUp.bobTimer);
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(sx + powerUp.width / 2, powerUp.y + powerUp.height / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(powerUp.type === 'shield' ? 'S' : '⚡', sx + powerUp.width / 2, powerUp.y + powerUp.height / 2 + 3);
    }
    ctx.shadowBlur = 0;
  }

  // Anti-gravity visual effect overlay
  drawAntiGravityOverlay(progress: number, levelNum: number) {
    if (progress <= 0) return;
    const ctx = this.ctx;
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    
    // Pulsing border glow
    const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    ctx.strokeStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 20 * pulse;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);

    // Floating particles effect
    ctx.fillStyle = colors.primary + '30';
    for (let i = 0; i < 8; i++) {
      const px = (Date.now() * 0.02 + i * 120) % CANVAS_WIDTH;
      const py = CANVAS_HEIGHT - ((Date.now() * 0.03 + i * 70) % CANVAS_HEIGHT);
      ctx.fillRect(px, py, 2, 2);
    }

    ctx.shadowBlur = 0;
  }

  drawParticles(particles: ParticleSystem, cameraX: number) {
    particles.draw(this.ctx, cameraX);
  }

  drawLevelEnd(endX: number, cameraX: number, levelNum: number) {
    const ctx = this.ctx;
    const colors = LEVEL_COLORS[levelNum];
    const sx = endX - cameraX;

    ctx.strokeStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 20;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, CANVAS_HEIGHT); ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }
}
