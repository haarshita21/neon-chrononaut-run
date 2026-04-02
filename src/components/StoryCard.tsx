import { useState, useEffect, useRef } from 'react';
import { getNarrator } from '@/game/engine/Narrator';

interface StoryCardProps {
  text: string;
  year: number;
  name: string;
  onDismiss: () => void;
}

export default function StoryCard({ text, year, name, onDismiss }: StoryCardProps) {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);
  const narratorRef = useRef(getNarrator());

  useEffect(() => {
    setDisplayText('');
    setDone(false);
    // Voice narration for the era briefing
    narratorRef.current.speak(`${year}. ${name}. ${text}`);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
    return () => {
      clearInterval(interval);
      narratorRef.current.stop();
    };
  }, [text, year, name]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur z-20">
      <div className="max-w-lg w-full mx-4 comic-panel p-6 text-center animate-scale-in">
        <div className="comic-caption inline-flex rounded-sm mb-4">ERA BRIEFING</div>

        <div className="font-orbitron text-5xl font-black text-primary mb-2 drop-shadow-[0_0_20px_hsl(var(--primary))]">
          {year}
        </div>
        <div className="font-orbitron text-lg text-secondary mb-4 drop-shadow-[0_0_8px_hsl(var(--secondary))]">
          {name}
        </div>

        <div className="comic-narration px-4 py-3 mb-6 text-left">
          <span className="block text-[10px] tracking-[0.35em] text-primary/70 mb-1">NARRATOR</span>
          <span className="text-sm leading-relaxed text-foreground/80 font-mono">
            {displayText}
            {!done && <span className="animate-pulse">█</span>}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            narratorRef.current.stop();
            onDismiss();
          }}
          className="comic-button font-orbitron text-sm px-8 py-3"
        >
          {done ? '▶ DROP IN' : 'SKIP →'}
        </button>
      </div>
    </div>
  );
}
