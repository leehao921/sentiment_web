# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Cloud Run will provide PORT env var)
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production

# Start the server
CMD ["node", "index.js"]
