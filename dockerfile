# Use an official Node.js LTS runtime
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with lockfile enforcement
RUN npm ci

# Copy only source files needed to build and run the app
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# Drop privileges — never run as root inside a container
USER node

# Expose Vite dev server port
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]
