FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Use the start script from package.json
CMD ["npm", "run", "start"]