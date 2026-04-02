import { Heart, RotateCcw } from 'lucide-react';
import { MAX_HEALTH } from '@/game/constants';
import { CornerFold } from './ComicDecorations';

interface HUDProps {
  health: number;
  score: number;
  year: number;
  levelName: string;
  antiGravityActive: boolean;
  antiGravityAvailable: boolean;
  antiGravityProgress: number;
  onGravityToggle?: () => void;
}

export default function HUD({ health, score, year, levelName, antiGravityActive, antiGravityAvailable, antiGravityProgress, onGravityToggle }: HUDProps) {
  const gravityState = antiGravityActive
    ? 'active'
    : antiGravityAvailable
    ? 'available'
    : antiGravityProgress > 0
    ? 'cooldown'
    : 'locked';

  const gravityLabel: Record<string, string> = {
    active: 'FLOAT ON',
    available: 'ARMED',
    cooldown: 'RECHARGING',
    locked: 'COLLECT CHIP',
  };

  const gravityDisabled = gravityState === 'cooldown' || gravityState === 'locked';

  return (
    <div className="absolute inset-0 pointer-events-none font-orbitron z-[11]">
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
        <div className="comic-panel px-3 py-2 relative comic-stripe-accent">
          <CornerFold corner="top-right" />
          <div className="mb-1 text-[9px] tracking-[0.3em] text-muted-foreground">VITALS</div>
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_HEALTH }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < health ? 'text-destructive fill-destructive drop-shadow-[0_0_6px_hsl(var(--destructive))]' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
        </div>

        <div className="comic-panel px-3 py-2 text-right relative comic-stripe-accent">
          <CornerFold corner="top-left" className="-scale-x-100" />
          <div className="text-[9px] tracking-[0.3em] text-muted-foreground">SCORE</div>
          <div className="text-primary text-lg font-black drop-shadow-[0_0_8px_hsl(var(--primary))]">
            {score.toLocaleString()}
          </div>
          <div className="text-[10px] text-foreground/75 tracking-[0.16em]">
            {year} · {levelName}
          </div>
        </div>
      </div>

      {/* Anti-gravity button — bottom center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={onGravityToggle}
          disabled={gravityDisabled}
          aria-label="Toggle anti-gravity"
          aria-pressed={antiGravityActive}
          className={`gravity-btn ${gravityState} w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            antiGravityActive
              ? 'border-secondary bg-secondary/20 scale-110'
              : antiGravityAvailable
              ? 'border-secondary/60 bg-secondary/10 hover:bg-secondary/20 hover:scale-105'
              : antiGravityProgress > 0
              ? 'border-muted-foreground/30 bg-muted/30 cursor-not-allowed'
              : 'border-border bg-card/80 cursor-not-allowed'
          }`}
        >
          <RotateCcw className={`w-5 h-5 ${
            antiGravityActive
              ? 'text-secondary animate-spin'
              : antiGravityAvailable
              ? 'text-secondary'
              : antiGravityProgress > 0
              ? 'text-muted-foreground'
              : 'text-primary/55'
          }`} style={antiGravityActive ? { animationDuration: '1s' } : undefined} />
        </button>

        <div className="comic-panel min-w-[140px] px-3 py-2 text-center">
          <span className={`block text-[10px] font-black tracking-[0.32em] ${
            antiGravityActive ? 'text-secondary animate-neon-pulse' : antiGravityAvailable ? 'text-secondary/80' : 'text-muted-foreground'
          }`}>
            {gravityLabel[gravityState]}
          </span>

          {(antiGravityActive || antiGravityProgress > 0) && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-200 ${antiGravityActive ? 'bg-secondary' : 'bg-muted-foreground/40'}`}
                style={{ width: `${Math.max(0, Math.min(1, antiGravityProgress)) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
