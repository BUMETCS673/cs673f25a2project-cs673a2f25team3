# 90% AI generated
# 10% bug fixing

# Use a modern LTS Node version (slim for smaller image)
FROM node:22-slim

# Set environment variables
ENV NODE_ENV=development

# Set working directory
WORKDIR /app

# Install native dexpo ependencies
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
