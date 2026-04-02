/**
 * Reusable comic-book visual decorations — starbursts, corner folds,
 * halftone dots, action lines, zigzag dividers, and "POW" badges.
 */

/* ── Starburst Badge ── */
export function Starburst({ text, color = 'primary', className = '', size = 'md' }: {
  text: string;
  color?: 'primary' | 'secondary' | 'destructive' | 'gold' | 'green';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = { sm: 'w-14 h-14 text-[7px]', md: 'w-20 h-20 text-[9px]', lg: 'w-28 h-28 text-xs' };
  const colorMap: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    gold: 'bg-neon-gold text-primary-foreground',
    green: 'bg-neon-green text-primary-foreground',
  };
  const glowMap: Record<string, string> = {
    primary: 'drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]',
    secondary: 'drop-shadow-[0_0_12px_hsl(var(--secondary)/0.5)]',
    destructive: 'drop-shadow-[0_0_12px_hsl(var(--destructive)/0.5)]',
    gold: 'drop-shadow-[0_0_12px_hsl(var(--neon-gold)/0.5)]',
    green: 'drop-shadow-[0_0_12px_hsl(var(--neon-green)/0.5)]',
  };

  return (
    <div className={`comic-starburst ${sizeMap[size]} ${colorMap[color]} ${glowMap[color]} ${className}`}>
      <span className="font-orbitron font-black tracking-wider leading-none text-center">{text}</span>
    </div>
  );
}

/* ── Corner Fold ── */
export function CornerFold({ corner = 'top-right', className = '' }: {
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) {
  const posMap: Record<string, string> = {
    'top-left': 'top-0 left-0 -scale-x-100',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0 -scale-x-100 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 -scale-y-100',
  };

  return (
    <div className={`absolute ${posMap[corner]} pointer-events-none ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M0 0 L32 0 L32 32 Z" fill="hsl(var(--primary) / 0.15)" />
        <path d="M0 0 L32 0 L32 32 Z" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

/* ── Halftone Patch ── */
export function HalftonePatch({ className = '' }: { className?: string }) {
  return (
    <div className={`comic-halftone pointer-events-none ${className}`} aria-hidden />
  );
}

/* ── Action Lines (radial burst) ── */
export function ActionLines({ className = '' }: { className?: string }) {
  return (
    <div className={`comic-action-lines pointer-events-none ${className}`} aria-hidden />
  );
}

/* ── Zigzag Divider ── */
export function ZigzagDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`comic-zigzag ${className}`} aria-hidden>
      <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3">
        <path
          d="M0 6 L10 0 L20 12 L30 0 L40 12 L50 0 L60 12 L70 0 L80 12 L90 0 L100 12 L110 0 L120 12 L130 0 L140 12 L150 0 L160 12 L170 0 L180 12 L190 0 L200 12 L210 0 L220 12 L230 0 L240 12 L250 0 L260 12 L270 0 L280 12 L290 0 L300 12 L310 0 L320 12 L330 0 L340 12 L350 0 L360 12 L370 0 L380 12 L390 0 L400 12"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* ── SFX Pop (e.g. "POW!", "ZAP!", "BOOM!") ── */
export function SfxPop({ text, className = '', rotate = -8 }: {
  text: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={`comic-sfx-pop font-orbitron font-black select-none pointer-events-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {text}
    </div>
  );
}

/* ── Torn Edge Strip ── */
export function TornEdge({ side = 'bottom', className = '' }: {
  side?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <div className={`comic-torn-edge comic-torn-edge--${side} ${className}`} aria-hidden />
  );
}

/* ── Comic Dots Row (decorative circles) ── */
export function ComicDots({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/30"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
