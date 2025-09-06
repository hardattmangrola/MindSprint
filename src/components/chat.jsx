import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Heart, Brain, Target, Zap } from 'lucide-react';
import { useBackend } from './backend';

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Synthia, your mental wellness mentor. I'm here to support you with daily check-ins, mindfulness exercises, and emotional guidance. How are you feeling today?",
      isBot: true,
      timestamp: new Date(),
      mood: null,
      moodEmoji: "🤗"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showWellnessMenu, setShowWellnessMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { 
    sendMessage, 
    error, 
    getWellnessCheckIn, 
    getMindfulnessExercise,
    currentMood,
    moodEmoji,
    mentorName
  } = useBackend();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(currentInput);
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
    } finally {
      setIsLoading(false);
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

  const wellnessOptions = [
    { 
      icon: Heart, 
      label: 'Daily Check-in', 
      action: handleWellnessCheckIn,
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      icon: Brain, 
      label: 'Mindfulness', 
      action: handleMindfulnessExercise,
      gradient: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Zap, 
      label: 'Feeling Stressed', 
      action: () => handleQuickMessage("I'm feeling stressed today"),
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      icon: Target, 
      label: 'Need Motivation', 
      action: () => handleQuickMessage("I need some motivation"),
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20">
      {/* Header */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg">{moodEmoji}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{mentorName}</h3>
              <p className="text-white/80 text-xs">Mental Wellness Mentor</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-2 h-2 bg-green-400 rounded-full mb-1 shadow-lg shadow-green-400/50"></div>
            <span className="text-white/90 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg ${
              message.isBot 
                ? 'bg-slate-800/80 text-slate-100 backdrop-blur-sm border border-slate-700/50' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/25'
            }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <span className="text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.isBot && message.moodEmoji && (
                  <span className="text-xs">{message.moodEmoji}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-slate-800/80 text-slate-100 backdrop-blur-sm border border-slate-700/50 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm opacity-70">{mentorName} is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-red-900/80 text-red-100 backdrop-blur-sm border border-red-700/50 shadow-lg">
              <div className="font-semibold text-sm">Connection Error</div>
              <div className="text-xs mt-1 opacity-80">{error}</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Wellness Menu */}
      {showWellnessMenu && (
        <div className="px-4 py-3 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-2">
            {wellnessOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={option.action}
                  className={`group relative px-3 py-2 rounded-xl bg-gradient-to-r ${option.gradient} text-white text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Icon size={14} />
                    <span>{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWellnessMenu(!showWellnessMenu)}
            className={`group p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              showWellnessMenu 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' 
                : 'bg-slate-700/50 hover:bg-slate-600/50'
            }`}
          >
            <Sparkles 
              size={18} 
              className={`transition-colors ${showWellnessMenu ? 'text-white' : 'text-slate-300'}`} 
            />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share how you're feeling..."
              className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-slate-100 placeholder-slate-400 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="group p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;