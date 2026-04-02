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
      <div className="bg-card border border-primary/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
        {/* Timer */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-orbitron text-muted-foreground">QUIZ</span>
          <span className={`font-orbitron text-sm font-bold ${timeLeft <= 3 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / QUIZ_TIME_LIMIT) * 100}%` }}
          />
        </div>

        <p className="text-foreground font-medium mb-4 text-sm">{question.question}</p>

        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`text-left px-4 py-2.5 rounded border text-sm font-mono transition-all ${
                answered && i === question.correctIndex
                  ? 'border-neon-green bg-neon-green/10 text-neon-green'
                  : answered && i === selectedIndex
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5 text-foreground'
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
