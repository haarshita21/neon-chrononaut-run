import { useState, useEffect, useRef } from 'react';
import comicPanel1 from '@/assets/comic-panel-1.jpg';
import comicPanel2 from '@/assets/comic-panel-2.jpg';
import comicPanel3 from '@/assets/comic-panel-3.jpg';
import comicPanel4 from '@/assets/comic-panel-4.jpg';
import { AudioManager } from '@/game/engine/AudioManager';

interface ComicPanelData {
  image: string;
  caption?: string;
  speechBubble?: { text: string; position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; speaker?: string };
  thought?: { text: string; position: 'top-left' | 'top-right' };
  narration?: string;
  sfx?: string;
  delay: number;
  span?: 'wide' | 'tall' | 'normal';
  isRunner?: boolean;
}

const PANELS: ComicPanelData[] = [
  {
    image: comicPanel1,
    caption: '1946 — THE UNIVERSITY OF PENNSYLVANIA',
    speechBubble: { text: "It's alive! 30 tons of vacuum tubes... and it COMPUTES!", position: 'top-right', speaker: 'DR. ECKERT' },
    narration: 'In a world where calculations took weeks by hand, two engineers dared to dream bigger...',
    sfx: 'BZZZZT!',
    delay: 0,
    span: 'wide',
  },
  {
    image: comicPanel2,
    caption: 'THE BIRTH OF A SOCIETY',
    speechBubble: { text: "Together, we'll shape the future of computing!", position: 'top-left' },
    thought: { text: 'IEEE Computer Society — Est. 1946', position: 'top-right' },
    delay: 800,
    span: 'normal',
  },
  {
    image: comicPanel3,
    caption: '80 YEARS OF INNOVATION',
    narration: 'From transistors to the cloud... from ARPANET to artificial intelligence... eight decades of breakthroughs.',
    delay: 1600,
    span: 'normal',
  },
  {
    image: comicPanel4,
    speechBubble: { text: "Time to run through history!", position: 'top-left', speaker: 'CODE RUNNER' },
    sfx: 'WHOOOOSH!',
    narration: 'One runner. Eight eras. The mission begins NOW.',
    delay: 2400,
    span: 'wide',
    isRunner: true,
  },
];

interface ComicIntroProps {
  onComplete: () => void;
}

