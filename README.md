# MindSprint - AI-Powered Wellness Tracking Platform

MindSprint is a comprehensive wellness tracking application that combines AI-powered chat assistance with detailed mood, energy, stress, and wellness monitoring. Built with React, Node.js, and MongoDB, it provides users with personalized insights and data-driven wellness reports.

## Project Overview

MindSprint is designed to help users track their daily wellness metrics, engage with AI-powered mental health assistance, and generate comprehensive reports for better self-awareness and wellness management.
## Project Demo
https://www.loom.com/share/17497cae5c9943e59b2455a951ec2c0f?sid=4935b816-a64b-4e13-b853-f21a8bc759c4
### Core Features

- **Daily Wellness Tracking**: Comprehensive mood, energy, stress, and wellness scoring system
- **AI Chat Assistant**: Powered by Google Gemini API for personalized mental health support
- **Interactive Calendar**: Visual representation of wellness data with mood indicators
- **PDF Report Generation**: Detailed monthly wellness reports with statistics and insights
- **User Authentication**: Secure MongoDB-based authentication system
- **Responsive Design**: Mobile-first design with modern UI/UX

### Technology Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Spline for 3D interactive backgrounds
- React Icons for UI elements

**Backend:**
- Node.js with Express.js
- MongoDB for data storage
- JWT for authentication
- Bcrypt for password hashing

**AI Integration:**
- Google Gemini API for chat responses
- Dynamic system prompts based on user mood and context

## Project Structure

```
MindSprint/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── chat.jsx            # AI chat interface
│   │   ├── wellness.jsx        # Wellness tracking page
│   │   ├── mindfullness.jsx    # Mindfulness activities
│   │   ├── Profile.jsx         # User profile and statistics
│   │   ├── TrackingForm.jsx    # Daily wellness form
│   │   ├── CalendarWidget.jsx  # Calendar visualization
│   │   └── backend.jsx         # AI chat backend logic
│   ├── App.jsx                 # Main application component
│   ├── Login.jsx               # Authentication component
│   └── main.jsx                # Application entry point
├── backend/
│   └── server.js               # Express server and API endpoints
├── public/                     # Static assets
└── package.json                # Dependencies and scripts
```

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mindsprint
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mindsprint

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# API Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# AI Integration
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindSprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually
   npm run dev          # Frontend only
   npm run backend:dev  # Backend only
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage Guide

### User Registration and Authentication

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your personalized dashboard
3. **Profile Management**: Update personal information and view statistics

### Daily Wellness Tracking

1. **Navigate to Wellness**: Click on the Wellness section
2. **Track Daily Data**: Click "Track Daily Wellness" button
3. **Fill the Form**:
   - Select your mood (Very Happy to Very Sad)
   - Rate energy level (1-10)
   - Rate stress level (1-10)
   - Rate overall wellness (1-10)
   - Select daily activities
   - Add sleep hours and notes
4. **Save Data**: Click "Save Data" to store your information

### AI Chat Assistant

1. **Access Chat**: Click the floating chat button or AI Chat in navigation
2. **Start Conversation**: Ask questions about mental health, wellness, or general support
3. **Personalized Responses**: AI adapts responses based on your mood and context
4. **Close Chat**: Use the close button to minimize the chat interface

### Calendar and Reports

1. **View Calendar**: Go to Profile > Calendar tab
2. **Navigate Months**: Use arrow buttons to browse different months
3. **View Details**: Click on any tracked day to see detailed information
4. **Generate Reports**: Click "PDF Report" to create monthly wellness reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Wellness Tracking
- `POST /api/tracking/submit` - Submit daily tracking data
- `GET /api/tracking/data` - Get tracking data for date range
- `GET /api/tracking/calendar` - Get calendar data (last 30 days)
- `GET /api/tracking/statistics` - Get comprehensive statistics
- `POST /api/tracking/dummy-data` - Add test data for development

### Health Check
- `GET /api/health` - Server status check

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### User Tracking Schema
```javascript
{
  userId: ObjectId,
  date: Date,
  mood: String (enum: very_happy, happy, neutral, sad, very_sad),
  moodScore: Number (1-10),
  energy: Number (1-10),
  stress: Number (1-10),
  wellness: Number (1-10),
  notes: String,
  activities: [String],
  sleepHours: Number,
  createdAt: Date
}
```

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend server
- `npm run backend:dev` - Start backend with nodemon
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build for production

### Code Structure

The application follows a component-based architecture with clear separation of concerns:

- **Components**: Reusable UI components with props-based communication
- **Backend**: RESTful API with Express.js and MongoDB
- **State Management**: React hooks for local state management
- **Styling**: Tailwind CSS with custom components

### Testing

For testing the application:

1. **Add Test Data**: Use the "Add Test Data" button in Profile > Settings
2. **Test Tracking**: Submit wellness data for different dates
3. **Test Reports**: Generate PDF reports with sample data
4. **Test Chat**: Interact with the AI assistant

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication system
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data stored in environment variables

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Efficient Queries**: Optimized MongoDB queries with proper indexing
- **Caching**: Browser caching for static assets
- **Responsive Design**: Mobile-first approach for optimal performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the documentation or create an issue in the repository.
