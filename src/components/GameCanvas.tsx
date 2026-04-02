import { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine, GameState, GameCallbacks } from '@/game/engine/GameEngine';
import { QuizQuestion } from '@/game/systems/QuizSystem';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/constants';
import HUD from './HUD';
import QuizModal from './QuizModal';
import StoryCard from './StoryCard';
import GameOver from './GameOver';
import MobileControls from './MobileControls';
import CRTOverlay from './CRTOverlay';
import GlitchTransition from './GlitchTransition';

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
  const [transitioning, setTransitioning] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState(1);
  const [transitionTo, setTransitionTo] = useState(2);

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
    if (!engineRef.current) return;
    const from = currentLevel;
    const to = currentLevel + 1;
    if (to > 8) {
      engineRef.current.nextLevel();
      return;
    }
    setTransitionFrom(from);
    setTransitionTo(to);
    setTransitioning(true);
  }, [currentLevel]);

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    engineRef.current?.nextLevel();
  }, []);

  const handleMobileInput = useCallback((key: string, pressed: boolean) => {
    if (!engineRef.current) return;
    if (pressed) engineRef.current.input.pressKey(key);
    else engineRef.current.input.releaseKey(key);
  }, []);

  const handleGravityToggle = useCallback(() => {
    engineRef.current?.toggleAntiGravity();
  }, []);

  const missionCaption = gameState === 'story'
    ? 'A fresh decade is cracking open — step in when ready.'
    : gameState === 'quiz'
    ? 'History bites back with a pop quiz. Pick fast.'
    : gameState === 'levelcomplete'
    ? 'The page turns. Another era is down.'
    : gameState === 'victory'
    ? 'Eight eras cleared. Anniversary legend status achieved.'
    : agActive
    ? 'Gravity is inverted. Keep running while the world drifts.'
    : agAvailable
    ? 'The anti-gravity switch is hot — tap it or press G.'
    : 'Stay low, grab boosts, and outrun the wreckage of every era.';

  return (
    <div className="relative mx-auto w-full max-w-[1040px] select-none">
      <div className="comic-stage rounded-2xl p-3 sm:p-4">
        {/* Header */}
        <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="comic-caption inline-flex rounded-sm">ISSUE {String(currentLevel).padStart(2, '0')}</div>
            <div className="mt-2 font-orbitron text-2xl sm:text-3xl font-black text-primary drop-shadow-[0_0_18px_hsl(var(--primary))]">
              {currentName}
            </div>
          </div>
          <div className="comic-panel px-4 py-3 text-right">
            <div className="text-[9px] tracking-[0.35em] text-muted-foreground font-orbitron">TIMELINE TARGET</div>
            <div className="font-orbitron text-xl sm:text-2xl font-black text-foreground">{currentYear}</div>
          </div>
        </div>

        {/* Canvas frame */}
        <div className="relative comic-panel overflow-hidden rounded-xl p-2 sm:p-3">
          <canvas
            ref={canvasRef}
            className="block w-full rounded-lg border border-border bg-background"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, imageRendering: 'pixelated' }}
          />

          <CRTOverlay />

          <HUD
            health={health}
            score={score}
            year={currentYear}
            levelName={currentName}
            antiGravityActive={agActive}
            antiGravityAvailable={agAvailable}
            antiGravityProgress={agProgress}
            onGravityToggle={handleGravityToggle}
          />

          {gameState === 'story' && (
            <StoryCard text={storyText} year={storyYear} name={storyName} onDismiss={handleStoryDismiss} />
          )}

          {gameState === 'quiz' && quizQuestion && (
            <QuizModal question={quizQuestion} onAnswer={handleQuizAnswer} onTimeout={handleQuizTimeout} />
          )}

          {(gameState === 'gameover' || gameState === 'levelcomplete' || gameState === 'victory') && (
            <GameOver state={gameState} score={score} level={currentLevel} onRetry={handleRetry} onNextLevel={handleNextLevel} onMenu={onBackToMenu} />
          )}

          {transitioning && (
            <GlitchTransition fromLevel={transitionFrom} toLevel={transitionTo} onComplete={handleTransitionComplete} />
          )}
        </div>

        {/* Footer narration */}
        <div className="relative z-10 mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="comic-narration px-4 py-3 text-sm leading-relaxed text-foreground/80">
            <span className="mb-1 block text-[10px] tracking-[0.35em] text-primary/70 font-orbitron">NARRATOR</span>
            {missionCaption}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-orbitron tracking-[0.25em] text-muted-foreground">
            <span className="comic-chip">DODGE</span>
            <span className="comic-chip">QUIZ</span>
            <span className="comic-chip">FLIP</span>
          </div>
        </div>

        <MobileControls onInput={handleMobileInput} />
      </div>
    </div>
  );
}
