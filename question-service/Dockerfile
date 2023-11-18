# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the app source code to the working directory
COPY . .

# Expose port 3002
EXPOSE 3002

# Specify the command to run the app
CMD ["yarn", "start"]
