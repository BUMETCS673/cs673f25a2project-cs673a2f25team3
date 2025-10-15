# 90% AI generated
# 10% manual bug fixing


# Use Debian (not Alpine) so Expo/Metro deps are available & easy to install
FROM node:22-bullseye

# Helpful env for dev inside containers
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

WORKDIR /app

# Install system tools commonly needed by Expo/Metro and native deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash git python3 make g++ \
 && rm -rf /var/lib/apt/lists/*


# Install deps first for better layer caching
COPY package*.json ./
COPY babel.config.js ./
COPY eslint.config.js ./
RUN --mount=type=cache,target=/root/.npm npm ci || true

# Bring in the app
COPY . .

# Typical Expo/Metro ports
EXPOSE 8081 19000 19001 19002 19006

CMD ["bash", "-lc", "npx expo start --dev-client --web --host lan"]