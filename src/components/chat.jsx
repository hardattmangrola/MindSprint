import React, { useState, useEffect, useRef } from 'react';
import { useBackend } from './backend';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to MindSprint! I'm here to help with your mental wellness journey.",
      isBot: true,
      timestamp: new Date(),
      mood: null,
      moodEmoji: "🤗"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showWellnessMenu, setShowWellnessMenu] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { 
    sendMessage, 
    isLoading, 
    error, 
    getWellnessCheckIn, 
    getMindfulnessExercise,
    currentMood,
    moodEmoji,
    mentorName
  } = useBackend();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // Auto-scroll functionality will be added later
  }, [messages]);

  // Update welcome message with mentor name
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 1) {
      setMessages([
        {
          id: 1,
          text: `Hello! I'm ${mentorName}, your mental wellness mentor. I'm here to support you with daily check-ins, mindfulness exercises, and emotional guidance. How are you feeling today?`,
          isBot: true,
          timestamp: new Date(),
          mood: null,
          moodEmoji: moodEmoji
        }
      ]);
    }
  }, [mentorName, currentMood, moodEmoji]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
      mood: null,
      moodEmoji: ""
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await sendMessage(inputValue);
      if (response) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.text,
          isBot: true,
          timestamp: new Date(),
          mood: null,
          moodEmoji: response.moodEmoji || "🤗"
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWellnessCheckIn = () => {
    const checkInText = getWellnessCheckIn();
    setInputValue(checkInText);
    setShowWellnessMenu(false);
  };

  const handleMindfulnessExercise = () => {
    const exercise = getMindfulnessExercise();
    const exerciseText = `Can you guide me through a ${exercise.title.toLowerCase()}? ${exercise.description}`;
    setInputValue(exerciseText);
    setShowWellnessMenu(false);
  };

  const handleQuickMessage = (message) => {
    setInputValue(message);
    setShowWellnessMenu(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{mentorName}</span>
          <span className="text-sm opacity-80">{moodEmoji}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs opacity-80">
            {currentMood?.state || 'Supportive'}
          </span>
          <span className="text-xs opacity-80">Active Now</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/70">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-lg ${
              message.isBot 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.isBot && message.moodEmoji && (
                  <span className="text-sm">{message.moodEmoji}</span>
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gray-100 text-gray-900">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm opacity-70">{mentorName} is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-start">
            <div className="max-w-[70%] px-3 py-2 rounded-lg bg-red-100 text-red-800">
              <div className="font-semibold">Error:</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Wellness Menu */}
      {showWellnessMenu && (
        <div className="px-4 py-2 bg-blue-50 border-t">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleWellnessCheckIn}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Daily Check-in
            </button>
            <button
              onClick={handleMindfulnessExercise}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            >
              Mindfulness Exercise
            </button>
            <button
              onClick={() => handleQuickMessage("I'm feeling stressed today")}
              className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
            >
              Feeling Stressed
            </button>
            <button
              onClick={() => handleQuickMessage("I need some motivation")}
              className="px-3 py-1 text-xs bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
            >
              Need Motivation
            </button>
            <button
              onClick={() => handleQuickMessage("Can you help me with my goals?")}
              className="px-3 py-1 text-xs bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
            >
              Goal Setting
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center p-2 border-t bg-white">
        <button
          onClick={() => setShowWellnessMenu(!showWellnessMenu)}
          className="mr-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
        >
          🌟 Wellness
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share how you're feeling or ask for guidance..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="ml-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;