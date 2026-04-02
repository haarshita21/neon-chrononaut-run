import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, LEVEL_COLORS } from '../constants';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Platform } from '../entities/Platform';
import { Obstacle } from '../entities/Obstacle';
import { PowerUp } from '../entities/PowerUp';
import { ParticleSystem } from '../systems/ParticleSystem';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private gridOffset = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(levelNum: number) {
    const colors = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawGrid(cameraX: number, levelNum: number) {
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

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawEnemy(enemy: Enemy, cameraX: number) {
    if (!enemy.alive) return;
    const ctx = this.ctx;
    const sx = enemy.x - cameraX;

    ctx.fillStyle = enemy.color;
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 10;

    // Glitchy rectangle body with scanline effect
    ctx.fillRect(sx, enemy.y, enemy.width, enemy.height);
    
    // Scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for (let i = 0; i < enemy.height; i += 4) {
      ctx.fillRect(sx, enemy.y + i, enemy.width, 1);
    }

    // Eyes
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(sx + 5 + enemy.animFrame, enemy.y + 8, 4, 4);
    ctx.fillRect(sx + enemy.width - 9 + enemy.animFrame, enemy.y + 8, 4, 4);

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
    
    // Top glow line
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(sx, platform.y, platform.width, 2);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawObstacle(obstacle: Obstacle, cameraX: number) {
    const ctx = this.ctx;
    const sx = obstacle.x - cameraX;

    ctx.fillStyle = obstacle.color;
    ctx.shadowColor = obstacle.color;
    ctx.shadowBlur = 8;

    // Spike triangle
    ctx.beginPath();
    ctx.moveTo(sx, obstacle.y + obstacle.height);
    ctx.lineTo(sx + obstacle.width / 2, obstacle.y);
    ctx.lineTo(sx + obstacle.width, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();
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
      // Rotating diamond
      ctx.save();
      ctx.translate(sx + powerUp.width / 2, powerUp.y + powerUp.height / 2);
      ctx.rotate(powerUp.bobTimer);
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(sx + powerUp.width / 2, powerUp.y + powerUp.height / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      // Icon
      ctx.fillStyle = '#000';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(powerUp.type === 'shield' ? 'S' : '⚡', sx + powerUp.width / 2, powerUp.y + powerUp.height / 2 + 3);
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

    // Finish line
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
