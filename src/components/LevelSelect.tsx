import { LEVEL_YEARS, LEVEL_NAMES, LEVEL_COLORS } from '@/game/constants';
import { getUnlockedLevels } from '@/game/systems/ScoreManager';
import { Lock } from 'lucide-react';

interface LevelSelectProps {
  onSelect: (level: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ onSelect, onBack }: LevelSelectProps) {
  const unlocked = getUnlockedLevels();

  return (
    <div className="min-h-screen comic-stage flex items-center justify-center p-4">
      <div className="relative z-10 max-w-5xl w-full comic-panel p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="comic-caption inline-flex rounded-sm mb-2">ARCHIVE VAULT</div>
            <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-primary drop-shadow-[0_0_15px_hsl(var(--primary))]">
              SELECT ERA
            </h2>
          </div>
          <button type="button" onClick={onBack} className="comic-button comic-button--ghost font-orbitron text-xs px-4 py-2">
            ← BACK
          </button>
        </div>

        <div className="comic-narration px-4 py-3 mb-6">
          <span className="block text-[10px] tracking-[0.35em] text-primary/70">NARRATOR</span>
          <span className="text-sm leading-relaxed text-foreground/80">
            Pick an issue from the archive. Locked decades crack open as you survive the run.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {LEVEL_YEARS.map((year, i) => {
            const level = i + 1;
            const isUnlocked = level <= unlocked;
            const colors = LEVEL_COLORS[level];
            return (
              <button
                key={level}
                onClick={() => isUnlocked && onSelect(level)}
                disabled={!isUnlocked}
                className={`comic-panel relative p-4 text-left transition-all group ${isUnlocked ? 'hover:-translate-y-1' : 'opacity-70'}`}
                style={{
                  borderColor: isUnlocked ? colors.primary + '60' : undefined,
                  boxShadow: isUnlocked ? `0 0 15px ${colors.glow}` : undefined,
                }}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg z-10">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="font-orbitron text-[10px] tracking-[0.35em] text-muted-foreground mb-1">ERA {String(level).padStart(2, '0')}</div>
                <div className="font-orbitron text-lg font-bold" style={{ color: isUnlocked ? colors.primary : undefined }}>
                  {year}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{LEVEL_NAMES[i]}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
