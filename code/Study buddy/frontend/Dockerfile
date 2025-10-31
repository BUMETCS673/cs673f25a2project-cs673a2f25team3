# 90% AI generated
# 10% manual bug fixing

FROM node:22-bullseye

ENV NODE_ENV=development \
    HOME=/app \
    NPM_CONFIG_CACHE=/app/.npm \
    EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

WORKDIR /app

# System tools some expo deps want
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash git python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Copy manifests first for better caching
COPY package*.json ./
COPY babel.config.js ./
COPY eslint.config.js ./

# Install deps reproducibly
RUN npm ci

# Copy the rest of the app
COPY . .

# Create runtime dirs (inside container) so expo/metro can write
RUN mkdir -p /app/.npm /app/.expo /app/.expo-shared

EXPOSE 8081 19000 19001 19002 19006

# Start in tunnel mode so phones off-LAN can connect
CMD ["bash", "-lc", "exec npx expo start --host tunnel"]
