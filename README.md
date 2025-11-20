# Study Buddy

Study Buddy is a mobile and web application for tracking study sessions, user profiles, and settings. It is built with **React Native (Expo)** for the frontend and **Express + SQLite** for the backend.

---

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
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

## Frontend Setup

Create `code/Study buddy/frontend/.env` with the API base URL.

- Docker-based dev (phone and web):
  - `API_BASE_URL=http://<YOUR_LAN_IP>:3000/api` (example: `http://192.168.99.27:3000/api`)
  - Your phone must be on the same Wi‑Fi and able to reach your PC on port 3000.
- Non‑Docker local dev (both services on host):
  - `API_BASE_URL=http://127.0.0.1:3000/api`

Note: The app reads this file at bundle time via `react-native-dotenv` (importing from `@env`). If you change it, restart Expo with cache clear.

---

## Running the App

1. Start the Expo project:
```bash
cd frontend
npx expo start
```

2. Open the app on your mobile device using the Expo Go app or an emulator or open on web.

Another easier way to install all the dependencies in frontend and backend in the root directory and then run the frontend and the backend is:
```bash
npm run install-all
npm run dev
```

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
* **Stats**
   * `GET /api/stats/me` - Get study statistics for logged in user

All routes except registration and login require **Authorization** header with a Bearer token

---

## Testing
We rely on **ESLint** for linting and **Jest/Supertest** for unit and integration tests.

- **Backend**
  ```bash
  cd backend
  npm run lint
  npm test
  ```
- **Frontend**
  ```bash
  cd frontend
  npm run lint
  npm test -- --watchAll=false
  ```

To mirror the CI workflow inside containers:
```bash
docker compose build
docker compose run --rm -w /app studybuddy-backend:ci npm test
docker compose run --rm -w /app -e CI=true studybuddy-frontend:ci npm test
```

Lint warnings are acceptable during development, but lint errors (e.g. `no-undef`) should be resolved before merging.

---

## Continuous Integration

GitHub Actions runs on every push/PR that touches backend/frontend code:

1. **Frontend job** – `npm ci`, lint (`npm run lint`), unit tests (`npm test`).
2. **Backend job** – `npm ci`, lint (`npm run lint`), unit/integration tests (`npm test`).
3. **Docker job** – builds both images and reruns the same Jest suites inside the containers to ensure the shipped images work.

Address failing lint/test steps before merging. Dependabot alerts (see the repository’s *Security → Dependabot* tab) should also be resolved promptly.

---

## Study Buddy Project: Docker Setup & Usage

This project uses Docker Compose to run both the backend (Node.js/Express) and frontend (Expo React Native) services. The setup is designed for local development and testing, supporting both mobile (Expo Go) and web access.

### Requirements
- **Docker** and **Docker Compose** installed on your system
- **Node.js 22** is used in both backend and frontend containers

### Quick Start
1) Ensure Docker Desktop is running.

2) Frontend `.env` set for LAN access (see Frontend Setup above).

3) Build services from the repo root (where `compose.yaml` is):
   ```sh
   docker compose build
   ```

4) Start backend in background and Expo interactively (recommended for mobile):
   - Backend: `docker compose up -d js-backend`
   - Frontend (Tunnel):
     ```sh
     docker compose run --rm --service-ports js-frontend \
       bash -lc "exec npx expo start --host tunnel --clear"
     ```
     Tunnel avoids LAN/firewall issues on Windows. Open DevTools at `http://localhost:19002` and scan the QR with Expo Go.

   - Frontend (LAN) alternative (open ports 19000/19001/19002/19006/8081 on Windows firewall first):
     ```sh
     docker compose run --rm --service-ports js-frontend \
       bash -lc "exec npx expo start --host lan --clear"
     ```

5) Web version is available via Expo DevTools ("Run in web") or directly on `http://localhost:19006` if enabled.

### Service Ports
- **Backend (`js-backend`)**: 3000
- **Frontend (`js-frontend`)**: 8081 (Metro), 19000-19002 (Expo DevTools), 19006 (Web)

### Common Issues & Troubleshooting
- **Port Already in Use**: If 8081 is busy, stop other Expo/Metro servers or change port mapping in `compose.yaml`.
- **Missing Dependencies**: If Expo reports missing modules (e.g., `expo-dev-client`, `react-dom`, `react-native-web`), ensure they are listed in `package.json` and rebuild with `docker compose build --no-cache`.
- **node_modules Issues**: Do not mount `node_modules` from your host. Let Docker install dependencies inside the container.
- **Frontend can’t reach API on phone**: Use your LAN IP in `.env` and keep Expo on Tunnel or open the firewall ports for LAN. Verify from phone browser: `http://<YOUR_LAN_IP>:3000/api-docs`.
- **Stale API_BASE_URL in app**: Clear Metro cache and ensure container sees your `.env`.
  - Restart: `docker compose rm -sf js-frontend`
  - Run: `docker compose run --rm --service-ports js-frontend bash -lc "cat /app/.env && exec npx expo start --host tunnel --clear"`
  - Expect `API_BASE_URL=http://<YOUR_LAN_IP>:3000/api` echoed.
