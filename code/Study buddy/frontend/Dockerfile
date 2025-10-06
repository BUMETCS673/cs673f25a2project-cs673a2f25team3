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
RUN npm install

# (Optional) global expo; you can rely on npx instead if you prefer
RUN npm install -g expo@latest

# Bring in the app
COPY . .

# Typical Expo/Metro ports
EXPOSE 8081 19000 19001 19002 19006

# Bind to 0.0.0.0 so you can reach Metro/DevTools from host
# --dev-client enables native client flows; --web starts the web server too
# --non-interactive avoids prompts that can hang in Docker
CMD ["bash", "-lc", "expo start --dev-client --web --host 0.0.0.0 --non-interactive"]