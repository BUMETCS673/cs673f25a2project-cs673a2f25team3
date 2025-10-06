# Use a modern LTS Node version
FROM node:22-alpine

# Install minimal build deps for native modules (bcrypt, sharp, etc.)
RUN apk add --no-cache python3 make g++ bash tzdata

WORKDIR /app

# Copy only package manifests first for caching
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci  # install all dependencies including devDependencies

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    TZ=UTC

# Expose API port
EXPOSE 3000

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start the backend
CMD ["npm", "start"]
