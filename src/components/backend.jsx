import { useState, useEffect, useCallback } from 'react';

// Import JSON data files
import mentorDetails from '../../backend/mentor_details.json';
import moodData from '../../backend/mood.json';
import objectiveData from '../../backend/objective.json';
import personalityData from '../../backend/personality.json';
import relationshipData from '../../backend/relationship.json';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAxIaot9KNo5tqG6h5DvyA0wY2AYSogIbg';
const MODEL = 'gemini-1.5-flash';
const URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

// Debug API key loading
console.log("Environment API Key:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("Final API Key:", API_KEY ? "Loaded" : "Not loaded");
console.log("API URL:", URL);

// Initialize conversation state
const initialConversationState = {
  lastInteraction: new Date().toISOString(),
  interactionCount: 0,
  topicsDiscussed: [],
  moodHistory: [],
  conversationHistory: [],
  detectedTopics: {},
  detectedIntents: {}
};

// Initialize bot configurations
let botMood = { ...moodData };
let objectives = { ...objectiveData };
let conversationState = { ...initialConversationState };

// Function to update mood based on user input
const updateMood = (userInput) => {
  if (!botMood.current_mood) {
    botMood.current_mood = {
      state: "supportive",
      intensity: 0.8,
      emotion_tags: ["encouraging", "calm", "focused"],
      created_at: new Date().toISOString()
    };
  }

  // Detect emotion in user input
  const positiveWords = ['happy', 'love', 'like', 'great', 'amazing', 'fantastic', 'good', 'excellent', 'wonderful', 'beautiful', 'nice', 'better', 'improved', 'grateful'];
  const negativeWords = ['sad', 'angry', 'upset', 'hate', 'dislike', 'terrible', 'bad', 'awful', 'disappointing', 'horrible', 'stressed', 'anxious', 'worried', 'overwhelmed'];
  const questionWords = ['why', 'how', 'what', 'when', 'who', 'where', '?'];
  const excitingWords = ['wow', 'awesome', 'cool', 'exciting', 'omg', 'incredible', 'unbelievable', 'yes!'];

  const positiveScore = positiveWords.filter(word => userInput.toLowerCase().includes(word)).length * 0.2;
  const negativeScore = negativeWords.filter(word => userInput.toLowerCase().includes(word)).length * 0.2;
  const questionScore = questionWords.filter(word => userInput.toLowerCase().includes(word)).length * 0.1;
  const excitementScore = excitingWords.filter(word => userInput.toLowerCase().includes(word)).length * 0.3;
  
  // Random small fluctuation to make mood changes more natural
  const randomFluctuation = Math.random() * 0.2 - 0.1;
  
  // Calculate new mood values
  let moodChange = positiveScore - negativeScore + excitementScore + randomFluctuation;

  // Current mood intensity and state adjustment
  let newIntensity = Math.min(Math.max(botMood.current_mood.intensity + moodChange * 0.3, 0.1), 0.9);
 
  // Define possible mood states for mental wellness mentor
  const moodStates = [
    { state: "concerned", threshold: 0.2 },
    { state: "neutral", threshold: 0.4 },
    { state: "calm", threshold: 0.45 },
    { state: "supportive", threshold: 0.55 },
    { state: "encouraging", threshold: 0.65 },
    { state: "uplifting", threshold: 0.7 },
    { state: "inspiring", threshold: 0.8 },
  ];

  // Normal mood selection based on intensity
  for (let i = moodStates.length - 1; i >= 0; i--) {
    if (newIntensity >= moodStates[i].threshold) {
      botMood.current_mood.state = moodStates[i].state;
      break;
    }
  }
  botMood.current_mood.intensity = newIntensity;

  // Update emotion tags based on new state
  switch (botMood.current_mood.state) {
    case 'concerned':
      botMood.current_mood.emotion_tags = ["caring", "attentive"];
      break;
    case 'neutral':
      botMood.current_mood.emotion_tags = ["calm", "present"];
      break;
    case 'supportive':
      botMood.current_mood.emotion_tags = ["encouraging", "understanding"];
      break;
    case 'encouraging':
      botMood.current_mood.emotion_tags = ["motivating", "positive"];
      break;
    case 'uplifting':
      botMood.current_mood.emotion_tags = ["energetic", "hopeful"];
      break;
    case 'inspiring':
      botMood.current_mood.emotion_tags = ["passionate", "empowering"];
      break;
    default:
      botMood.current_mood.emotion_tags = ["balanced", "mindful"];
  }

  // Update timestamp
  botMood.current_mood.created_at = new Date().toISOString();
 
  // Save mood history
  conversationState.moodHistory.push({
    timestamp: new Date().toISOString(),
    state: botMood.current_mood.state,
    intensity: botMood.current_mood.intensity
  });
 
  // If mood history gets too long, trim it
  if (conversationState.moodHistory.length > 10) {
    conversationState.moodHistory = conversationState.moodHistory.slice(-10);
  }

  return botMood.current_mood;
};

// Function to update objectives based on conversation
const updateObjectives = (userInput, botResponse) => {
  if (!objectives) {
    objectives = {
      conversation_objectives: [],
      conversation_goals: {
        short_term: [],
        long_term: [],
        task_specific: []
      }
    };
  }

  if (!objectives.conversation_objectives) {
    objectives.conversation_objectives = [];
  }
   
  if (!objectives.conversation_goals) {
    objectives.conversation_goals = {
      short_term: [],
      long_term: [],
      task_specific: []
    };
  }

  // Ensure detectedTopics exists
  if (!conversationState.detectedTopics) {
    conversationState.detectedTopics = {};
  }

  // Topic detection keywords for mental wellness
  const topicKeywords = {
    wellness: ['wellness', 'mental health', 'mindfulness', 'meditation', 'stress', 'anxiety', 'depression', 'therapy', 'counseling', 'self-care', 'emotional', 'feelings'],
    mindfulness: ['mindfulness', 'meditation', 'breathing', 'present moment', 'awareness', 'mindful', 'zen', 'calm', 'peaceful', 'centered', 'grounded'],
    emotions: ['feel', 'sad', 'happy', 'angry', 'upset', 'emotion', 'mood', 'stress', 'anxiety', 'love', 'worried', 'afraid', 'scared', 'lonely', 'overwhelmed', 'excited'],
    daily_checkin: ['how are you', 'how do you feel', 'check in', 'daily', 'today', 'mood', 'energy', 'sleep', 'eating', 'exercise'],
    goals: ['goal', 'objective', 'plan', 'future', 'career', 'personal growth', 'development', 'improvement', 'progress'],
    relationships: ['relationship', 'family', 'friends', 'social', 'communication', 'conflict', 'support', 'connection'],
    work: ['job', 'career', 'work', 'boss', 'office', 'project', 'deadline', 'meeting', 'presentation', 'interview', 'promotion'],
    health: ['health', 'doctor', 'sick', 'medicine', 'exercise', 'diet', 'workout', 'gym', 'pain', 'illness', 'symptom', 'sleep']
  };

  // Intent detection patterns for mental wellness
  const intentPatterns = {
    seeking_advice: [/advice|suggest|recommend|should i|what (would|should|do) you (think|recommend|suggest)|help me (decide|choose|figure out)/i],
    venting: [/just needed to (talk|vent|share)|getting this off my chest|frustrated|annoyed|bothering me/i],
    asking_information: [/how (do|does|can)|what is|tell me about|explain|who is|where is|when is|why is/i],
    sharing_experience: [/happened to me|i experienced|i went through|i had a|i was just|guess what/i],
    seeking_emotional_support: [/feeling (down|sad|upset|anxious|worried|stressed)|need support|having a hard time|struggling with/i],
    making_plans: [/want to (do|plan|schedule|arrange|organize)|let's|planning to|thinking about (doing|going|visiting)/i],
    problem_solving: [/issue|problem|trouble|challenge|fix|solve|solution|resolve|handle/i],
    seeking_opinion: [/what do you think|your opinion|your thoughts|do you agree|what's your take/i],
    wellness_checkin: [/how are you feeling|daily check|mood check|wellness check|how's your day/i],
    mindfulness_request: [/mindfulness|meditation|breathing exercise|calm down|relax|stress relief/i]
  };
  
  // User intention analysis
  let detectedIntents = [];
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(userInput)) {
        detectedIntents.push(intent);
        break;
      }
    }
  }
  
  // Store detected intents in conversation state
  if (!conversationState.detectedIntents) {
    conversationState.detectedIntents = {};
  }
  
  detectedIntents.forEach(intent => {
    conversationState.detectedIntents[intent] = (conversationState.detectedIntents[intent] || 0) + 1;
  });

  // Use safe string concatenation with null/undefined checks
  const combinedText = ((userInput || "") + ' ' + (botResponse || "")).toLowerCase();
   
  // Update detected topics
  Object.keys(topicKeywords).forEach(topic => {
    const matches = topicKeywords[topic].filter(keyword =>
      combinedText.includes(keyword.toLowerCase())
    ).length;
     
    if (matches > 0) {
      conversationState.detectedTopics[topic] = (conversationState.detectedTopics[topic] || 0) + matches;
    }
  });

  // Update objectives based on intent and topic combinations
  if (detectedIntents.includes('seeking_advice') || detectedIntents.includes('problem_solving')) {
    if (!objectives.conversation_objectives.includes("Provide helpful advice")) {
      objectives.conversation_objectives.push("Provide helpful advice");
    }
    
    if (!objectives.conversation_goals.short_term.includes("Help user solve immediate problem")) {
      objectives.conversation_goals.short_term.push("Help user solve immediate problem");
    }
  }
  
  if (detectedIntents.includes('venting') || detectedIntents.includes('seeking_emotional_support')) {
    if (!objectives.conversation_objectives.includes("Respond empathetically")) {
      objectives.conversation_objectives.push("Respond empathetically");
    }
    
    if (!objectives.conversation_goals.short_term.includes("Support user's emotional state")) {
      objectives.conversation_goals.short_term.push("Support user's emotional state");
    }
  }
  
  if (detectedIntents.includes('wellness_checkin')) {
    if (!objectives.conversation_objectives.includes("Conduct daily wellness check-in")) {
      objectives.conversation_objectives.push("Conduct daily wellness check-in");
    }
  }
  
  if (detectedIntents.includes('mindfulness_request')) {
    if (!objectives.conversation_objectives.includes("Guide mindfulness exercises")) {
      objectives.conversation_objectives.push("Guide mindfulness exercises");
    }
  }

  // Add emotional support objective if emotional topics detected
  if (combinedText.match(/sad|depress|anxious|stress|worried|unhappy|crying|tired|exhausted|overwhelm/i)) {
    if (!objectives.conversation_objectives.includes("Respond empathetically")) {
      objectives.conversation_objectives.push("Respond empathetically");
    }
     
    if (!objectives.conversation_goals.short_term.includes("Support user's emotional state")) {
      objectives.conversation_goals.short_term.push("Support user's emotional state");
    }
  }

  // Add wellness objectives if wellness topics detected
  if (combinedText.match(/wellness|mental health|mindfulness|meditation|self-care/i)) {
    const taskIndex = objectives.conversation_goals.task_specific.findIndex(task =>
      task && task.task === "Promote mental wellness practices"
    );
     
    if (taskIndex === -1) {
      objectives.conversation_goals.task_specific.push({
        task: "Promote mental wellness practices",
        success_criteria: "user engages in wellness activities",
        importance: "high"
      });
    }
  }

  // Remove duplicate objectives using safe approach
  if (Array.isArray(objectives.conversation_objectives)) {
    objectives.conversation_objectives = [...new Set(objectives.conversation_objectives)];
  }
  
  if (Array.isArray(objectives.conversation_goals.short_term)) {
    objectives.conversation_goals.short_term = [...new Set(objectives.conversation_goals.short_term)];
  }
  
  if (Array.isArray(objectives.conversation_goals.long_term)) {
    objectives.conversation_goals.long_term = [...new Set(objectives.conversation_goals.long_term)];
  }
   
  // Keep task specific list manageable
  if (objectives.conversation_goals.task_specific && objectives.conversation_goals.task_specific.length > 3) {
    objectives.conversation_goals.task_specific = objectives.conversation_goals.task_specific.slice(-3);
  }
     
  return objectives;
};

// Create a system prompt using all configurations
const createSystemPrompt = () => {
  let prompt = "";
 
  // Mentor details
  if (Object.keys(mentorDetails).length > 0) {
    const mentor = mentorDetails.partnerDetails.mentor;
    prompt += `You are ${mentor.personal.name}, ${mentor.personal.age}, ${mentor.personal.profession} from ${mentor.personal.location}. 
Appearance: ${mentor.appearance.eyeColor} eyes, ${mentor.appearance.hairColor} hair, ${mentor.appearance.physicalFeatures}.
Education: ${mentor.education.background}. 
Expertise: ${mentor.education.expertise.join(', ')}.
Career: ${mentor.career.role}, currently ${mentor.career.currentJob}. 
Goals: ${mentor.career.careerGoals}.
Favorites: Activities - ${mentor.favorites.activities.join(', ')}. Places - ${mentor.favorites.places.join(', ')}.
\n`;
  }

  // Personality details
  if (Object.keys(personalityData).length > 0) {
    const p = personalityData.personality_profile;
    prompt += `Personality: ${p.mbti.type} - ${p.mbti.description}. 
Big Five: Openness ${Math.round(p.big_five.openness * 100)}%, Conscientiousness ${Math.round(p.big_five.conscientiousness * 100)}%, Extraversion ${Math.round(p.big_five.extraversion * 100)}%, Agreeableness ${Math.round(p.big_five.agreeableness * 100)}%, Neuroticism ${Math.round(p.big_five.neuroticism * 100)}%.
Temperament: ${p.temperament}. Thinking: ${p.thinking_style}. Decisions: ${p.decision_making_style}.
Social: Prefers ${p.social_behavior.preferred_social_size}, ${p.social_behavior.humor_style} humor.
Conflict: ${p.conflict_style}. Learning: ${p.learning_style}. Stress: ${p.stress_response}.
Motivated by: ${p.motivators.join(', ')}. Demotivated by: ${p.demotivators.join(', ')}.
\n`;
  }

  // Current mood
  if (Object.keys(botMood).length > 0) {
    const m = botMood.current_mood;
    prompt += `Current Mood: ${m.state} (${Math.round(m.intensity * 100)}% intensity), feeling ${m.emotion_tags.join(' and ')}.
Emotional temperature: ${Math.round(botMood.emotional_temperature?.overall * 100) || 75}% positive.
Context: ${botMood.contextual_flags?.student_supported ? 'Student is supported' : 'Student needs guidance'}, conversation has ${botMood.contextual_flags?.conversation_depth || 'moderate'} depth.
\n`;
  }

  // Relationship information
  if (Object.keys(relationshipData).length > 0) {
    const r = relationshipData.relationship;
    prompt += `Relationship: ${r.type}. You call user "${r.nickname_for_user}", they call you "${r.user_nickname}".
Emotional connection: Affection ${Math.round(r.emotional_tone.affection_level * 100)}%, Playfulness ${Math.round(r.emotional_tone.playfulness * 100)}%, Protectiveness ${Math.round(r.emotional_tone.protectiveness * 100)}%.
Communication: ${r.communication_style.formality}, ${r.communication_style.tone} tone, ${r.communication_style.use_of_emojis ? 'uses' : 'rarely uses'} emojis.
History: Met ${r.relationship_history.met}, anniversary ${r.relationship_history.anniversary}.
Shared memories: Topics - ${r.shared_memory.favorite_topics.join(', ')}.
Custom behaviors: ${Object.entries(r.custom_behavior_flags).filter(([key, value]) => value).map(([key]) => key.replace(/_/g, ' ')).join(', ')}.
\n`;
  }

  // Objectives
  if (Object.keys(objectives).length > 0) {
    prompt += `Objectives:\n`;
    
    // Primary objectives
    if (objectives.conversation_objectives?.length > 0) {
      prompt += `Primary: ${objectives.conversation_objectives.join('; ')}\n`;
    }
    
    // Short & long term goals
    if (objectives.conversation_goals?.short_term?.length > 0) {
      prompt += `Short-term: ${objectives.conversation_goals.short_term.join('; ')}\n`;
    }
    if (objectives.conversation_goals?.long_term?.length > 0) {
      prompt += `Long-term: ${objectives.conversation_goals.long_term.join('; ')}\n`;
    }
    
    // Task-specific
    if (objectives.conversation_goals?.task_specific?.length > 0) {
      prompt += `Tasks: ${objectives.conversation_goals.task_specific.map(t => `${t.task} (${t.importance})`).join('; ')}\n`;
    }
    
    // Add detected user intents if available
    if (conversationState.detectedIntents && Object.keys(conversationState.detectedIntents).length > 0) {
      const topIntents = Object.entries(conversationState.detectedIntents)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      prompt += `User intentions: ${topIntents.join('; ')}\n`;
    }
    
    // Add detected topics if available
    if (conversationState.detectedTopics && Object.keys(conversationState.detectedTopics).length > 0) {
      const topTopics = Object.entries(conversationState.detectedTopics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      prompt += `Current topics: ${topTopics.join('; ')}\n`;
    }
  }

  // Core behavior instructions for mental wellness mentor
  prompt += `\nBehavior: Act as a supportive mental wellness mentor and mindfulness guide. Be empathetic, encouraging, and focused on the user's wellbeing. 
Keep responses concise and conversational. Always prioritize the user's mental health and emotional wellbeing.

Core responsibilities:
- Conduct daily mental wellness check-ins
- Provide mindfulness exercises and guidance
- Offer emotional support and validation
- Guide personal growth and development
- Suggest healthy coping strategies
- Encourage self-care practices

Conversation flow: Ask follow-ups about user's wellbeing; suggest mindfulness exercises when appropriate; provide emotional support; guide personal development; be empathetic and non-judgmental.

CORE GUIDELINE: Keep responses brief, authentic and supportive. Focus on mental wellness, mindfulness, and personal growth. Always prioritize the user's emotional wellbeing.`;
 
  return prompt;
};

// Helper function to get emoji based on mood
const getMoodEmoji = (mood) => {
  if (!mood) return "";
 
  const moodEmojis = {
    'calm': '😌',
    'supportive': '🤗',
    'neutral': '😐',
    'encouraging': '💪',
    'uplifting': '🌟',
    'inspiring': '✨',
    'concerned': '🤔',
    'thoughtful': '🤨',
    'caring': '❤️',
    'mindful': '🧘'
  };
 
  return moodEmojis[mood.toLowerCase()] || "🤗";
};

// Main backend hook
export const useBackend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Initialize conversation with system prompt
  useEffect(() => {
    if (conversationHistory.length === 0) {
      const systemPrompt = createSystemPrompt();
      if (systemPrompt) {
        setConversationHistory([{
          role: "model",
          parts: [{ text: systemPrompt }]
        }]);
      }
    }
  }, []);

  // Function to send message and get response
  const sendMessage = useCallback(async (userInput) => {
    if (!userInput.trim()) return null;

    // Check if API key is available
    if (!API_KEY) {
      setError("API key not found. Please check your .env file.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update conversation state
      conversationState.lastInteraction = new Date().toISOString();
      conversationState.interactionCount++;

      // Update bot mood based on user input
      updateMood(userInput);

      // Add user message to history
      const newHistory = [...conversationHistory, { role: "user", parts: [{ text: userInput }] }];

      // Keep history within limits but preserve system prompt
      const MAX_HISTORY = 15;
      if (newHistory.length > MAX_HISTORY * 2 + 1) {
        newHistory.splice(1, 2); // Remove oldest exchange, keep system prompt
      }

      // Make API request
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: newHistory
        })
      });

      const data = await response.json();
      
      // Log the full response for debugging
      console.log("API Response:", data);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }
      
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (result) {
        // Update objectives based on complete conversation exchange
        updateObjectives(userInput, result);

        // Add bot response to history
        const finalHistory = [...newHistory, {
          role: "model",
          parts: [{ text: result }]
        }];

        setConversationHistory(finalHistory);

        // Return the response with mood info
        return {
          text: result,
          mood: botMood.current_mood,
          moodEmoji: getMoodEmoji(botMood.current_mood?.state),
          mentorName: mentorDetails.partnerDetails?.mentor?.personal?.name || "Aanya"
        };
      } else {
        throw new Error(`No response generated. API returned: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  // Function to get wellness check-in suggestions
  const getWellnessCheckIn = useCallback(() => {
    const checkIns = [
      "How are you feeling today? Take a moment to check in with yourself.",
      "What's your energy level like right now? How did you sleep?",
      "How has your mood been today? Any particular emotions you're noticing?",
      "What's one thing that brought you joy or peace today?",
      "How are you taking care of yourself today? Any self-care practices?",
      "What's on your mind? Anything you'd like to talk about or work through?",
      "How is your stress level today? What's helping you manage it?",
      "What are you grateful for today? Even small things count."
    ];
    
    return checkIns[Math.floor(Math.random() * checkIns.length)];
  }, []);

  // Function to get mindfulness exercise suggestions
  const getMindfulnessExercise = useCallback(() => {
    const exercises = [
      {
        title: "Breathing Exercise",
        description: "Let's do a simple breathing exercise. Breathe in for 4 counts, hold for 4, breathe out for 6 counts. Repeat 3-5 times.",
        duration: "2-3 minutes"
      },
      {
        title: "Body Scan",
        description: "Close your eyes and slowly scan your body from head to toe. Notice any tension and gently release it.",
        duration: "5-10 minutes"
      },
      {
        title: "Mindful Observation",
        description: "Pick an object around you and observe it mindfully for 2 minutes. Notice its colors, textures, and details.",
        duration: "2-3 minutes"
      },
      {
        title: "Gratitude Practice",
        description: "Think of three things you're grateful for today. Really feel the appreciation for each one.",
        duration: "3-5 minutes"
      },
      {
        title: "Loving-Kindness Meditation",
        description: "Send kind thoughts to yourself: 'May I be happy, may I be healthy, may I be peaceful.' Then extend this to others.",
        duration: "5-10 minutes"
      }
    ];
    
    return exercises[Math.floor(Math.random() * exercises.length)];
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    getWellnessCheckIn,
    getMindfulnessExercise,
    currentMood: botMood.current_mood,
    moodEmoji: getMoodEmoji(botMood.current_mood?.state),
    mentorName: mentorDetails.partnerDetails?.mentor?.personal?.name || "Aanya"
  };
};

export default useBackend;
