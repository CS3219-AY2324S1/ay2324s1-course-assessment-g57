# Use the official Node.js image as a base image
FROM node:16-alpine

# Install bash and wget
RUN apk add --no-cache bash

# Download wait-for-it.sh script
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

# Make the script executable
RUN chmod +x /bin/wait-for-it.sh

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