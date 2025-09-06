import { useState, useEffect } from 'react';

const EmotionColorMatching = () => {
  const [emotions, setEmotions] = useState([
    { id: 1, name: 'Joy', color: 'yellow', matched: false, position: null },
    { id: 2, name: 'Calm', color: 'blue', matched: false, position: null },
    { id: 3, name: 'Love', color: 'pink', matched: false, position: null },
    { id: 4, name: 'Hope', color: 'green', matched: false, position: null },
    { id: 5, name: 'Peace', color: 'purple', matched: false, position: null },
    { id: 6, name: 'Gratitude', color: 'orange', matched: false, position: null }
  ]);
  
  const [colorZones, setColorZones] = useState([
    { id: 1, color: 'yellow', emotion: null },
    { id: 2, color: 'blue', emotion: null },
    { id: 3, color: 'pink', emotion: null },
    { id: 4, color: 'green', emotion: null },
    { id: 5, color: 'purple', emotion: null },
    { id: 6, color: 'orange', emotion: null }
  ]);
  
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameComplete(false);
    setSelectedEmotion(null);
    // Reset emotions and zones
    setEmotions(prev => prev.map(emotion => ({ ...emotion, matched: false, position: null })));
    setColorZones(prev => prev.map(zone => ({ ...zone, emotion: null })));
  };

  const handleEmotionClick = (emotion) => {
    if (emotion.matched || !gameStarted) return;
    setSelectedEmotion(emotion);
  };

  const handleZoneClick = (zone) => {
    if (!selectedEmotion || !gameStarted) return;
    
    // Check if the emotion matches the zone color
    if (selectedEmotion.color === zone.color) {
      // Correct match!
      setEmotions(prev => prev.map(emotion => 
        emotion.id === selectedEmotion.id 
          ? { ...emotion, matched: true, position: zone.id }
          : emotion
      ));
      
      setColorZones(prev => prev.map(z => 
        z.id === zone.id 
          ? { ...z, emotion: selectedEmotion }
          : z
      ));
      
      setScore(prev => prev + 50);
      
      // Check if all emotions are matched
      const allMatched = emotions.every(emotion => emotion.id === selectedEmotion.id || emotion.matched);
      if (allMatched) {
        setGameComplete(true);
      }
    } else {
      // Wrong match - small penalty
      setScore(prev => Math.max(0, prev - 10));
    }
    
    setSelectedEmotion(null);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600',
      blue: 'bg-blue-400 hover:bg-blue-500 border-blue-600',
      pink: 'bg-pink-400 hover:bg-pink-500 border-pink-600',
      green: 'bg-green-400 hover:bg-green-500 border-green-600',
      purple: 'bg-purple-400 hover:bg-purple-500 border-purple-600',
      orange: 'bg-orange-400 hover:bg-orange-500 border-orange-600'
    };
    return colorMap[color] || 'bg-gray-400';
  };

  const getEmotionDescription = (emotion) => {
    const descriptions = {
      'Joy': 'Feeling of great pleasure and happiness',
      'Calm': 'Peaceful and free from stress',
      'Love': 'Deep affection and care',
      'Hope': 'Feeling of expectation and desire',
      'Peace': 'Freedom from disturbance and tranquility',
      'Gratitude': 'Feeling of thankfulness and appreciation'
    };
    return descriptions[emotion] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Emotion Color Matching</h2>
        
        {!gameStarted && (
          <div className="text-center space-y-4">
            <p className="text-white/80 mb-6">
              Match each emotion to its corresponding color zone. 
              Click on an emotion card, then click on the matching color zone.
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Start Matching
            </button>
          </div>
        )}

        {gameStarted && !gameComplete && (
          <div className="space-y-8">
            {/* Score Display */}
            <div className="text-center">
              <p className="text-white text-xl font-semibold">Score: {score}</p>
            </div>

            {/* Emotion Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emotions.map(emotion => (
                <div
                  key={emotion.id}
                  onClick={() => handleEmotionClick(emotion)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    emotion.matched 
                      ? 'opacity-50 cursor-not-allowed' 
                      : selectedEmotion?.id === emotion.id
                      ? 'ring-4 ring-white scale-105'
                      : 'hover:scale-105'
                  } ${getColorClasses(emotion.color)}`}
                >
                  <h3 className="font-bold text-white text-lg">{emotion.name}</h3>
                  <p className="text-white/80 text-sm">{getEmotionDescription(emotion)}</p>
                </div>
              ))}
            </div>

            {/* Color Zones */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorZones.map(zone => (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`p-8 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                    zone.emotion 
                      ? 'ring-4 ring-green-400' 
                      : 'hover:ring-2 hover:ring-white/50'
                  } ${getColorClasses(zone.color)}`}
                >
                  {zone.emotion ? (
                    <div className="text-center">
                      <div className="text-2xl mb-2">✓</div>
                      <p className="font-bold text-white">{zone.emotion.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl mb-2">?</div>
                      <p className="font-bold text-white/60">Drop Here</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-center text-white/80">
              {selectedEmotion ? (
                <p>Now click on the {selectedEmotion.color} zone to match "{selectedEmotion.name}"</p>
              ) : (
                <p>Click on an emotion card to start matching</p>
              )}
            </div>
          </div>
        )}

        {gameComplete && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white">Perfect Match!</h3>
            <p className="text-white/80">Final Score: {score}</p>
            <p className="text-white/80">You've mastered emotional awareness!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionColorMatching;
