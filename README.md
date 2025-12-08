# Study Buddy

Study hard with your Buddy to help them grow! Study Buddy is an app/website that tracks your studying. The more you study, the more your Buddy grows. But careful! If you don't meet your goals for the week, your Buddy will become sick and eventually die.

Deployed at: https://cs673f25a2project-cs673a2f25team3-kej3.onrender.com/

---

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Running the App](#running-the-app)
- [Deployment (Render)](#deployment-render)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Setup](#docker-setup)

---

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/BUMETCS673/cs673f25a2project-cs673a2f25team3
```

2. Install Dependencies:
```bash
npm run install-all
```

3. Copy `code/Study buddy/backend/.env.example` and rename it `.env`. Replace `<YOUR_SECRET>` with an appropiate secret.

4. Copy `code/Study buddy/front/.env.example` and rename it `.env`. Replace `<YOUR_BACKEND_IP>` with the ip address of the backend.

---

## Running the App

1. Start the backend and frontend:
```bash
npm run dev
```

2. Open the app on your mobile device using the Expo Go app or an emulator or open on web.

If you wish to start the backend and frontend separately, INSTEAD run the following on the separate devices.

Backend:
```bash
cd '.\code\Study buddy\backend\'
npm start
```

Frontend:
```bash
cd '.\code\Study buddy\frontend\'
npm start
```
Note: may fail if device is not on the same wifi as the frontend.

---

## Deployment (Render)

- Live deployment: https://cs673f25a2project-cs673a2f25team3-kej3.onrender.com/
- Expect a short cold-start delay after periods of inactivity; refresh if the first request times out.

---

## Technologies

- **Frontend**: React Native with Expo  
- **Backend**: Node.js, Express  
- **Database**: SQLite  
- **Authentication**: JWT (JSON Web Token)  
- **Testing**: Jest, Supertest  
- **API Documentation**: Swagger  

---

## API Endpoints
* **User**
   * `POST /api/users/register` - Register a new user
   * `POST /api/users/login` - Login and receive a JWT token
   * ` GET /api/users/me` - Get user info (requires JWT token)
* **Profile**
   * `GET /api/profiles/me` - Get profile info for logged in user
   * `POST /api/profiles/me` - Update profile info for logged in user
* **Settings**
   * `GET /api/settings/me` - Get settings for logged in user
   * `POST /api/settings/me` - Update settings for logged in user
* **Study**
   * `POST /api/study/me` - Add a study session for logged in user
   * `GET /api/study/me` - Get all study sessions for logged in user
   * `GET /api/study/progress` - Get current study timer for logged in user
   * `PUT /api/study/progress` - Create/update current study timer for logged in user
   * `DELETE /api/study/progress` - Delete current study timer for logged in user
* **Stats**
   * `GET /api/stats/me` - Get study statistics for logged in user
* **Buddy**
   * `GET /api/buddy/me` - Get buddy data for logged in user
   * `POST /api/buddy/me` - Create a new buddy for logged in user
   * `POST /api/buddy/update` - Update the name and type of buddy for logged in user
   * `POST /api/buddy/exp` - Increase buddy exp for logged in user
   * `POST /api/buddy/status` - Change buddy status for logged in user
   * `POST /api/buddy/reset` - Delete buddy for logged in user and create new one

All routes except registration and login require **Authorization** header with a Bearer token

---

## Testing
We rely on **ESLint** for linting and **Jest/Supertest** for unit and integration tests.

- **Backend**
  ```bash
  cd '.\code\Study buddy\backend\'
  npm run lint
  npm test
  ```
- **Frontend**
  ```bash
  cd '.\code\Study buddy\frontend\'
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
