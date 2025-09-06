import { useState, useEffect, useRef } from 'react';

const MindfulMazeMeditation = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mazeSize, setMazeSize] = useState(8);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300); // Total time remaining
  const [totalTime, setTotalTime] = useState(300); // 5 minutes total
  const [selectedTime, setSelectedTime] = useState(5); // minutes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(true);
  const [gameTimerStarted, setGameTimerStarted] = useState(false);
  
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  // Generate a simple maze with increasing difficulty
  const generateMaze = (size, level) => {
    const newMaze = [];
    const wallDensity = Math.min(0.1 + (level - 1) * 0.05, 0.4); // Increase wall density with level
    
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        // Create walls on borders and some random internal walls
        const isWall = (x === 0 || x === size - 1 || y === 0 || y === size - 1) ||
                      (Math.random() < wallDensity && x > 1 && x < size - 2 && y > 1 && y < size - 2);
        row.push({
          x, y,
          isWall,
          isPlayer: false,
          isTarget: false,
          isPath: !isWall
        });
      }
      newMaze.push(row);
    }
    return newMaze;
  };

  const initializeGame = () => {
    setShowTimeSelection(false);
    setCurrentLevel(1);
    setScore(0);
    setGameComplete(false);
    setGameStarted(true);
    setSpeed(1);
    setIsBreathing(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
    setIsTimeUp(false);
    setLevelComplete(false);
    setGameTimerStarted(false);
    
    // Set total time based on selection
    const totalGameTime = selectedTime * 60;
    setTotalTime(totalGameTime);
    setTimeLeft(totalGameTime);
    
    // Generate first level maze
    generateLevelMaze(1);
  };

  const generateLevelMaze = (level) => {
    const newMaze = generateMaze(mazeSize, level);
    const startPos = { x: 1, y: 1 };
    const endPos = { x: mazeSize - 2, y: mazeSize - 2 };
    
    // Ensure start and end are not walls
    newMaze[startPos.y][startPos.x] = { ...newMaze[startPos.y][startPos.x], isWall: false, isPath: true };
    newMaze[endPos.y][endPos.x] = { ...newMaze[endPos.y][endPos.x], isWall: false, isPath: true };
    
    setMaze(newMaze);
    setPlayerPos(startPos);
    setTargetPos(endPos);
    setLevelComplete(false);
  };

  const startGameTimer = () => {
    // Start main game timer (only once when game starts)
    if (!gameTimerStarted) {
      setGameTimerStarted(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true);
            stopBreathing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
    
    // Start game timer if not already started
    startGameTimer();
    
    // Clear any existing breathing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Breathing cycle: inhale 4, hold 4, exhale 4
    const breathingPattern = ['inhale', 'hold', 'exhale'];
    let phaseIndex = 0;
    let count = 0;
    
    intervalRef.current = setInterval(() => {
      count++;
      setBreathingCount(count);
      
      if (count >= 4) {
        count = 0;
        phaseIndex = (phaseIndex + 1) % breathingPattern.length;
        setBreathingPhase(breathingPattern[phaseIndex]);
        
        if (phaseIndex === 0) {
          // Complete breathing cycle - increase speed
          setSpeed(prev => Math.min(prev + 0.1, 2));
        }
      }
    }, 1000);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Don't stop the game timer - it should continue running
  };

  const movePlayer = (direction) => {
    if (!gameStarted || gameComplete || isTimeUp || !isBreathing) return;
    
    const newPos = { ...playerPos };
    
    switch (direction) {
      case 'up':
        newPos.y = Math.max(0, newPos.y - 1);
        break;
      case 'down':
        newPos.y = Math.min(maze.length - 1, newPos.y + 1);
        break;
      case 'left':
        newPos.x = Math.max(0, newPos.x - 1);
        break;
      case 'right':
        newPos.x = Math.min(maze[0].length - 1, newPos.x + 1);
        break;
      default:
        return;
    }
    
    // Check if new position is valid (not a wall)
    if (maze[newPos.y] && maze[newPos.y][newPos.x] && !maze[newPos.y][newPos.x].isWall) {
      setPlayerPos(newPos);
      
      // Check if reached target
      if (newPos.x === targetPos.x && newPos.y === targetPos.y) {
        setLevelComplete(true);
        setScore(prev => prev + 1000);
        
        // Check if this was the final level
        if (currentLevel >= maxLevel) {
          setGameComplete(true);
          stopBreathing(); // Only stop breathing when game is completely finished
        } else {
          // Move to next level - don't stop breathing, just pause movement
          setTimeout(() => {
            nextLevel();
          }, 2000);
        }
      } else {
        // Add points for movement
        setScore(prev => prev + 10);
      }
    }
  };

  const nextLevel = () => {
    const nextLevelNum = currentLevel + 1;
    setCurrentLevel(nextLevelNum);
    setSpeed(1); // Reset speed for new level
    generateLevelMaze(nextLevelNum);
    // Timer and breathing continue running - no restart needed!
  };

  const handleKeyPress = (e) => {
    if (!isBreathing) return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        movePlayer('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        movePlayer('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        movePlayer('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        movePlayer('right');
        break;
    }
  };

  useEffect(() => {
    if (isBreathing) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isBreathing, playerPos]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-green-400 to-blue-500';
      case 'hold': return 'from-blue-500 to-purple-500';
      case 'exhale': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Mindful Maze Meditation</h2>
        
        {showTimeSelection && (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Select Game Duration</h3>
            <p className="text-white/80 mb-6">
              Choose how long you want to play. You'll have 5 levels to complete!
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setSelectedTime(minutes)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTime === minutes
                      ? 'bg-purple-500 border-purple-300 text-white'
                      : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <div className="text-2xl font-bold">{minutes}</div>
                  <div className="text-sm">min</div>
                </button>
              ))}
            </div>
            
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start {selectedTime}-Minute Journey
            </button>
          </div>
        )}

        {!gameStarted && !showTimeSelection && (
          <div className="text-center space-y-4">
            <p className="text-white/80 mb-6">
              Navigate through the maze while maintaining calm breathing. 
              Your speed increases as you breathe mindfully!
            </p>
            <button
              onClick={() => setShowTimeSelection(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start Mindful Journey
            </button>
          </div>
        )}

        {gameStarted && !gameComplete && !isTimeUp && (
          <div className="space-y-6">
            {/* Level and Timer Display */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white mb-2">Level {currentLevel} of {maxLevel}</div>
              <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mt-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${timeLeft <= 30 ? 'bg-red-400' : 'bg-gradient-to-r from-purple-400 to-indigo-400'}`}
                  style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-white/60 mt-1">
                Total Time Remaining
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex justify-between items-center text-white">
              <div className="text-center">
                <p className="text-sm opacity-80">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-80">Speed</p>
                <p className="text-2xl font-bold">{speed.toFixed(1)}x</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-80">Breathing</p>
                <p className="text-2xl font-bold">{isBreathing ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            {/* Breathing Control */}
            <div className="text-center">
              {!isBreathing ? (
                <button
                  onClick={startBreathing}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Start Breathing
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`bg-gradient-to-r ${getBreathingColor()} p-4 rounded-2xl`}>
                    <h3 className="text-xl font-bold text-white">{getBreathingText()}</h3>
                    <p className="text-white/80">Count: {breathingCount}/4</p>
                  </div>
                  <button
                    onClick={stopBreathing}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Stop Breathing
                  </button>
                </div>
              )}
            </div>

            {/* Maze */}
            <div className="flex justify-center">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mazeSize}, 1fr)` }}>
                {maze.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-8 h-8 rounded-sm ${
                        cell.isWall
                          ? 'bg-gray-600'
                          : cell.x === playerPos.x && cell.y === playerPos.y
                          ? 'bg-yellow-400 flex items-center justify-center text-black font-bold'
                          : cell.x === targetPos.x && cell.y === targetPos.y
                          ? 'bg-green-400 flex items-center justify-center text-black font-bold'
                          : 'bg-gray-200'
                      }`}
                    >
                      {cell.x === playerPos.x && cell.y === playerPos.y && '🧘'}
                      {cell.x === targetPos.x && cell.y === targetPos.y && '🎯'}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-white/80">
              <p>Use WASD or Arrow Keys to move. Keep breathing to increase speed!</p>
              <p>Reach the target (🎯) while maintaining mindful breathing.</p>
              <p className="text-yellow-300 font-semibold">Timer runs continuously - complete all levels before time runs out!</p>
            </div>
          </div>
        )}

        {levelComplete && currentLevel < maxLevel && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white">Level {currentLevel} Complete!</h3>
            <p className="text-white/80">Automatically continuing to Level {currentLevel + 1}...</p>
            <div className="text-white/60 mb-2">
              Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="animate-spin text-4xl">⏳</div>
          </div>
        )}

        {isTimeUp && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-2xl font-bold text-white">Time's Up!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">Levels Completed: {currentLevel - 1}</p>
            <p className="text-white/80">You reached Level {currentLevel}!</p>
            <button
              onClick={() => setShowTimeSelection(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}

        {gameComplete && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white">All Levels Complete!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">You've mastered all 5 levels!</p>
            <p className="text-white/80">Time Taken: {selectedTime} minutes</p>
            <button
              onClick={() => setShowTimeSelection(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindfulMazeMeditation;
