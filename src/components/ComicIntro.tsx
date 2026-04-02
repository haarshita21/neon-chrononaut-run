import { useState, useEffect, useRef } from 'react';
import comicPanel1 from '@/assets/comic-panel-1.jpg';
import comicPanel2 from '@/assets/comic-panel-2.jpg';
import comicPanel3 from '@/assets/comic-panel-3.jpg';
import comicPanel4 from '@/assets/comic-panel-4.jpg';
import { AudioManager } from '@/game/engine/AudioManager';
import { getNarrator } from '@/game/engine/Narrator';
import { Volume2, VolumeX } from 'lucide-react';
import { Starburst, CornerFold, HalftonePatch, ZigzagDivider, SfxPop, ComicDots } from './ComicDecorations';

interface ComicPanelData {
  image: string;
  alt: string;
  caption?: string;
  pageNum: string;
  speechBubble?: { text: string; position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; speaker?: string };
  thought?: { text: string; position: 'top-left' | 'top-right' };
  narration?: string;
  voiceover: string;
  sfx?: string;
  delay: number;
  span?: 'wide' | 'tall' | 'normal';
  isRunner?: boolean;
}

const PANELS: ComicPanelData[] = [
  {
    image: comicPanel1,
    alt: 'Scientists standing before the ENIAC computer with electrical sparks flying',
    caption: '1946 — THE UNIVERSITY OF PENNSYLVANIA',
    pageNum: 'I',
    speechBubble: { text: "It's alive! 30 tons of vacuum tubes... and it COMPUTES!", position: 'top-right', speaker: 'DR. ECKERT' },
    narration: 'In a world where calculations took weeks by hand, two engineers dared to dream bigger...',
    voiceover: 'Nineteen forty-six. The University of Pennsylvania. In a world where calculations took weeks by hand, two engineers dared to dream bigger. Thirty tons of vacuum tubes hummed to life, and ENIAC was born.',
    sfx: 'BZZZZT!',
    delay: 0,
    span: 'wide',
  },
  {
    image: comicPanel2,
    alt: 'Engineers shaking hands as they found the IEEE Computer Society',
    caption: 'THE BIRTH OF A SOCIETY',
    pageNum: 'II',
    speechBubble: { text: "Together, we'll wire the future of computing!", position: 'top-left' },
    thought: { text: 'IEEE Computer Society — Est. 1946', position: 'top-right' },
    voiceover: 'That same year, visionaries gathered around a table and forged the IEEE Computer Society. A pledge to push computing forward, decade after decade.',
    delay: 800,
    span: 'normal',
  },
  {
    image: comicPanel3,
    alt: 'Montage of computing evolution from transistors to AI neural networks',
    caption: '80 YEARS OF INNOVATION',
    pageNum: 'III',
    narration: 'From transistors to the cloud... from ARPANET to artificial intelligence... eight decades of breakthroughs that rewired the planet.',
    voiceover: 'From transistors to the cloud. From ARPANET to artificial intelligence. Eight decades of breakthroughs that rewired the planet.',
    delay: 1600,
    span: 'normal',
  },
  {
    image: comicPanel4,
    alt: 'A neon cyberpunk runner sprinting through a digital circuit board cityscape',
    caption: 'THE RUN BEGINS',
    pageNum: 'IV',
    speechBubble: { text: "Time to run through history!", position: 'top-left', speaker: 'CODE RUNNER' },
    sfx: 'WHOOOOSH!',
    narration: 'One runner. Eight eras. The mission begins NOW.',
    voiceover: 'One runner. Eight eras. The mission begins now!',
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef<AudioManager | null>(null);
  const narratorRef = useRef(getNarrator());

  useEffect(() => {
    audioRef.current = new AudioManager();
    return () => {
      audioRef.current?.destroy();
      narratorRef.current.stop();
    };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PANELS.forEach((panel, i) => {
      timers.push(setTimeout(() => {
        setVisiblePanels(i + 1);
        if (panel.isRunner) {
          audioRef.current?.playComicWhoosh();
        } else {
          audioRef.current?.playComicBlip(i);
        }
        if (voiceEnabled) {
          narratorRef.current.queueSpeak(panel.voiceover);
        }
      }, panel.delay));
    });
    timers.push(setTimeout(() => setShowSkip(true), 400));
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allVisible = visiblePanels >= PANELS.length;

  const handleBegin = () => {
    narratorRef.current.stop();
    audioRef.current?.playComicBegin();
    setTimeout(onComplete, 400);
  };

  const handleSkip = () => {
    narratorRef.current.stop();
    onComplete();
  };

  const toggleVoice = () => {
    const enabled = narratorRef.current.toggle();
    setVoiceEnabled(enabled);
  };

  return (
    <div className="min-h-screen comic-stage flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Background decorations */}
      <HalftonePatch className="top-6 left-8" />
      <HalftonePatch className="bottom-12 right-10 w-[140px] h-[140px]" />

      {/* Masthead */}
      <div className={`mb-4 text-center relative ${visiblePanels > 0 ? 'animate-fade-in' : 'opacity-0'}`}>
        <Starburst text="NEW!" color="destructive" size="sm" className="absolute -top-4 -right-8" />
        <div className="comic-caption inline-flex rounded-sm mb-2">ISSUE #80 · ORIGIN STORY</div>
        <div className="font-orbitron text-[10px] tracking-[0.4em] text-muted-foreground">IEEE COMPUTER SOCIETY PRESENTS</div>
        <ComicDots count={6} className="justify-center mt-2" />
      </div>

      {/* Comic grid */}
      <div className="relative z-10 max-w-3xl w-full grid grid-cols-2 gap-2 sm:gap-3">
        {PANELS.map((panel, i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${
              panel.span === 'wide' ? 'col-span-2' : ''
            } ${i < visiblePanels ? 'animate-comic-panel' : 'opacity-0'}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="comic-panel rounded overflow-hidden relative group" style={{
              aspectRatio: panel.span === 'wide' ? '2.2/1' : '1.15/1',
            }}>
              {/* Corner folds */}
              <CornerFold corner={i % 2 === 0 ? 'top-right' : 'top-left'} />

              {/* Page number watermark */}
              <div className="absolute top-2 right-3 font-orbitron text-[40px] sm:text-[56px] font-black text-foreground/[0.04] leading-none z-0 select-none pointer-events-none">
                {panel.pageNum}
              </div>

              <img
                src={panel.image}
                alt={panel.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? undefined : 'lazy'}
                width={panel.span === 'wide' ? 1024 : 640}
                height={panel.span === 'wide' ? 512 : 640}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, hsl(var(--background) / 0.7), transparent 40%, hsl(var(--background) / 0.35))'
              }} />

              {/* Action speed lines for runner panel */}
              {panel.isRunner && i < visiblePanels && (
                <div className="absolute inset-0 comic-speed-lines pointer-events-none" />
              )}

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

              {/* SFX */}
              {panel.sfx && i < visiblePanels && (
                <SfxPop
                  text={panel.sfx}
                  className="absolute text-xl sm:text-3xl"
                  rotate={-8}
                />
              )}

              {/* Narration box */}
              {panel.narration && i < visiblePanels && (
                <div
                  className="absolute bottom-2 left-2 right-2 animate-comic-text"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="comic-narration px-3 py-2 text-[10px] sm:text-xs leading-relaxed">
                    <span className="not-italic text-[8px] tracking-[0.3em] text-primary/60 block mb-0.5">NARRATOR</span>
                    {panel.narration}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ZigzagDivider className="max-w-3xl w-full mt-3" />

      {/* Progress dots */}
      <div className="mt-3 flex gap-2 items-center">
        {PANELS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < visiblePanels ? 'bg-primary scale-100' : 'bg-muted scale-75'
            }`}
          />
        ))}
      </div>

      {/* Action button */}
      {allVisible && (
        <div className="mt-5 animate-comic-burst relative">
          <Starburst text="GO!" color="primary" size="sm" className="absolute -top-6 -right-8" />
          <button
            onClick={handleBegin}
            className="comic-button font-orbitron text-sm px-12 py-3.5 font-bold comic-button--primary"
          >
            ▶ BEGIN MISSION
          </button>
        </div>
      )}

      {/* Voice toggle */}
      <button
        onClick={toggleVoice}
        className="absolute top-4 right-4 p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors z-20 bg-card/80 backdrop-blur-sm"
        aria-label={voiceEnabled ? 'Mute narrator' : 'Enable narrator'}
      >
        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Skip */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute bottom-4 right-4 comic-button comic-button--ghost font-orbitron text-[10px] px-3 py-1.5 z-20"
        >
          SKIP →
        </button>
      )}

      <div className="crt-overlay rounded-none" />
    </div>
  );
}

/* Speech Bubble */
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
      <div className="relative bg-foreground text-background rounded-2xl px-3 py-2 text-[9px] sm:text-[11px] font-bold leading-snug shadow-lg">
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

/* Thought Bubble */
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
