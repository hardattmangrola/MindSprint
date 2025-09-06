import { useState, useEffect } from 'react';

const GratitudeMemoryTiles = () => {
  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gratitudePairs = [
    { id: 1, text: "I am grateful for my health", emoji: "💪" },
    { id: 2, text: "I appreciate my family", emoji: "👨‍👩‍👧‍👦" },
    { id: 3, text: "I'm thankful for nature", emoji: "🌿" },
    { id: 4, text: "I value my friendships", emoji: "👥" },
    { id: 5, text: "I'm grateful for learning", emoji: "📚" },
    { id: 6, text: "I appreciate simple joys", emoji: "☀️" },
    { id: 7, text: "I'm thankful for music", emoji: "🎵" },
    { id: 8, text: "I value peaceful moments", emoji: "🧘‍♀️" }
  ];

  const initializeGame = () => {
    // Create pairs and shuffle
    const gameTiles = [...gratitudePairs, ...gratitudePairs].map((item, index) => ({
      ...item,
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle the tiles
    for (let i = gameTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameTiles[i], gameTiles[j]] = [gameTiles[j], gameTiles[i]];
    }

    setTiles(gameTiles);
    setFlippedTiles([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setGameComplete(false);
    setGameStarted(true);
  };

  const handleTileClick = (tile) => {
    if (tile.isFlipped || tile.isMatched || flippedTiles.length >= 2) return;

    const newFlippedTiles = [...flippedTiles, tile.uniqueId];
    setFlippedTiles(newFlippedTiles);

    // Update tile state
    setTiles(prev => prev.map(t => 
      t.uniqueId === tile.uniqueId ? { ...t, isFlipped: true } : t
    ));

    // Check for match when two tiles are flipped
    if (newFlippedTiles.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedTiles;
      const firstTile = tiles.find(t => t.uniqueId === firstId);
      const secondTile = tiles.find(t => t.uniqueId === secondId);

      if (firstTile && secondTile && firstTile.id === secondTile.id) {
        // Match found!
        setMatchedPairs(prev => [...prev, firstTile.id]);
        setScore(prev => prev + 100);
        
        // Mark tiles as matched
        setTiles(prev => prev.map(t => 
          t.uniqueId === firstId || t.uniqueId === secondId 
            ? { ...t, isMatched: true }
            : t
        ));

        // Check if game is complete
        if (matchedPairs.length + 1 === gratitudePairs.length) {
          setTimeout(() => setGameComplete(true), 500);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setTiles(prev => prev.map(t => 
            t.uniqueId === firstId || t.uniqueId === secondId 
              ? { ...t, isFlipped: false }
              : t
          ));
        }, 1000);
      }

      // Clear flipped tiles after delay
      setTimeout(() => setFlippedTiles([]), 1000);
    }
  };

  const getTileContent = (tile) => {
    if (tile.isFlipped || tile.isMatched) {
      return (
        <div className="text-center">
          <div className="text-3xl mb-2">{tile.emoji}</div>
          <p className="text-sm font-medium text-gray-700">{tile.text}</p>
        </div>
      );
    }
    return (
      <div className="text-center">
        <div className="text-4xl">🤔</div>
        <p className="text-sm text-gray-500">Click to reveal</p>
      </div>
    );
  };

  const getTileClasses = (tile) => {
    let baseClasses = "w-full h-24 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center";
    
    if (tile.isMatched) {
      return `${baseClasses} bg-green-100 border-green-400 transform scale-95`;
    } else if (tile.isFlipped) {
      return `${baseClasses} bg-yellow-100 border-yellow-400 transform scale-105`;
    } else {
      return `${baseClasses} bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 hover:scale-105`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Gratitude Memory Tiles</h2>
        
        {!gameStarted && (
          <div className="text-center space-y-4">
            <p className="text-white/80 mb-6">
              Find matching pairs of gratitude affirmations. 
              Click on tiles to reveal them and create positive memories!
            </p>
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start Memory Game
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
                <p className="text-sm opacity-80">Moves</p>
                <p className="text-2xl font-bold">{moves}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-80">Pairs Found</p>
                <p className="text-2xl font-bold">{matchedPairs.length}/{gratitudePairs.length}</p>
              </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tiles.map(tile => (
                <div
                  key={tile.uniqueId}
                  onClick={() => handleTileClick(tile)}
                  className={getTileClasses(tile)}
                >
                  {getTileContent(tile)}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-teal-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(matchedPairs.length / gratitudePairs.length) * 100}%` }}
              ></div>
            </div>

            {/* Instructions */}
            <div className="text-center text-white/80">
              <p>Click on tiles to find matching gratitude pairs. Take your time and enjoy the positive messages!</p>
            </div>
          </div>
        )}

        {gameComplete && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white">Memory Master!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">Moves Taken: {moves}</p>
            <p className="text-white/80">You've strengthened your gratitude memory!</p>
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GratitudeMemoryTiles;
