# Basic image 
FROM node:22-alpine AS build

# Working directory
WORKDIR /server

# Copy packages and files and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy all sources
COPY . .

# Expose port your backend runs on
EXPOSE 5000

# Start your backend - make sure it listens on 0.0.0.0
CMD ["nodemon", "mainServer.js", "--host", "0.0.0.0"]