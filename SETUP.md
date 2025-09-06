# MindSprint Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (optional, for Google login)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy the `.env` file and update the values:
   ```bash
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mindsprint
   
   # JWT Secret (change this in production)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-mindsprint-2024
   
   # Google OAuth Configuration (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Server Port
   PORT=5000
   
   # Vite Configuration
   VITE_API_URL=http://localhost:5000
   ```

3. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env` file

4. **Set up Google OAuth (optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000/api/auth/google` to authorized redirect URIs
   - Update `GOOGLE_CLIENT_ID` in `.env` file

## Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev:full
```

### Frontend Only
```bash
npm run dev
```

### Backend Only
```bash
npm run backend:dev
```

### Production
```bash
npm run build
npm run backend
```

## Project Structure

```
MindSprint/
├── backend/
│   └── server.js          # Express server with authentication
├── src/
│   ├── components/        # React components
│   ├── App.jsx           # Main app component
│   └── ...
├── Login.jsx             # Login/Signup page
├── package.json          # Shared dependencies
├── .env                  # Environment variables
└── SETUP.md             # This file
```

## Features

- **Authentication System:**
  - Email/Password registration and login
  - Google OAuth integration
  - JWT token-based authentication
  - Password hashing with bcrypt

- **Database:**
  - MongoDB with Mongoose ODM
  - User schema with Google OAuth support
  - Secure password storage

- **Frontend:**
  - Dark theme matching the main app
  - Responsive design
  - Form validation
  - Loading states and error handling

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/health` - Health check

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- Secure environment variable handling

## Troubleshooting

1. **MongoDB Connection Issues:**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in `.env`

2. **Google OAuth Issues:**
   - Verify `GOOGLE_CLIENT_ID` is correct
   - Check redirect URI matches exactly
   - Ensure Google+ API is enabled

3. **Port Conflicts:**
   - Frontend runs on port 5173
   - Backend runs on port 5000
   - Update ports in `.env` if needed