- **JWT secret required**: Backend needs `JWT_SECRET`. It’s set in `compose.yaml`. Check inside container: `docker compose exec js-backend bash -lc "echo $JWT_SECRET"`.

### File Locations
- **Backend Dockerfile**: `code/Study buddy/backend/Dockerfile`
- **Frontend Dockerfile**: `code/Study buddy/frontend/Dockerfile`
- **Compose file**: `compose.yaml`

### Environment Variables
- Backend env (in `compose.yaml`): `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`.
- Frontend reads `.env` mounted at `/app/.env` (see `compose.yaml` volume for `js-frontend`).
- Expo/Metro settings (in `compose.yaml`): `EXPO_DEVTOOLS_LISTEN_ADDRESS`, `CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`, `TERM`, etc.

Diagnostic logs
- The login form logs helpful messages during auth to aid debugging:
  - `[LoginForm] API_BASE_URL: ...`
  - `[LoginForm] Auth endpoint: ...`
  - `[LoginForm] Auth status: ...`
  These logs are intentional for development and can be removed later.

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
cs673f25a2project-cs673a2f25team3/
├── code/
│   └── Study buddy/
│       ├── backend/
│       │   ├── __tests__/
│       │   │   ├── unit/
│       │   │   │   ├── auth.test.js
│       │   │   │   ├── logger.test.js
│       │   │   ├── acceptance.test.js
│       │   │   ├── api.test.js
│       │   │   ├── energyDecay.test.js
│       │   ├── db/
│       │   │   ├── database.sqlite
│       │   │   ├── db.js
│       │   ├── middleware/
│       │   │   ├── auth.js
│       │   │   ├── logger.js
│       │   ├── models/
│       │   │   ├── buddyModel.js
│       │   │   ├── profileModel.js
│       │   │   ├── settingsModel.js
│       │   │   ├── studyModel.js
│       │   │   ├── userModel.js
│       │   ├── routes/
│       │   │   ├── buddyRoutes.js
│       │   │   ├── profileRoutes.js
│       │   │   ├── settingsRoutes.js
│       │   │   ├── studyRoutes.js
│       │   │   ├── userRoutes.js
│       │   ├── .gitignore
│       │   ├── Dockerfile
│       │   ├── eslint.config.js
│       │   ├── jest.config.js
│       │   ├── jest.setup.js
│       │   ├── package.json
│       │   ├── server.js
│       │
│       └── frontend/
│           ├── .expo/
│           ├── .npm/
│           ├── __tests__/
│           │   ├── smoke.test.js
│           ├── assets/
│           │   ├── images/
│           │   │   ├── Terrier.png
│           │   │   ├── adaptive-icon.png
│           │   │   ├── favicon.png
│           │   │   ├── icon.png
│           │   │   ├── splash-icon.png
│           │   ├── sounds/
│           │   │   ├── Click sound.mp3
│           ├── components/
│           │   ├── Background.js
│           │   ├── Checkbox.js
│           │   ├── NavigationButton.js
│           ├── screens/
│           │   ├── GameMenu.js
│           │   ├── Home.js
│           │   ├── Login.js
│           │   ├── SelectStudyTime.js
│           │   ├── Settings.js
│           │   ├── Statistics.js
│           │   ├── Studying.js
│           ├── styles/
│           │   ├── base.js
│           │   ├── style.js
│           │   ├── styles.css
│           ├── util/
│           │   ├── formatString.js
│           ├── .dockerignore
│           ├── App.js
│           ├── Dockerfile
│           ├── app.json
│           ├── babel.config.js
│           ├── eslint.config.js
│           ├── index.js
│           ├── package-lock.json
│           ├── package.json
│
├── demo/
│   ├── CS673_iteration1_demo_team3.mp4
├── doc/
│   ├── CS673_MeetingMinutes_team3.docx
│   ├── CS673_presentation1_team3.pptx
│   ├── CS673_ProgressReport_team3.xlsx
│   ├── CS673_SDD_team3.docx
│   ├── CS673_SPPP_RiskManagement.xlsx
│   ├── CS673_SPPP_team3.docx
│   ├── CS673_STD_team3.docx
├── misc/
│   ├── .gitkeep
├── tests/
│   ├── .gitkeep
├── .dockerignore
├── .gitignore
├── README.md
├── compose.yaml
├── package.json
├── team.md
...
```


