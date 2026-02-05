# Use the official Node.js 22 image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json and prisma folder to ensure dependencies are installed correctly
COPY /package.json .
COPY /package-lock.json .
COPY /prisma ./prisma

ENV DATABASE_URL="file:/app/prisma/mplf.db"

# Install dependencies using NPM with a specific Nuxt.js version
RUN npm add nuxt@3.16.1 && npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Build the Nuxt.js application
RUN npm run build

# Expose the port Nuxt uses (default is 3000)
EXPOSE 3000

# Start the Nuxt application
CMD ["npm", "run", "start"]