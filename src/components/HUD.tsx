import { Heart, RotateCcw } from 'lucide-react';
import { MAX_HEALTH } from '@/game/constants';

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
  const gravityState = antiGravityActive ? 'active' : antiGravityAvailable ? 'available' : 'cooldown';

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none p-3 flex justify-between items-start font-orbitron z-[11]">
      {/* Health */}
      <div className="flex gap-1">
        {Array.from({ length: MAX_HEALTH }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 ${i < health ? 'text-destructive fill-destructive drop-shadow-[0_0_6px_hsl(var(--destructive))]' : 'text-muted-foreground'}`}
          />
        ))}
      </div>

      {/* Score + Year */}
      <div className="text-right">
        <div className="text-primary text-lg font-bold drop-shadow-[0_0_8px_hsl(var(--primary))]">
          {score.toLocaleString()}
        </div>
        <div className="text-xs text-primary/70 bg-background/60 px-2 py-0.5 rounded">
          {year} — {levelName}
        </div>
      </div>

      {/* Anti-gravity button — always visible */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-auto">
        <button
          onClick={onGravityToggle}
          disabled={gravityState === 'cooldown'}
          className={`gravity-btn ${gravityState} w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            antiGravityActive
              ? 'border-secondary bg-secondary/20 scale-110'
              : antiGravityAvailable
              ? 'border-secondary/60 bg-secondary/10 hover:bg-secondary/20 hover:scale-105'
              : 'border-muted-foreground/30 bg-muted/30 cursor-not-allowed'
          }`}
        >
          <RotateCcw className={`w-5 h-5 ${
            antiGravityActive
              ? 'text-secondary animate-spin'
              : antiGravityAvailable
              ? 'text-secondary'
              : 'text-muted-foreground'
          }`} style={antiGravityActive ? { animationDuration: '1s' } : undefined} />
        </button>

        {/* Label */}
        <span className={`text-[9px] font-bold tracking-wider ${
          antiGravityActive ? 'text-secondary animate-neon-pulse' : antiGravityAvailable ? 'text-secondary/70' : 'text-muted-foreground/50'
        }`}>
          {antiGravityActive ? 'ON' : 'GRAVITY'}
        </span>

        {/* Cooldown / Duration bar */}
        {(antiGravityActive || antiGravityProgress > 0) && (
          <div className="w-14 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${antiGravityActive ? 'bg-secondary' : 'bg-muted-foreground/40'}`}
              style={{ width: `${antiGravityProgress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
