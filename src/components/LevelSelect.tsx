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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h2 className="font-orbitron text-2xl font-bold text-primary mb-8 drop-shadow-[0_0_15px_hsl(var(--primary))]">
        SELECT ERA
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full mb-8">
        {LEVEL_YEARS.map((year, i) => {
          const level = i + 1;
          const isUnlocked = level <= unlocked;
          const colors = LEVEL_COLORS[level];
          return (
            <button
              key={level}
              onClick={() => isUnlocked && onSelect(level)}
              disabled={!isUnlocked}
              className="relative border rounded-lg p-4 text-center transition-all group"
              style={{
                borderColor: isUnlocked ? colors.primary + '60' : undefined,
                boxShadow: isUnlocked ? `0 0 15px ${colors.glow}` : undefined,
              }}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="font-orbitron text-lg font-bold" style={{ color: isUnlocked ? colors.primary : undefined }}>
                {year}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">{LEVEL_NAMES[i]}</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="font-orbitron text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← BACK
      </button>
    </div>
  );
}
