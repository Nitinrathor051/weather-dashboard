# Weather Dashboard

## Live Demo

Frontend: https://weather-dashboard-rose-zeta.vercel.app/
Backend: https://weather-backend-xez1.onrender.com/
GitHub: https://github.com/Nitinrathor051/weather-dashboard

---

## Project Overview

This is a full-stack multi-user weather dashboard application where users can:

- Register and login securely
- Add and manage multiple cities
- View real-time weather data
- Mark cities as favorites
- Get AI-based weather suggestions

Each user has a personalized dashboard with strict data isolation.

---

## Tech Stack

Frontend: React.js (Vite), Axios, CSS  
Backend: Node.js, Express.js  
Database: MongoDB (Mongoose)  
APIs: OpenWeather API, Groq AI API  

---

## Justification

React (Vite) + CSS was chosen instead of Next.js + Tailwind because:

- Faster setup and development
- Simpler architecture
- Better control over frontend logic
- Focus on backend + AI integration

---

## Trade-offs

- No SSR (Server Side Rendering)
- Less SEO optimization
- Manual CSS instead of Tailwind

---

## Features

Authentication
- User registration
- User login
- JWT authentication
- Protected routes
- Password hashing with bcrypt

Weather Dashboard
- Add multiple cities
- Real-time weather data
- Delete cities
- Favorite cities feature
- User-specific data isolation

AI Features
- Weather-based AI suggestions
- Smart recommendations
- Natural language responses

---

## Setup Instructions

### Clone Repository
git clone https://github.com/Nitinrathor051/weather-dashboard.git

---

### Backend Setup

cd server
npm install

Create .env file:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
WEATHER_API_KEY=your_weather_api_key
GROQ_API_KEY=your_groq_api_key

Run backend:
npm start

---

### Frontend Setup

cd client
npm install
npm run dev

---

## Architecture

Frontend → REST API → Backend → MongoDB  
Weather API → Backend → Frontend  
AI API → Backend → Frontend  

Structure:
- Routes → API endpoints
- Controllers → logic handling
- Models → database schema
- Middleware → authentication
- Services → external API calls

---

## Authentication

- JWT-based authentication
- Protected routes using middleware
- User-specific data using userId
- Secure password hashing with bcrypt

---

## AI Agent

Input:
- User query
- Weather data

Output:
- Suggestions (go out or not)
- Clothing recommendations
- Weather advice

Purpose:
Convert raw weather data into useful insights.

---

## Custom Feature

City validation system:
- Prevent duplicate cities
- Block invalid city names
- Show proper error messages

---

## Limitations

- No caching system
- No rate limiting
- Basic UI design
- AI depends on external API
- Free hosting cold start delay

---

## Deployment

Frontend deployed on Vercel  
Backend deployed on Render  

---

## Author

Nitin Rathor
