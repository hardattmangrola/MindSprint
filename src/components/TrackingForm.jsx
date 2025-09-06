import React, { useState, useEffect } from 'react';
import { Save, Calendar, Heart, Zap, AlertTriangle, Activity } from 'lucide-react';

const TrackingForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    mood: '',
    moodScore: 5,
    energy: 5,
    stress: 5,
    wellness: 5,
    notes: '',
    activities: [],
    sleepHours: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodOptions = [
    { value: 'very_happy', label: 'Very Happy', emoji: '😄', color: 'text-green-500' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-green-400' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-yellow-400' },
    { value: 'sad', label: 'Sad', emoji: '😔', color: 'text-orange-400' },
    { value: 'very_sad', label: 'Very Sad', emoji: '😢', color: 'text-red-500' }
  ];

  const activityOptions = [
    { value: 'exercise', label: 'Exercise', icon: '💪' },
    { value: 'meditation', label: 'Meditation', icon: '🧘' },
    { value: 'reading', label: 'Reading', icon: '📚' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'rest', label: 'Rest', icon: '😴' },
    { value: 'hobby', label: 'Hobby', icon: '🎨' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save tracking data');
      }
    } catch (error) {
      console.error('Error submitting tracking data:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSliderColor = (value, type) => {
    if (type === 'stress') {
      // For stress, lower is better
      if (value <= 3) return 'from-green-500 to-green-400';
      if (value <= 6) return 'from-yellow-500 to-yellow-400';
      return 'from-red-500 to-red-400';
    } else {
      // For mood, energy, wellness, higher is better
      if (value >= 8) return 'from-green-500 to-green-400';
      if (value >= 6) return 'from-yellow-500 to-yellow-400';
      return 'from-red-500 to-red-400';
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Data Saved!</h3>
          <p className="text-gray-600">Your wellness tracking data has been saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Daily Wellness Tracking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-600" size={20} />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Heart className="inline mr-2" size={16} />
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('mood', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.mood === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className={`text-xs font-medium ${option.color}`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
            {formData.mood && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood Score (1-10)
                </label>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.moodScore}
                    onChange={(e) => handleInputChange('moodScore', parseInt(e.target.value))}
                    className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${getSliderColor(formData.moodScore, 'mood')}`}
                  />
                  <span className="text-sm text-gray-500">10</span>
                  <span className="text-lg font-bold text-gray-800 w-8">{formData.moodScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Manual input:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.moodScore}
                    onChange={(e) => handleInputChange('moodScore', parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="inline mr-2" size={16} />
              Energy Level (1-10)
            </label>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-gray-500">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => handleInputChange('energy', parseInt(e.target.value))}
                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${getSliderColor(formData.energy, 'energy')}`}
              />
              <span className="text-sm text-gray-500">10</span>
              <span className="text-lg font-bold text-gray-800 w-8">{formData.energy}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Manual input:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => handleInputChange('energy', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="inline mr-2" size={16} />
              Stress Level (1-10)
            </label>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-gray-500">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => handleInputChange('stress', parseInt(e.target.value))}
                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${getSliderColor(formData.stress, 'stress')}`}
              />
              <span className="text-sm text-gray-500">10</span>
              <span className="text-lg font-bold text-gray-800 w-8">{formData.stress}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Manual input:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => handleInputChange('stress', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Wellness Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="inline mr-2" size={16} />
              Overall Wellness (1-10)
            </label>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-gray-500">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.wellness}
                onChange={(e) => handleInputChange('wellness', parseInt(e.target.value))}
                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${getSliderColor(formData.wellness, 'wellness')}`}
              />
              <span className="text-sm text-gray-500">10</span>
              <span className="text-lg font-bold text-gray-800 w-8">{formData.wellness}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Manual input:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.wellness}
                onChange={(e) => handleInputChange('wellness', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activities Today (select all that apply)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {activityOptions.map(activity => (
                <button
                  key={activity.value}
                  type="button"
                  onClick={() => handleActivityToggle(activity.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.activities.includes(activity.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{activity.icon}</div>
                  <div className="text-xs font-medium text-gray-700">
                    {activity.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Hours (optional)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleepHours}
              onChange={(e) => handleInputChange('sleepHours', e.target.value)}
              placeholder="e.g., 7.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="How was your day? Any thoughts or observations..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.notes.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {!formData.mood && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">⚠️ Please select your mood</span> to enable saving your wellness data.
                </p>
              </div>
            )}
            <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.mood}
              className={`flex-1 px-4 py-3 border-gray-300 rounded-lg transition flex items-center justify-center space-x-2 font-medium ${
                loading || !formData.mood
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 hover:shadow-lg '
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="text-black border-gray-300" size={16} />
                  <span className="text-black">Save Data</span>
                </>
              )}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingForm;
