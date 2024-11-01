# Use Node.js 20-alpine as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies, including Vite
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Vite uses
EXPOSE 5173

# Run Vite using the locally installed binary in node_modules
CMD ["node_modules/.bin/vite"]