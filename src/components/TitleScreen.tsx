import { useState, useEffect } from 'react';

type Screen = 'title' | 'howtoplay';

interface TitleScreenProps {
  onPlay: () => void;
  onLevelSelect: () => void;
}

export default function TitleScreen({ onPlay, onLevelSelect }: TitleScreenProps) {
  const [screen, setScreen] = useState<Screen>('title');
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (screen === 'howtoplay') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="font-orbitron text-xl font-bold text-primary mb-6 text-center">HOW TO PLAY</h2>
          <div className="space-y-3 text-sm text-foreground/80 font-mono">
            <p>🎮 <span className="text-primary">Arrow Keys / WASD</span> — Move</p>
            <p>⬆️ <span className="text-primary">Space / Up</span> — Jump (double-jump from Level 3)</p>
            <p>🔄 <span className="text-primary">G</span> — Activate Anti-Gravity</p>
            <p>💚 Collect <span className="text-neon-green">shields</span> for protection</p>
            <p>⚡ Collect <span className="text-neon-gold">speed boosts</span></p>
            <p>🔮 Collect <span className="text-secondary">anti-gravity buttons</span></p>
            <p>📝 Answer quizzes correctly for bonus rewards!</p>
            <p>🏁 Reach the end of each era to advance</p>
          </div>
          <button
            onClick={() => setScreen('title')}
            className="mt-8 w-full font-orbitron text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
      </div>

      <div className="relative z-10 text-center">
        {/* IEEE branding */}
        <div className="text-xs font-orbitron text-muted-foreground mb-4 tracking-[0.3em]">
          IEEE COMPUTER SOCIETY
        </div>

        {/* Title */}
        <h1
          className={`font-orbitron text-5xl sm:text-7xl font-black text-primary mb-2 transition-transform ${
            glitch ? 'translate-x-1 skew-x-2' : ''
          }`}
          style={{
            textShadow: `0 0 20px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.4)`,
          }}
        >
          CODE RUNNER
        </h1>

        <div className="font-orbitron text-secondary text-sm mb-12 tracking-widest drop-shadow-[0_0_10px_hsl(var(--secondary))]">
          80TH ANNIVERSARY · 1946—2026
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={onPlay}
            className="font-orbitron text-sm px-12 py-3 border-2 border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-all drop-shadow-[0_0_15px_hsl(var(--primary)/0.3)] w-48"
          >
            PLAY
          </button>
          <button
            onClick={onLevelSelect}
            className="font-orbitron text-xs px-12 py-2.5 border border-primary/40 text-primary/70 rounded hover:border-primary hover:text-primary transition-all w-48"
          >
            LEVEL SELECT
          </button>
          <button
            onClick={() => setScreen('howtoplay')}
            className="font-orbitron text-xs px-12 py-2.5 text-muted-foreground hover:text-foreground transition-colors w-48"
          >
            HOW TO PLAY
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-[10px] text-muted-foreground font-mono">
          ← → WASD to move · SPACE to jump · G for anti-gravity
        </div>
      </div>
    </div>
  );
}
