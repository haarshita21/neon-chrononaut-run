import { useState, useEffect } from 'react';
import { LEVEL_COLORS, LEVEL_YEARS, LEVEL_NAMES } from '@/game/constants';

interface GlitchTransitionProps {
  fromLevel: number;
  toLevel: number;
  onComplete: () => void;
}

export default function GlitchTransition({ fromLevel, toLevel, onComplete }: GlitchTransitionProps) {
  const [phase, setPhase] = useState<'out' | 'year' | 'in'>('out');
  const [yearDisplay, setYearDisplay] = useState(LEVEL_YEARS[fromLevel - 1]);
  const toColors = LEVEL_COLORS[toLevel];

  useEffect(() => {
    // Phase 1: Glitch out (0.8s)
    const t1 = setTimeout(() => setPhase('year'), 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'year') return;
    // Rapidly count through years
    const fromYear = LEVEL_YEARS[fromLevel - 1];
    const toYear = LEVEL_YEARS[toLevel - 1];
    const steps = 20;
    const stepTime = 50;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setYearDisplay(Math.round(fromYear + (toYear - fromYear) * progress));
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setPhase('in'), 500);
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, [phase, fromLevel, toLevel]);

  useEffect(() => {
    if (phase !== 'in') return;
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: phase === 'out' ? 'transparent' : toColors.bg }}
    >
      {/* Glitch scanlines */}
      <div className={`absolute inset-0 ${phase === 'out' ? 'animate-glitch-out' : phase === 'in' ? 'animate-glitch-in' : ''}`}
        style={{ backgroundColor: toColors.bg }}
      />

      {/* Chromatic aberration bars */}
      {(phase === 'out' || phase === 'year') && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-[3px] w-full"
              style={{
                top: `${10 + i * 12}%`,
                backgroundColor: i % 2 === 0 ? toColors.primary : '#ff00ff',
                opacity: 0.3,
                transform: `translateX(${(Math.random() - 0.5) * 40}px)`,
                transition: 'transform 0.05s',
              }}
            />
          ))}
        </>
      )}

      {/* Year counter */}
      {phase === 'year' && (
        <div className="relative z-10 text-center animate-year-counter">
          <div
            className="font-orbitron text-6xl sm:text-8xl font-black"
            style={{ color: toColors.primary, textShadow: `0 0 30px ${toColors.glow}, 0 0 60px ${toColors.glow}` }}
          >
            {yearDisplay}
          </div>
          <div className="font-orbitron text-sm mt-2" style={{ color: toColors.primary + 'aa' }}>
            {LEVEL_NAMES[toLevel - 1]}
          </div>
        </div>
      )}

      {/* CRT flicker during transition */}
      <div className="crt-overlay" />
    </div>
  );
}
