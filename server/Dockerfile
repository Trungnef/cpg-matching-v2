# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port (default 5000, can be overridden by env)
EXPOSE 5000

# Start the server
CMD ["npm", "start"] 