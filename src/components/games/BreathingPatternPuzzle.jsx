import { useState, useEffect, useRef } from 'react';

const BreathingPatternPuzzle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [pattern, setPattern] = useState([4, 4, 4]); // inhale, hold, exhale counts
  const [currentCount, setCurrentCount] = useState(0);
  const [mandalaProgress, setMandalaProgress] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const intervalRef = useRef(null);
  const totalPhases = 12; // 4 complete breathing cycles

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setMandalaProgress(0);
    setGameComplete(false);
    setCurrentCount(0);
    setBreathingPhase('inhale');
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleBreathTap = () => {
    if (!isPlaying) return;

    const expectedPhase = breathingPhase;
    const expectedCount = currentCount + 1;
    
    // Check if user is following the rhythm
    if (expectedCount <= pattern[breathingPhase === 'inhale' ? 0 : breathingPhase === 'hold' ? 1 : 2]) {
      setCurrentCount(expectedCount);
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      
      // Update mandala progress
      setMandalaProgress(prev => Math.min(prev + 2, 100));
      
      // Check if phase is complete
      if (expectedCount >= pattern[breathingPhase === 'inhale' ? 0 : breathingPhase === 'hold' ? 1 : 2]) {
        // Move to next phase
        if (breathingPhase === 'inhale') {
          setBreathingPhase('hold');
        } else if (breathingPhase === 'hold') {
          setBreathingPhase('exhale');
        } else {
          setBreathingPhase('inhale');
          setStreak(prev => prev + 5); // Bonus for completing cycle
        }
        setCurrentCount(0);
        
        // Check if game is complete
        if (mandalaProgress >= 100) {
          setGameComplete(true);
          stopGame();
        }
      }
    } else {
      // Reset streak on mistake
      setStreak(0);
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-green-400 to-blue-500';
      case 'hold': return 'from-blue-500 to-purple-500';
      case 'exhale': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Breathing Pattern Puzzle</h2>
        
        {!isPlaying && !gameComplete && (
          <div className="space-y-4">
            <p className="text-white/80 mb-6">
              Follow the breathing pattern to complete the mandala. 
              Tap when you inhale, hold, and exhale in rhythm.
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start Breathing Exercise
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="space-y-6">
            {/* Mandala Progress */}
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white transition-all duration-300"
                style={{ 
                  transform: `rotate(${mandalaProgress * 3.6}deg)`,
                  borderTopColor: '#10b981',
                  borderRightColor: '#3b82f6'
                }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(mandalaProgress)}%</span>
              </div>
            </div>

            {/* Breathing Phase Indicator */}
            <div className={`bg-gradient-to-r ${getPhaseColor()} p-6 rounded-2xl`}>
              <h3 className="text-2xl font-bold text-white mb-2">{getPhaseText()}</h3>
              <p className="text-white/80">
                Count: {currentCount} / {pattern[breathingPhase === 'inhale' ? 0 : breathingPhase === 'hold' ? 1 : 2]}
              </p>
            </div>

            {/* Tap Button */}
            <button
              onClick={handleBreathTap}
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${getPhaseColor()} text-white text-xl font-bold hover:scale-110 transition-transform shadow-lg`}
            >
              TAP
            </button>

            {/* Score Display */}
            <div className="flex justify-between text-white">
              <div>
                <p className="text-sm opacity-80">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Streak</p>
                <p className="text-2xl font-bold">{streak}</p>
              </div>
            </div>

            <button
              onClick={stopGame}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          </div>
        )}

        {gameComplete && (
          <div className="space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white">Mandala Complete!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">Max Streak: {streak}</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingPatternPuzzle;
