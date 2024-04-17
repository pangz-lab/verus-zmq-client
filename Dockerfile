FROM node:lts-alpine

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Launch application
CMD ["npm","run","dev_ie"]