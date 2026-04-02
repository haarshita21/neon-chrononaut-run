import { useState, useEffect } from 'react';
import { LEVEL_COLORS } from '@/game/constants';

interface ComicPanel {
  text: string;
  caption?: string;
  emphasis?: string;
  delay: number;
}

const INTRO_PANELS: ComicPanel[] = [
  { caption: '1946 — WHERE IT ALL BEGAN', text: 'In a world of vacuum tubes and punch cards...', delay: 0 },
  { text: 'The IEEE Computer Society was born!', emphasis: 'EST. 1946', delay: 600 },
  { caption: '80 YEARS LATER...', text: 'Eight decades of innovation. Eight eras of computing history.', delay: 1200 },
  { text: 'One runner. One mission.', emphasis: 'CODE RUNNER', delay: 1800 },
];

interface ComicIntroProps {
  onComplete: () => void;
}

export default function ComicIntro({ onComplete }: ComicIntroProps) {
  const [visiblePanels, setVisiblePanels] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    INTRO_PANELS.forEach((panel, i) => {
      timers.push(setTimeout(() => setVisiblePanels(i + 1), panel.delay));
    });
    timers.push(setTimeout(() => setShowSkip(true), 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  const allVisible = visiblePanels >= INTRO_PANELS.length;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Halftone dot pattern background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '8px 8px',
      }} />

      <div className="relative z-10 grid grid-cols-2 gap-3 max-w-xl w-full">
        {INTRO_PANELS.map((panel, i) => (
          <div
            key={i}
            className={`comic-panel rounded p-4 relative ${i < visiblePanels ? 'animate-comic-panel' : 'opacity-0'}`}
            style={{
              animationDelay: `${i * 0.1}s`,
              minHeight: '120px',
            }}
          >
            {/* Caption banner */}
            {panel.caption && (
              <div className="comic-caption absolute -top-1 left-2 rounded-b text-[10px]">
                {panel.caption}
              </div>
            )}

            <div className={`flex flex-col justify-center h-full ${panel.caption ? 'pt-4' : ''}`}>
              <p className="text-foreground/80 text-xs font-mono leading-relaxed">
                {panel.text}
              </p>

              {/* Emphasis burst */}
              {panel.emphasis && i < visiblePanels && (
                <div className="mt-2 animate-comic-text" style={{ animationDelay: `${0.3}s` }}>
                  <span
                    className="font-orbitron text-lg font-black inline-block"
                    style={{
                      color: LEVEL_COLORS[i + 1]?.primary || 'hsl(var(--primary))',
                      textShadow: `0 0 10px ${LEVEL_COLORS[i + 1]?.glow || 'hsl(var(--primary))'}`,
                    }}
                  >
                    {panel.emphasis}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action burst */}
      {allVisible && (
        <div className="mt-8 animate-comic-burst">
          <button
            onClick={onComplete}
            className="font-orbitron text-sm px-10 py-3 bg-primary text-primary-foreground rounded-sm font-bold hover:scale-105 transition-transform"
            style={{
              boxShadow: '4px 4px 0 hsl(var(--foreground) / 0.3), 0 0 20px hsl(var(--primary) / 0.4)',
            }}
          >
            ▶ BEGIN
          </button>
        </div>
      )}

      {/* Skip */}
      {showSkip && !allVisible && (
        <button
          onClick={onComplete}
          className="absolute bottom-6 right-6 font-orbitron text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          SKIP →
        </button>
      )}

      <div className="crt-overlay" />
    </div>
  );
}
