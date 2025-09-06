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
  
  const intervalRef = useRef(null);

  // Generate a simple maze
  const generateMaze = (size) => {
    const newMaze = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        // Create walls on borders and some random internal walls
        const isWall = (x === 0 || x === size - 1 || y === 0 || y === size - 1) ||
                      (Math.random() < 0.2 && x > 1 && x < size - 2 && y > 1 && y < size - 2);
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
    const newMaze = generateMaze(mazeSize);
    const startPos = { x: 1, y: 1 };
    const endPos = { x: mazeSize - 2, y: mazeSize - 2 };
    
    // Ensure start and end are not walls
    newMaze[startPos.y][startPos.x] = { ...newMaze[startPos.y][startPos.x], isWall: false, isPath: true };
    newMaze[endPos.y][endPos.x] = { ...newMaze[endPos.y][endPos.x], isWall: false, isPath: true };
    
    setMaze(newMaze);
    setPlayerPos(startPos);
    setTargetPos(endPos);
    setScore(0);
    setGameComplete(false);
    setGameStarted(true);
    setSpeed(1);
    setIsBreathing(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
    
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
  };

  const movePlayer = (direction) => {
    if (!gameStarted || gameComplete) return;
    
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
        setGameComplete(true);
        setScore(prev => prev + 1000);
        stopBreathing();
      } else {
        // Add points for movement
        setScore(prev => prev + 10);
      }
    }
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
        
        {!gameStarted && (
          <div className="text-center space-y-4">
            <p className="text-white/80 mb-6">
              Navigate through the maze while maintaining calm breathing. 
              Your speed increases as you breathe mindfully!
            </p>
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start Mindful Journey
            </button>
          </div>
        )}

        {gameStarted && !gameComplete && (
          <div className="space-y-6">
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
            </div>
          </div>
        )}

        {gameComplete && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white">Mindful Journey Complete!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">You've mastered mindful movement!</p>
            <button
              onClick={initializeGame}
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
