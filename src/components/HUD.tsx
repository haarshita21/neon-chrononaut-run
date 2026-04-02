import { Heart } from 'lucide-react';
import { MAX_HEALTH } from '@/game/constants';

interface HUDProps {
  health: number;
  score: number;
  year: number;
  levelName: string;
  antiGravityActive: boolean;
  antiGravityAvailable: boolean;
  antiGravityProgress: number;
}

export default function HUD({ health, score, year, levelName, antiGravityActive, antiGravityAvailable, antiGravityProgress }: HUDProps) {
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none p-3 flex justify-between items-start font-orbitron">
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

      {/* Anti-gravity */}
      {(antiGravityAvailable || antiGravityActive) && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-[10px] text-secondary drop-shadow-[0_0_4px_hsl(var(--secondary))]">
            {antiGravityActive ? 'ANTI-GRAV' : 'G'}
          </span>
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all"
              style={{ width: `${antiGravityProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
