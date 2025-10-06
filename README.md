
# Study Buddy Project: Docker Setup & Usage

This project uses Docker Compose to run both the backend (Node.js/Express) and frontend (Expo React Native) services. The setup is designed for local development and testing, supporting both mobile (Expo Go) and web access.

## Requirements
- **Docker** and **Docker Compose** installed on your system
- **Node.js 22** is used in both backend and frontend containers

## Quick Start
1. From the project root, run:
  ```sh
  docker compose build --no-cache
  docker compose up
  ```
2. The backend will be available at [http://localhost:3000](http://localhost:3000)
3. The frontend (Expo) will:
  - Show a QR code for Expo Go (scan with your mobile device)
  - Serve the web app at [http://localhost:19006](http://localhost:19006)

## Service Ports
- **Backend (`js-backend`)**: 3000
- **Frontend (`js-frontend`)**: 8081 (Metro), 19000-19002 (Expo DevTools), 19006 (Web)

## Common Issues & Troubleshooting
- **Port Already in Use**: If you see an error about port 8081, another process is using it. Stop any other Expo/Metro servers or change the port mapping in `compose.yaml`.
- **Missing Dependencies**: If Expo reports missing modules (e.g., `expo-dev-client`, `react-dom`, `react-native-web`), ensure they are listed in `package.json` and rebuild with `docker compose build --no-cache`.
- **node_modules Issues**: Do not mount `node_modules` from your host. Let Docker install dependencies inside the container.
- **Health Check Failures**: The backend includes a `/health` endpoint for Docker health checks.

## File Locations
- **Backend Dockerfile**: `code/Study buddy/backend/Dockerfile`
- **Frontend Dockerfile**: `code/Study buddy/frontend/Dockerfile`
- **Compose file**: `compose.yaml`

## Environment Variables
- Set in `compose.yaml` for frontend: `EXPO_DEVTOOLS_LISTEN_ADDRESS`, `CHOKIDAR_USEPOLLING`, `WATCHPACK_POLLING`, `HOME`, etc.
- You can add more via the `environment` section in `compose.yaml`.

## Updating Dependencies
If you add or update dependencies in `package.json`, always rebuild your containers:
```sh
docker compose build --no-cache
docker compose up
```

---

For more details, see the Dockerfiles and `compose.yaml` in the repository. If you encounter issues, check the troubleshooting section above or reach out to your team for support.
