import { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine, GameState, GameCallbacks } from '@/game/engine/GameEngine';
import { QuizQuestion } from '@/game/systems/QuizSystem';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/constants';
import HUD from './HUD';
import QuizModal from './QuizModal';
import StoryCard from './StoryCard';
import GameOver from './GameOver';
import MobileControls from './MobileControls';

interface GameCanvasProps {
  level: number;
  onBackToMenu: () => void;
}

export default function GameCanvas({ level, onBackToMenu }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('story');
  const [health, setHealth] = useState(5);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentYear, setCurrentYear] = useState(1946);
  const [currentName, setCurrentName] = useState('ENIAC');
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [storyText, setStoryText] = useState('');
  const [storyYear, setStoryYear] = useState(1946);
  const [storyName, setStoryName] = useState('');
  const [agActive, setAgActive] = useState(false);
  const [agAvailable, setAgAvailable] = useState(false);
  const [agProgress, setAgProgress] = useState(0);

  const callbacks: GameCallbacks = {
    onStateChange: setGameState,
    onHealthChange: setHealth,
    onScoreChange: setScore,
    onLevelChange: (l, y, n) => { setCurrentLevel(l); setCurrentYear(y); setCurrentName(n); },
    onQuiz: setQuizQuestion,
    onStory: (s, y, n) => { setStoryText(s); setStoryYear(y); setStoryName(n); },
    onAntiGravityChange: (a, av, p) => { setAgActive(a); setAgAvailable(av); setAgProgress(p); },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const engine = new GameEngine(canvas, callbacks);
    engineRef.current = engine;
    engine.startLevel(level);
    engine.startLoop();

    return () => { engine.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStoryDismiss = useCallback(() => {
    engineRef.current?.startPlaying();
  }, []);

  const handleQuizAnswer = useCallback((index: number) => {
    engineRef.current?.answerQuiz(index);
  }, []);

  const handleQuizTimeout = useCallback(() => {
    engineRef.current?.quizTimeout();
  }, []);

  const handleRetry = useCallback(() => {
    engineRef.current?.retry();
  }, []);

  const handleNextLevel = useCallback(() => {
    engineRef.current?.nextLevel();
  }, []);

  const handleMobileInput = useCallback((key: string, pressed: boolean) => {
    if (!engineRef.current) return;
    if (pressed) engineRef.current.input.pressKey(key);
    else engineRef.current.input.releaseKey(key);
  }, []);

  return (
    <div className="relative w-full max-w-[960px] mx-auto select-none">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-border"
        style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, imageRendering: 'pixelated' }}
      />

      <HUD
        health={health}
        score={score}
        year={currentYear}
        levelName={currentName}
        antiGravityActive={agActive}
        antiGravityAvailable={agAvailable}
        antiGravityProgress={agProgress}
      />

      {gameState === 'story' && (
        <StoryCard
          text={storyText}
          year={storyYear}
          name={storyName}
          onDismiss={handleStoryDismiss}
        />
      )}

      {gameState === 'quiz' && quizQuestion && (
        <QuizModal
          question={quizQuestion}
          onAnswer={handleQuizAnswer}
          onTimeout={handleQuizTimeout}
        />
      )}

      {(gameState === 'gameover' || gameState === 'levelcomplete' || gameState === 'victory') && (
        <GameOver
          state={gameState}
          score={score}
          level={currentLevel}
          onRetry={handleRetry}
          onNextLevel={handleNextLevel}
          onMenu={onBackToMenu}
        />
      )}

      <MobileControls onInput={handleMobileInput} />
    </div>
  );
}
