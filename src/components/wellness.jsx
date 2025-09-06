import { useState } from 'react';
import BreathingPatternPuzzle from './games/BreathingPatternPuzzle';
import EmotionColorMatching from './games/EmotionColorMatching';
import GratitudeMemoryTiles from './games/GratitudeMemoryTiles';
import MindfulMazeMeditation from './games/MindfulMazeMeditation';

const Wellness = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  const games = [
    {
      id: 'breathing',
      name: 'Breathing Pattern Puzzle',
      description: 'Follow breathing patterns to complete mandala designs',
      icon: '🫁',
      component: BreathingPatternPuzzle,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'emotion',
      name: 'Emotion Color Matching',
      description: 'Match emotions to their corresponding colors',
      icon: '🎨',
      component: EmotionColorMatching,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'gratitude',
      name: 'Gratitude Memory Tiles',
      description: 'Find matching pairs of gratitude affirmations',
      icon: '🧩',
      component: GratitudeMemoryTiles,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'maze',
      name: 'Mindful Maze Meditation',
      description: 'Navigate mazes while maintaining calm breathing',
      icon: '🧘',
      component: MindfulMazeMeditation,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const handleGameSelect = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  const handleGameComplete = (score) => {
    setTotalScore(prev => prev + score);
    setGamesPlayed(prev => prev + 1);
  };

  const renderGame = () => {
    const game = games.find(g => g.id === currentGame);
    if (!game) return null;
    
    const GameComponent = game.component;
    return <GameComponent onComplete={handleGameComplete} />;
  };

  if (currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleBackToMenu}
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            ← Back to Games
          </button>
        </div>
        
        {/* Game Component */}
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Mindful Puzzle Games</h1>
          <p className="text-xl text-white/80 mb-8">
            Play engaging games that promote mindfulness and mental wellness
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Total Score</p>
              <p className="text-3xl font-bold text-white">{totalScore}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Games Played</p>
              <p className="text-3xl font-bold text-white">{gamesPlayed}</p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className={`bg-gradient-to-br ${game.color} p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-white/90 text-sm mb-4">{game.description}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold hover:bg-white/30 transition-colors">
                  Play Now
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div className="text-left">
                <p className="font-semibold mb-2">🎯 Choose Your Game</p>
                <p className="text-sm">Select any game that interests you</p>
              </div>
              <div className="text-left">
                <p className="font-semibold mb-2">🧘 Stay Mindful</p>
                <p className="text-sm">Focus on breathing and staying calm</p>
              </div>
              <div className="text-left">
                <p className="font-semibold mb-2">🏆 Earn Points</p>
                <p className="text-sm">Complete games to build your wellness score</p>
              </div>
              <div className="text-left">
                <p className="font-semibold mb-2">🔄 Practice Daily</p>
                <p className="text-sm">Regular play improves mindfulness skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
