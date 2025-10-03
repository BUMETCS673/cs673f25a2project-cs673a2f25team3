# Study Buddy

Study Buddy is a mobile and web application for tracking study sessions, user profiles, and settings. It is built with **React Native (Expo)** for the frontend and **Express + SQLite** for the backend.

---

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Technologies

- **Frontend**: React Native with Expo  
- **Backend**: Node.js, Express  
- **Database**: SQLite  
- **Authentication**: JWT (JSON Web Token)  
- **Testing**: Jest, Supertest  
- **API Documentation**: Swagger  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/BUMETCS673/cs673f25a2project-cs673a2f25team3
cd Study buddy
```

2. Install Dependencies for Backend:
```bash
cd backend
npm install
```

3. Install Dependencies for Frontend:
```bash
cd ../frontend
npm install
```

---

## Backend Setup

```bash
cd backend
npm start
```

The backend will run at `http://localhost:3000`. Swagger documentation is available at `http://localhost:3000/api-docs`.

---

## Running the App

1. Start the Expo project:
```bash
cd frontend
npx expo start
```

2. Open the app on your mobile device using the Expo Go app or an emulator or open on web.

---

## API Endpoints
* **User**
   * `POST /api/users/register` - Register a new user
   * `POST /api/users/login` - Login and receive a JWT token
   * ` GET /api/users/me` - Get user info (requires JWT token)
* **Profile**
   * `GET /api/profiles/me` - Get profile info
   * `POST /api/profiles/me` - Update profile info
* **Settings**
   * `GET /api/settings/me` - Get user settings
   * `POST /api/settings/me` - Update settings
* **Study**
   * `POST /api/study/me` - Add a study session
   * `GET /api/study/me` - Get all study sessions
All routes except registration and login require **Authorization** header with a Bearer token

---

## Testing
We use **Jest** and **Supertest** for backend API testing.

Run tests from the backend folder:
```bash
cd backend
npm test
```

---

## Project Structure
```bash
backend/
├─ __tests__/      # Supertest API tests
├─ routes/         # API route files
├─ models/         # Database model logic
├─ db/             # SQlite database file
├─ server.js       # Express server entry point
├─ package.json
├─ .env            # Environment variables
frontend/
├─ App.js
├─ package.json
...
```


