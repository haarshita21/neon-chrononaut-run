import { CornerFold, Starburst, ZigzagDivider, SfxPop, ComicDots } from './ComicDecorations';

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
    levelcomplete: 'ERA CLEARED',
    victory: 'ALL ERAS CONQUERED',
  };
  const colors = {
    gameover: 'text-destructive drop-shadow-[0_0_20px_hsl(var(--destructive))]',
    levelcomplete: 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]',
    victory: 'text-neon-gold drop-shadow-[0_0_30px_hsl(var(--neon-gold))]',
  };
  const narrations = {
    gameover: 'The timeline collapses. Rewind and run it back.',
    levelcomplete: `Issue ${String(level).padStart(2, '0')} archived. The next decade is loading.`,
    victory: 'IEEE CompSoc 80th Anniversary — every era survived. Legend status.',
  };
  const sfx = {
    gameover: 'CRASH!',
    levelcomplete: 'CLEAR!',
    victory: 'LEGENDARY!',
  };
  const starburstColor = {
    gameover: 'destructive' as const,
    levelcomplete: 'primary' as const,
    victory: 'gold' as const,
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm z-20">
      <div className="comic-panel p-6 sm:p-8 max-w-md w-full mx-4 text-center relative comic-corner-cut">
        <CornerFold corner="top-right" />
        <CornerFold corner="bottom-left" />
        <Starburst text={sfx[state]} color={starburstColor[state]} size="md" className="absolute -top-5 -right-5" />

        <div className="comic-caption inline-flex rounded-sm mb-4">
          {state === 'gameover' ? 'WIPEOUT' : state === 'victory' ? 'FINALE' : 'CLEAR'}
        </div>

        <h2 className={`font-orbitron text-3xl font-black mb-2 ${colors[state]}`}>
          {titles[state]}
        </h2>

        <ComicDots count={4} className="justify-center mb-3" />
        <ZigzagDivider className="mb-4" />

        <div className="comic-narration px-4 py-3 mb-4 text-left relative">
          <CornerFold corner="top-right" />
          <span className="block text-[10px] tracking-[0.35em] text-primary/70 mb-1">NARRATOR</span>
          <span className="text-sm leading-relaxed text-foreground/80 font-mono italic">
            {narrations[state]}
          </span>
        </div>

        <div className="font-orbitron text-lg text-foreground mb-6">
          Score: <span className="text-primary">{score.toLocaleString()}</span>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button type="button" onClick={onRetry} className="comic-button font-orbitron text-xs px-6 py-2.5">
            RETRY
          </button>
          {state === 'levelcomplete' && (
            <button type="button" onClick={onNextLevel} className="comic-button comic-button--primary font-orbitron text-xs px-6 py-2.5">
              NEXT ERA →
            </button>
          )}
          <button type="button" onClick={onMenu} className="comic-button comic-button--ghost font-orbitron text-xs px-6 py-2.5">
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
