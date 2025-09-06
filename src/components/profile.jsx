import React, { useState, useEffect } from 'react';
import { User, Calendar, BarChart3, Download, Settings, LogOut } from 'lucide-react';
import CalendarWidget from './CalendarWidget';

const Profile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserStats(result.statistics);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDummyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/dummy-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully added ${result.count} dummy data entries!`);
        // Refresh the stats
        fetchUserStats();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add dummy data');
      }
    } catch (error) {
      console.error('Error adding dummy data:', error);
      alert('Error adding dummy data');
    }
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'very_happy': return '😄';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'very_sad': return '😢';
      default: return '😐';
    }
  };

  const getMoodLabel = (mood) => {
    switch (mood) {
      case 'very_happy': return 'Very Happy';
      case 'happy': return 'Happy';
      case 'neutral': return 'Neutral';
      case 'sad': return 'Sad';
      case 'very_sad': return 'Very Sad';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-white/20 rounded-xl"></div>
              <div className="h-96 bg-white/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user?.name || 'User'}</h1>
              <p className="text-gray-300">Wellness Profile</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-800 to-pink-500 text-white rounded-lg hover:from-pink-900 hover:to-pink-600 transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-lg rounded-lg p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'calendar' && (
              <CalendarWidget user={user} />
            )}

            {activeTab === 'stats' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Your Statistics</h3>
                
                {userStats ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{userStats.totalDays}</div>
                        <div className="text-sm text-gray-300">Days Tracked</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{userStats.averageMood.toFixed(1)}</div>
                        <div className="text-sm text-gray-300">Avg Mood</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{userStats.averageEnergy.toFixed(1)}</div>
                        <div className="text-sm text-gray-300">Avg Energy</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{userStats.averageWellness.toFixed(1)}</div>
                        <div className="text-sm text-gray-300">Avg Wellness</div>
                      </div>
                    </div>

                    {/* Mood Distribution */}
                    <div className="bg-white/10 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Mood Distribution</h4>
                      <div className="space-y-3">
                        {Object.entries(userStats.moodDistribution).map(([mood, count]) => (
                          <div key={mood} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getMoodEmoji(mood)}</span>
                              <span className="text-white">{getMoodLabel(mood)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                  style={{ width: `${(count / userStats.totalDays) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best and Worst Days */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Best Day</h4>
                        <div className="space-y-2">
                          <div className="text-white">
                            <span className="text-gray-300">Date:</span> {new Date(userStats.bestDay.date).toLocaleDateString()}
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Mood:</span> {userStats.bestDay.moodScore}/10
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Energy:</span> {userStats.bestDay.energy}/10
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Wellness:</span> {userStats.bestDay.wellness}/10
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Worst Day</h4>
                        <div className="space-y-2">
                          <div className="text-white">
                            <span className="text-gray-300">Date:</span> {new Date(userStats.worstDay.date).toLocaleDateString()}
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Mood:</span> {userStats.worstDay.moodScore}/10
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Energy:</span> {userStats.worstDay.energy}/10
                          </div>
                          <div className="text-white">
                            <span className="text-gray-300">Wellness:</span> {userStats.worstDay.wellness}/10
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h4 className="text-xl font-semibold text-white mb-2">No Data Yet</h4>
                    <p className="text-gray-300">Start tracking your wellness to see your statistics here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Account Information</h4>
                    <div className="space-y-2">
                      <div className="text-white">
                        <span className="text-gray-300">Name:</span> {user?.name || 'Not set'}
                      </div>
                      <div className="text-white">
                        <span className="text-gray-300">Email:</span> {user?.email || 'Not set'}
                      </div>
                      <div className="text-white">
                        <span className="text-gray-300">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Data Export</h4>
                    <p className="text-gray-300 mb-4">Download your wellness data for backup or analysis.</p>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition">
                      <Download size={16} />
                      <span>Export Data</span>
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Test Data</h4>
                    <p className="text-gray-300 mb-4">Add dummy data for September 1-5, 2025 to test the system.</p>
                    <button 
                      onClick={addDummyData}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-500 text-white rounded-lg hover:from-green-700 hover:to-blue-600 transition"
                    >
                      <span>📊</span>
                      <span>Add Test Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              {userStats ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Mood</span>
                    <span className="text-white font-semibold">{userStats.averageMood.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Energy</span>
                    <span className="text-white font-semibold">{userStats.averageEnergy.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Stress</span>
                    <span className="text-white font-semibold">{userStats.averageStress.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Days Tracked</span>
                    <span className="text-white font-semibold">{userStats.totalDays}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-300 text-sm">Start tracking to see your stats</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Profile created</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">First login</span>
                </div>
                {userStats && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Started tracking wellness</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
