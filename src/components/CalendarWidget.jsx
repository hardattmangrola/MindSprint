import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const CalendarWidget = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trackingData, setTrackingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch tracking data
  useEffect(() => {
    fetchTrackingData();
  }, [currentDate]);

  const fetchTrackingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/calendar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const dataMap = {};
        result.data.forEach(entry => {
          dataMap[entry.date] = entry;
        });
        setTrackingData(dataMap);
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'very_happy': return 'bg-green-500';
      case 'happy': return 'bg-green-400';
      case 'neutral': return 'bg-yellow-400';
      case 'sad': return 'bg-orange-400';
      case 'very_sad': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'very_happy': return '😄';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'very_sad': return '😢';
      default: return '';
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const generatePDFReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/statistics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.statistics) {
          // Create HTML content for PDF
          const htmlContent = createPDFContent(result.statistics, currentDate);
          
          // Open in new window for printing
          const printWindow = window.open('', '_blank');
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Wait for content to load then trigger print
          printWindow.onload = () => {
            printWindow.print();
          };
        } else {
          alert('No data available for the selected period');
        }
      } else {
        alert('Failed to fetch data for PDF generation');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    }
  };

  const createPDFContent = (stats, date) => {
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `
      <html>
        <head>
          <title>Wellness Report - ${monthName} ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .metric { display: flex; justify-content: space-between; margin: 10px 0; }
            .chart { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Wellness Report</h1>
            <h2>${monthName} ${year}</h2>
            <p>Generated for ${user?.name || 'User'}</p>
          </div>
          
          <div class="section">
            <h3>Summary Statistics</h3>
            <div class="metric">
              <span>Total Days Tracked:</span>
              <span>${stats.totalDays}</span>
            </div>
            <div class="metric">
              <span>Average Mood Score:</span>
              <span>${stats.averageMood.toFixed(1)}/10</span>
            </div>
            <div class="metric">
              <span>Average Energy Level:</span>
              <span>${stats.averageEnergy.toFixed(1)}/10</span>
            </div>
            <div class="metric">
              <span>Average Stress Level:</span>
              <span>${stats.averageStress.toFixed(1)}/10</span>
            </div>
            <div class="metric">
              <span>Average Wellness Score:</span>
              <span>${stats.averageWellness.toFixed(1)}/10</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Mood Distribution</h3>
            <div class="metric">
              <span>Very Happy:</span>
              <span>${stats.moodDistribution.very_happy} days</span>
            </div>
            <div class="metric">
              <span>Happy:</span>
              <span>${stats.moodDistribution.happy} days</span>
            </div>
            <div class="metric">
              <span>Neutral:</span>
              <span>${stats.moodDistribution.neutral} days</span>
            </div>
            <div class="metric">
              <span>Sad:</span>
              <span>${stats.moodDistribution.sad} days</span>
            </div>
            <div class="metric">
              <span>Very Sad:</span>
              <span>${stats.moodDistribution.very_sad} days</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Best Day</h3>
            <p>Date: ${new Date(stats.bestDay.date).toLocaleDateString()}</p>
            <p>Mood: ${stats.bestDay.moodScore}/10, Energy: ${stats.bestDay.energy}/10, Wellness: ${stats.bestDay.wellness}/10</p>
          </div>
          
          <div class="section">
            <h3>Daily Data</h3>
            <table>
              <tr>
                <th>Date</th>
                <th>Mood</th>
                <th>Energy</th>
                <th>Stress</th>
                <th>Wellness</th>
                <th>Notes</th>
              </tr>
              ${stats.data.map(entry => `
                <tr>
                  <td>${new Date(entry.date).toLocaleDateString()}</td>
                  <td>${entry.moodScore}/10</td>
                  <td>${entry.energy}/10</td>
                  <td>${entry.stress}/10</td>
                  <td>${entry.wellness}/10</td>
                  <td>${entry.notes || '-'}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </body>
      </html>
    `;
  };

  // Remove the downloadPDF function as we're using print functionality now

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-8 bg-white/20 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-8 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Wellness Calendar</h3>
        <button
          onClick={generatePDFReport}
          className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition text-sm"
        >
          <Download size={16} />
          <span>PDF Report</span>
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="text-lg font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-300 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-10"></div>;
          }
          
          const dateStr = formatDate(day);
          const data = trackingData[dateStr];
          const isToday = formatDate(new Date()) === dateStr;
          
          return (
            <div
              key={index}
              className={`h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all relative ${
                isToday ? 'ring-2 ring-purple-400' : ''
              } ${data ? getMoodColor(data.mood) : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
              onClick={() => setSelectedDate(data ? { date: day, data } : null)}
            >
              <span className={`text-sm font-medium ${data ? 'text-white' : 'text-gray-400'}`}>
                {day.getDate()}
              </span>
              {data && (
                <div className="absolute -top-1 -right-1 text-xs">
                  {getMoodEmoji(data.mood)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <h5 className="font-semibold text-white mb-2">
            {selectedDate.date.toLocaleDateString()}
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Mood:</span>
              <span className="text-white ml-2">{selectedDate.data.moodScore}/10</span>
            </div>
            <div>
              <span className="text-gray-300">Energy:</span>
              <span className="text-white ml-2">{selectedDate.data.energy}/10</span>
            </div>
            <div>
              <span className="text-gray-300">Stress:</span>
              <span className="text-white ml-2">{selectedDate.data.stress}/10</span>
            </div>
            <div>
              <span className="text-gray-300">Wellness:</span>
              <span className="text-white ml-2">{selectedDate.data.wellness}/10</span>
            </div>
          </div>
          {selectedDate.data.notes && (
            <div className="mt-2">
              <span className="text-gray-300 text-sm">Notes:</span>
              <p className="text-white text-sm mt-1">{selectedDate.data.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-300">Very Happy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-gray-300">Happy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span className="text-gray-300">Neutral</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-400 rounded"></div>
          <span className="text-gray-300">Sad</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-300">Very Sad</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
