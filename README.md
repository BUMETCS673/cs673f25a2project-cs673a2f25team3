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
- [Docker Setup](#docker-setup)
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
   * `PUT /api/profiles/me` - Replace profile info
* **Settings**
   * `GET /api/settings/me` - Get user settings
   * `POST /api/settings/me` - Update settings
   * `PUT /api/settings/me` - Replace settings
* **Study**
   * `POST /api/study/me` - Add a study session
   * `GET /api/study/me` - Get all study sessions
   * `GET /api/study/me/latest` - Get the latest study sessions
* **Buddy**
   * `POST /api/buddy/me` - Create a buddy for the logged-in user
   * `GET /api/buddy/me` - Get the logged-in user's buddy with energy decay applied
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

## Study Buddy Project: Docker Setup & Usage

This project uses Docker Compose to run both the backend (Node.js/Express) and frontend (Expo React Native) services. The setup is designed for local development and testing, supporting both mobile (Expo Go) and web access.

### Requirements
- **Docker** and **Docker Compose** installed on your system
- **Node.js 22** is used in both backend and frontend containers

### Quick Start
1. From the project root, run:
  ```sh
  docker compose build --no-cache
  docker compose up
  ```
2. The backend will be available at [http://localhost:3000](http://localhost:3000)
3. The frontend (Expo) will:
  - Show a QR code for Expo Go (scan with your mobile device)
  - Serve the web app at [http://localhost:19006](http://localhost:19006)

### Service Ports
- **Backend (`js-backend`)**: 3000
- **Frontend (`js-frontend`)**: 8081 (Metro), 19000-19002 (Expo DevTools), 19006 (Web)

### Common Issues & Troubleshooting
- **Port Already in Use**: If you see an error about port 8081, another process is using it. Stop any other Expo/Metro servers or change the port mapping in `compose.yaml`.
- **Missing Dependencies**: If Expo reports missing modules (e.g., `expo-dev-client`, `react-dom`, `react-native-web`), ensure they are listed in `package.json` and rebuild with `docker compose build --no-cache`.
- **node_modules Issues**: Do not mount `node_modules` from your host. Let Docker install dependencies inside the container.
- **Health Check Failures**: The backend includes a `/health` endpoint for Docker health checks.

### File Locations
- **Backend Dockerfile**: `code/Study buddy/backend/Dockerfile`
- **Frontend Dockerfile**: `code/Study buddy/frontend/Dockerfile`
- **Compose file**: `compose.yaml`

### Environment Variables
- Set in `compose.yaml` for frontend: `EXPO_DEVTOOLS_LISTEN_ADDRESS`, `CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`, `HOME`, etc.
- You can add more via the `environment` section in `compose.yaml`.

### Updating Dependencies
If you add or update dependencies in `package.json`, always rebuild your containers:
```sh
docker compose build --no-cache
docker compose up
```

---

For more details, see the Dockerfiles and `compose.yaml` in the repository. If you encounter issues, check the troubleshooting section above or reach out to your team for support.

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


