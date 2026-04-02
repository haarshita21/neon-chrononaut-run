import { useState, useEffect } from 'react';

interface StoryCardProps {
  text: string;
  year: number;
  name: string;
  onDismiss: () => void;
}

export default function StoryCard({ text, year, name, onDismiss }: StoryCardProps) {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur z-20">
      <div className="max-w-lg w-full mx-4 text-center">
        <div className="font-orbitron text-5xl font-black text-primary mb-2 drop-shadow-[0_0_20px_hsl(var(--primary))]">
          {year}
        </div>
        <div className="font-orbitron text-lg text-secondary mb-6 drop-shadow-[0_0_8px_hsl(var(--secondary))]">
          {name}
        </div>
        <p className="text-foreground/80 text-sm leading-relaxed mb-8 font-mono min-h-[60px]">
          {displayText}
          {!done && <span className="animate-pulse">█</span>}
        </p>
        <button
          onClick={onDismiss}
          className="font-orbitron text-sm px-8 py-3 border border-primary text-primary rounded hover:bg-primary/10 transition-colors drop-shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
        >
          {done ? 'START' : 'SKIP →'}
        </button>
      </div>
    </div>
  );
}
