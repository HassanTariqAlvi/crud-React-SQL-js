FROM node:22-alpine3.19  


WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the app in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
