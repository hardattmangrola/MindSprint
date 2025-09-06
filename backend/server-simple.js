import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Helper function to read JSON files
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Helper function to write JSON files
const writeJsonFile = (filename, data) => {
  try {
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Routes

// Get identity data
app.get('/api/identity', (req, res) => {
  const identity = readJsonFile('identity.json');
  if (identity) {
    res.json(identity);
  } else {
    res.status(500).json({ message: 'Failed to read identity data' });
  }
});

// Get mood data
app.get('/api/mood', (req, res) => {
  const mood = readJsonFile('mood.json');
  if (mood) {
    res.json(mood);
  } else {
    res.status(500).json({ message: 'Failed to read mood data' });
  }
});

// Update mood data
app.put('/api/mood', (req, res) => {
  const { current_mood, mood_history, emotional_temperature, contextual_flags } = req.body;
  
  const moodData = {
    current_mood: current_mood || {
      state: "neutral",
      intensity: 0.5,
      emotion_tags: ["calm"],
      cause: "User is checking in",
      created_at: new Date().toISOString()
    },
    mood_history: mood_history || [],
    emotional_temperature: emotional_temperature || {
      positive: 0.5,
      negative: 0.2,
      overall: 0.3
    },
    contextual_flags: contextual_flags || {
      student_supported: true,
      conversation_depth: "medium",
      topic_complexity: "balanced"
    }
  };

  if (writeJsonFile('mood.json', moodData)) {
    res.json({ message: 'Mood data updated successfully', data: moodData });
  } else {
    res.status(500).json({ message: 'Failed to update mood data' });
  }
});

// Get personality data
app.get('/api/personality', (req, res) => {
  const personality = readJsonFile('personality.json');
  if (personality) {
    res.json(personality);
  } else {
    res.status(500).json({ message: 'Failed to read personality data' });
  }
});

// Get objectives data
app.get('/api/objectives', (req, res) => {
  const objectives = readJsonFile('objective.json');
  if (objectives) {
    res.json(objectives);
  } else {
    res.status(500).json({ message: 'Failed to read objectives data' });
  }
});

// Get mentor details
app.get('/api/mentor', (req, res) => {
  const mentor = readJsonFile('mentor_details.json');
  if (mentor) {
    res.json(mentor);
  } else {
    res.status(500).json({ message: 'Failed to read mentor data' });
  }
});

// Get relationship data
app.get('/api/relationship', (req, res) => {
  const relationship = readJsonFile('relationship.json');
  if (relationship) {
    res.json(relationship);
  } else {
    res.status(500).json({ message: 'Failed to read relationship data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
