import { useState } from 'react';
import TitleScreen from '@/components/TitleScreen';
import LevelSelect from '@/components/LevelSelect';
import GameCanvas from '@/components/GameCanvas';

type View = 'title' | 'levelselect' | 'game';

const Index = () => {
  const [view, setView] = useState<View>('title');
  const [selectedLevel, setSelectedLevel] = useState(1);

  const handlePlay = () => {
    setSelectedLevel(1);
    setView('game');
  };

  const handleLevelSelect = () => setView('levelselect');

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setView('game');
  };

  const handleBackToMenu = () => setView('title');

  if (view === 'game') {
    return <GameCanvas key={selectedLevel} level={selectedLevel} onBackToMenu={handleBackToMenu} />;
  }

  if (view === 'levelselect') {
    return <LevelSelect onSelect={handleSelectLevel} onBack={handleBackToMenu} />;
  }

  return <TitleScreen onPlay={handlePlay} onLevelSelect={handleLevelSelect} />;
};

export default Index;
