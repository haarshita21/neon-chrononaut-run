import { Button } from '@/components/ui/button';

interface GameOverProps {
  state: 'gameover' | 'levelcomplete' | 'victory';
  score: number;
  level: number;
  onRetry: () => void;
  onNextLevel: () => void;
  onMenu: () => void;
}

export default function GameOver({ state, score, level, onRetry, onNextLevel, onMenu }: GameOverProps) {
  const titles = {
    gameover: 'GAME OVER',
    levelcomplete: 'LEVEL COMPLETE',
    victory: 'VICTORY!',
  };
  const colors = {
    gameover: 'text-destructive drop-shadow-[0_0_20px_hsl(var(--destructive))]',
    levelcomplete: 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]',
    victory: 'text-neon-gold drop-shadow-[0_0_30px_hsl(var(--neon-gold))]',
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm z-20">
      <div className="text-center">
        <h2 className={`font-orbitron text-3xl font-black mb-4 ${colors[state]}`}>
          {titles[state]}
        </h2>

        {state === 'victory' && (
          <p className="text-foreground/70 text-sm font-mono mb-2">
            🎉 IEEE CompSoc 80th Anniversary — All eras conquered!
          </p>
        )}

        <div className="font-orbitron text-lg text-foreground mb-6">
          Score: <span className="text-primary">{score.toLocaleString()}</span>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="outline" onClick={onRetry} className="font-orbitron text-xs border-primary text-primary hover:bg-primary/10">
            RETRY
          </Button>
          {state === 'levelcomplete' && (
            <Button onClick={onNextLevel} className="font-orbitron text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              NEXT LEVEL
            </Button>
          )}
          <Button variant="outline" onClick={onMenu} className="font-orbitron text-xs border-muted-foreground text-muted-foreground hover:bg-muted">
            MENU
          </Button>
        </div>
      </div>
    </div>
  );
}
