# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port for your app
EXPOSE 4000 5672

# Command to run your application
CMD ["npm", "start"]