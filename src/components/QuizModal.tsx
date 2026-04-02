import { useState, useEffect } from 'react';
import { QuizQuestion } from '@/game/systems/QuizSystem';
import { QUIZ_TIME_LIMIT } from '@/game/constants';

interface QuizModalProps {
  question: QuizQuestion;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
}

export default function QuizModal({ question, onAnswer, onTimeout }: QuizModalProps) {
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setTimeLeft(QUIZ_TIME_LIMIT);
    setAnswered(false);
    setSelectedIndex(-1);
  }, [question]);

  useEffect(() => {
    if (answered) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); onTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answered, onTimeout]);

  const handleAnswer = (i: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIndex(i);
    onAnswer(i);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
      <div className="comic-panel p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="comic-caption inline-flex rounded-sm">POP QUIZ</div>
          <span className={`font-orbitron text-sm font-bold ${timeLeft <= 3 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / QUIZ_TIME_LIMIT) * 100}%` }}
          />
        </div>

        <div className="comic-narration px-4 py-3 mb-4">
          <span className="block text-[10px] tracking-[0.35em] text-primary/70 mb-1">NARRATOR</span>
          <span className="text-sm text-foreground/80 italic font-mono">Don&apos;t blank out now — history is watching.</span>
        </div>

        <p className="text-foreground font-medium mb-4 text-sm">{question.question}</p>

        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`comic-panel text-left px-4 py-2.5 text-sm font-mono transition-all ${
                answered && i === question.correctIndex
                  ? 'border-primary bg-primary/10 text-primary'
                  : answered && i === selectedIndex
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'hover:border-primary/50 hover:bg-primary/5 text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
