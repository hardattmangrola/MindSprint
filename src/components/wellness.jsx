import React, { useState } from 'react';
import TrackingForm from './TrackingForm';

const Wellness = () => {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [mood, setMood] = useState('neutral');
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const wellnessActivities = [
    {
      id: 'mood-tracker',
      name: 'Mood Tracker',
      description: 'Track your daily mood and emotional state',
      icon: '😊',
      color: 'from-yellow-400 to-orange-500',
      component: 'MoodTracker'
    },
    {
      id: 'energy-monitor',
      name: 'Energy Monitor',
      description: 'Monitor your energy levels throughout the day',
      icon: '⚡',
      color: 'from-blue-400 to-cyan-500',
      component: 'EnergyMonitor'
    },
    {
      id: 'stress-relief',
      name: 'Stress Relief',
      description: 'Quick stress relief exercises and techniques',
      icon: '🌿',
      color: 'from-green-400 to-emerald-500',
      component: 'StressRelief'
    }
  ];

  const handleActivitySelect = (activityId) => {
    setCurrentActivity(activityId);
  };

  const handleBackToMenu = () => {
    setCurrentActivity(null);
  };

  const updateWellnessScore = (points) => {
    setWellnessScore(prev => prev + points);
  };

  const renderMoodTracker = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Mood Tracker</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-white/80 mb-4">How are you feeling right now?</p>
            <div className="grid grid-cols-5 gap-4">
              {[
                { emoji: '😢', label: 'Sad', value: 'sad' },
                { emoji: '😔', label: 'Down', value: 'down' },
                { emoji: '😐', label: 'Neutral', value: 'neutral' },
                { emoji: '😊', label: 'Good', value: 'good' },
                { emoji: '😄', label: 'Great', value: 'great' }
              ].map((moodOption) => (
                <button
                  key={moodOption.value}
                  onClick={() => {
                    setMood(moodOption.value);
                    updateWellnessScore(10);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === moodOption.value
                      ? 'bg-yellow-400 border-yellow-300 text-black'
                      : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{moodOption.emoji}</div>
                  <div className="text-sm font-semibold">{moodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-xl font-bold text-white mb-2">Today's Mood</h3>
            <p className="text-white/80">Current mood: {mood}</p>
            <p className="text-white/80">Wellness points: {wellnessScore}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnergyMonitor = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Energy Monitor</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-white/80 mb-4">Rate your current energy level</p>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-white/80">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => {
                  setEnergy(parseInt(e.target.value));
                  updateWellnessScore(5);
                }}
                className="w-64 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white/80">High</span>
            </div>
            <div className="text-2xl font-bold text-white">{energy}/10</div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-xl font-bold text-white mb-2">Energy Tips</h3>
            <div className="text-left text-white/80 space-y-2">
              {energy <= 3 && (
                <p>💤 Take a short nap or rest</p>
              )}
              {energy <= 5 && energy > 3 && (
                <p>🥤 Stay hydrated and eat a healthy snack</p>
              )}
              {energy > 5 && energy <= 7 && (
                <p>🚶‍♀️ Go for a light walk or stretch</p>
              )}
              {energy > 7 && (
                <p>🏃‍♀️ You're energized! Consider exercise or productive work</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStressRelief = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Stress Relief</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-white/80 mb-4">Rate your current stress level</p>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-white/80">Calm</span>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => {
                  setStress(parseInt(e.target.value));
                  updateWellnessScore(5);
                }}
                className="w-64 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white/80">Stressed</span>
            </div>
            <div className="text-2xl font-bold text-white">{stress}/10</div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-xl font-bold text-white mb-2">Quick Stress Relief</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-white/80">
              <div>
                <p className="font-semibold mb-2">🌬️ Deep Breathing</p>
                <p className="text-sm">Inhale for 4, hold for 4, exhale for 4</p>
              </div>
              <div>
                <p className="font-semibold mb-2">🧘‍♀️ Meditation</p>
                <p className="text-sm">Focus on your breath for 5 minutes</p>
              </div>
              <div>
                <p className="font-semibold mb-2">🚶‍♀️ Walk</p>
                <p className="text-sm">Take a 10-minute walk outside</p>
              </div>
              <div>
                <p className="font-semibold mb-2">🎵 Music</p>
                <p className="text-sm">Listen to calming music</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => {
    if (currentActivity === 'mood-tracker') {
      return renderMoodTracker();
    } else if (currentActivity === 'energy-monitor') {
      return renderEnergyMonitor();
    } else if (currentActivity === 'stress-relief') {
      return renderStressRelief();
    }
    return null;
  };

  if (currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleBackToMenu}
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            ← Back to Wellness
          </button>
        </div>
        
        {/* Activity Component */}
        {renderActivity()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Wellness Hub</h1>
          <p className="text-xl text-white/80 mb-8">
            Track your health, mood, and wellness journey
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Wellness Score</p>
              <p className="text-3xl font-bold text-white">{wellnessScore}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Current Mood</p>
              <p className="text-3xl font-bold text-white capitalize">{mood}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Energy Level</p>
              <p className="text-3xl font-bold text-white">{energy}/10</p>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {wellnessActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivitySelect(activity.id)}
              className={`bg-gradient-to-br ${activity.color} p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{activity.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{activity.name}</h3>
                <p className="text-white/90 text-sm mb-4">{activity.description}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold hover:bg-white/30 transition-colors">
                  Start
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tracking Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowTrackingForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            📊 Track Daily Wellness
          </button>
        </div>

        {/* Instructions */}
        
      </div>

      {/* Tracking Form Modal */}
      {showTrackingForm && (
        <TrackingForm onClose={() => setShowTrackingForm(false)} />
      )}
    </div>
  );
};

export default Wellness;