export default function ComicIntro({ onComplete }: ComicIntroProps) {
  const [visiblePanels, setVisiblePanels] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const audioRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    audioRef.current = new AudioManager();
    return () => { audioRef.current?.destroy(); };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PANELS.forEach((panel, i) => {
      timers.push(setTimeout(() => {
        setVisiblePanels(i + 1);
        // Play SFX when panel appears
        if (panel.isRunner) {
          audioRef.current?.playComicWhoosh();
        } else {
          audioRef.current?.playComicBlip(i);
        }
      }, panel.delay));
    });
    timers.push(setTimeout(() => setShowSkip(true), 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  const allVisible = visiblePanels >= PANELS.length;

  const handleBegin = () => {
    audioRef.current?.playComicBegin();
    setTimeout(onComplete, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Halftone dot pattern background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '6px 6px',
      }} />

      {/* Comic page title */}
      <div className={`mb-3 text-center ${visiblePanels > 0 ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="font-orbitron text-[10px] tracking-[0.4em] text-muted-foreground">IEEE COMPUTER SOCIETY PRESENTS</div>
      </div>

      {/* Comic grid — asymmetric layout */}
      <div className="relative z-10 max-w-2xl w-full grid grid-cols-2 gap-2 sm:gap-3">
        {PANELS.map((panel, i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${
              panel.span === 'wide' ? 'col-span-2' : ''
            } ${i < visiblePanels ? 'animate-comic-panel' : 'opacity-0'}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Panel frame */}
            <div className="comic-panel rounded overflow-hidden relative" style={{
              aspectRatio: panel.span === 'wide' ? '2.2/1' : '1.15/1',
            }}>
              {/* Illustration */}
              <img
                src={panel.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? undefined : 'lazy'}
                width={640}
                height={512}
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Caption banner */}
              {panel.caption && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="comic-caption inline-block rounded-br text-[8px] sm:text-[10px] tracking-wider">
                    {panel.caption}
                  </div>
                </div>
              )}

              {/* Speech bubble */}
              {panel.speechBubble && i < visiblePanels && (
                <SpeechBubble
                  text={panel.speechBubble.text}
                  position={panel.speechBubble.position}
                  speaker={panel.speechBubble.speaker}
                  delay={0.2}
                />
              )}

              {/* Thought bubble */}
              {panel.thought && i < visiblePanels && (
                <ThoughtBubble
                  text={panel.thought.text}
                  position={panel.thought.position}
                  delay={0.4}
                />
              )}

              {/* SFX text */}
              {panel.sfx && i < visiblePanels && (
                <div
                  className="absolute animate-comic-text font-orbitron font-black text-lg sm:text-2xl"
                  style={{
                    bottom: '12%',
                    right: '8%',
                    color: 'hsl(var(--neon-gold))',
                    textShadow: '0 0 10px hsl(var(--neon-gold)), 2px 2px 0 hsl(var(--background))',
                    animationDelay: '0.5s',
                    transform: 'rotate(-8deg)',
                  }}
                >
                  {panel.sfx}
                </div>
              )}

              {/* Narration box */}
              {panel.narration && i < visiblePanels && (
                <div
                  className="absolute bottom-2 left-2 right-2 animate-comic-text"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="bg-background/90 border border-border rounded px-3 py-1.5 text-[10px] sm:text-xs font-mono text-foreground/80 leading-relaxed italic">
                    {panel.narration}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      {allVisible && (
        <div className="mt-5 animate-comic-burst">
          <button
            onClick={handleBegin}
            className="font-orbitron text-sm px-12 py-3.5 bg-primary text-primary-foreground rounded-sm font-bold hover:scale-105 transition-transform relative"
            style={{
              boxShadow: '4px 4px 0 hsl(var(--foreground) / 0.3), 0 0 25px hsl(var(--primary) / 0.4)',
            }}
          >
            ▶ BEGIN MISSION
          </button>
        </div>
      )}

      {/* Skip */}
      {showSkip && (
        <button
          onClick={onComplete}
          className="absolute bottom-4 right-4 font-orbitron text-[10px] text-muted-foreground hover:text-foreground transition-colors z-20"
        >
          SKIP →
        </button>
      )}

      <div className="crt-overlay" />
    </div>
  );
}

/* Speech Bubble Component */
function SpeechBubble({ text, position, speaker, delay = 0 }: {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  speaker?: string;
  delay?: number;
}) {
  const posClasses: Record<string, string> = {
    'top-left': 'top-[15%] left-[5%]',
    'top-right': 'top-[15%] right-[5%]',
    'bottom-left': 'bottom-[25%] left-[5%]',
    'bottom-right': 'bottom-[25%] right-[5%]',
  };
  const tailSide = position.includes('left') ? 'left-4' : 'right-4';
  const tailDir = position.includes('bottom') ? 'bottom' : 'top';

  return (
    <div
      className={`absolute ${posClasses[position]} max-w-[55%] animate-comic-text z-10`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative bg-foreground text-background rounded-2xl px-3 py-2 text-[9px] sm:text-[11px] font-bold leading-snug">
        {speaker && (
          <span className="block text-[7px] sm:text-[8px] font-orbitron text-primary-foreground/60 mb-0.5 tracking-wider">
            {speaker}:
          </span>
        )}
        {text}
        <div
          className={`absolute ${tailSide} w-0 h-0 ${
            tailDir === 'bottom'
              ? '-bottom-2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground'
              : '-top-2 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground'
          }`}
        />
      </div>
    </div>
  );
}

/* Thought Bubble Component */
function ThoughtBubble({ text, position, delay = 0 }: {
  text: string;
  position: 'top-left' | 'top-right';
  delay?: number;
}) {
  const posClasses: Record<string, string> = {
    'top-left': 'top-[20%] left-[5%]',
    'top-right': 'top-[20%] right-[5%]',
  };

  return (
    <div
      className={`absolute ${posClasses[position]} max-w-[50%] animate-comic-text z-10`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative bg-foreground/90 text-background rounded-full px-4 py-2 text-[9px] sm:text-[11px] font-orbitron font-bold text-center"
        style={{ border: '2px dashed hsl(var(--primary))' }}
      >
        {text}
        <div className="absolute -bottom-3 left-6 w-2 h-2 rounded-full bg-foreground/90" />
        <div className="absolute -bottom-5 left-4 w-1.5 h-1.5 rounded-full bg-foreground/70" />
      </div>
    </div>
  );
}
