import { useState, useEffect } from 'react';

type Screen = 'title' | 'howtoplay';

const HOW_TO_PLAY_BEATS = [
  { title: 'RUN THE PAGE', shortcut: '← → / A D', copy: 'Stay ahead of spikes, bugs, and wreckage from every decade.' },
  { title: 'KICK UP', shortcut: 'SPACE / ↑', copy: 'Jump gaps cleanly. From Level 3 onward you get a double-jump.' },
  { title: 'BREAK GRAVITY', shortcut: 'G / HUD BTN', copy: 'You start with one charge. Purple chips reload it mid-run.' },
  { title: 'ACE THE QUIZ', shortcut: 'POP QUIZ', copy: 'History bites back. Fast answers mean bonus score and shields.' },
];

const SURVIVAL_NOTES = [
  'Shields forgive a bad hit.',
  'Speed boosts turn panic into pace.',
  'Hesitation gets stranded in the last era.',
];

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
      <div className="min-h-screen comic-stage flex items-center justify-center p-4">
        <div className="relative z-10 max-w-5xl w-full comic-panel p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="comic-caption inline-flex rounded-sm mb-2">FIELD GUIDE</div>
              <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-primary drop-shadow-[0_0_18px_hsl(var(--primary))]">
                HOW TO PLAY
              </h2>
              <p className="mt-2 font-orbitron text-[11px] tracking-[0.35em] text-muted-foreground">
                RUN LOUD · ANSWER FAST · BEND GRAVITY
              </p>
            </div>
            <button type="button" onClick={() => setScreen('title')} className="comic-button comic-button--ghost font-orbitron text-xs px-4 py-2">
              ← BACK
            </button>
          </div>

          <div className="comic-narration px-4 py-3 mb-6">
            <span className="block text-[10px] tracking-[0.35em] text-primary/70">NARRATOR&apos;S NOTE</span>
            <span className="text-sm leading-relaxed text-foreground/80">
              This is not a quiet museum walk — it is a sprint through eighty years of sparks, silicon, and bad decisions dodged at full speed.
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {HOW_TO_PLAY_BEATS.map((beat) => (
              <div key={beat.title} className="comic-panel p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="font-orbitron text-sm font-black text-foreground">{beat.title}</div>
                  <span className="comic-chip">{beat.shortcut}</span>
                </div>
                <p className="text-sm font-mono leading-relaxed text-foreground/75">{beat.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {SURVIVAL_NOTES.map((note, index) => (
              <div key={note} className="comic-panel p-4">
                <div className="mb-2 font-orbitron text-[10px] tracking-[0.35em] text-muted-foreground">TIP 0{index + 1}</div>
                <p className="text-sm font-mono text-foreground/80">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen comic-stage flex items-center justify-center p-4">
      <div className="relative z-10 grid w-full max-w-6xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Hero panel */}
        <section className="comic-panel p-5 sm:p-8">
          <div className="comic-caption inline-flex rounded-sm mb-4">ISSUE #80 · SPECIAL EDITION</div>

          <div className="text-xs font-orbitron text-muted-foreground mb-4 tracking-[0.3em]">
            IEEE COMPUTER SOCIETY
          </div>

          <h1
            className={`font-orbitron text-5xl sm:text-7xl font-black text-primary mb-3 transition-transform ${
              glitch ? 'translate-x-1 skew-x-2' : ''
            }`}
            style={{ textShadow: '0 0 20px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.4)' }}
          >
            CODE RUNNER
          </h1>

          <div className="font-orbitron text-secondary text-sm sm:text-base mb-6 tracking-[0.35em] drop-shadow-[0_0_10px_hsl(var(--secondary))]">
            1946—2026 · RUN THE TIMELINE
          </div>

          <div className="comic-narration max-w-2xl px-4 py-3 mb-6">
            <span className="block text-[10px] tracking-[0.35em] text-primary/70">NARRATOR</span>
            <span className="text-sm leading-relaxed text-foreground/80">
              One runner drops into the archive of computing history. Dodge decade-shattering hazards, ace pop quizzes, and flip gravity before the next breakthrough hits.
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onPlay} className="comic-button font-orbitron text-sm px-10 py-3">
              START ISSUE →
            </button>
            <button type="button" onClick={onLevelSelect} className="comic-button comic-button--ghost font-orbitron text-xs px-6 py-3">
              LEVEL SELECT
            </button>
            <button type="button" onClick={() => setScreen('howtoplay')} className="comic-button comic-button--ghost font-orbitron text-xs px-6 py-3">
              HOW TO PLAY
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-orbitron tracking-[0.25em] text-muted-foreground">
            <span className="comic-chip">MOVE</span>
            <span className="comic-chip">JUMP</span>
            <span className="comic-chip">FLIP</span>
          </div>
        </section>

        {/* Side dossier */}
        <aside className="grid gap-4">
          <div className="comic-panel p-5">
            <div className="mb-4 font-orbitron text-[10px] tracking-[0.35em] text-primary/70">SURVIVAL DOSSIER</div>
            <div className="space-y-3">
              {HOW_TO_PLAY_BEATS.slice(0, 3).map((beat) => (
                <div key={beat.title} className="comic-panel p-3">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="font-orbitron text-xs font-black text-foreground">{beat.title}</span>
                    <span className="comic-chip">{beat.shortcut}</span>
                  </div>
                  <p className="text-xs font-mono leading-relaxed text-foreground/75">{beat.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="comic-panel p-5">
            <div className="comic-caption inline-flex rounded-sm mb-3">EDGY MODE</div>
            <p className="text-sm font-mono leading-relaxed text-foreground/80">
              Purple gravity chips reload your field after the opening charge. Shields erase one bad collision. Quizzes reward nerve. Hesitation gets stranded in the previous decade.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
