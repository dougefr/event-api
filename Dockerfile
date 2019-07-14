FROM node:10-alpine

# Env vars
ENV MONGO_URI ""
ENV NODE_ENV production

# App directory
WORKDIR /usr/src/app

# Dependencies
COPY package*.json ./
RUN npm i

# Copy all files and build the project
COPY . .

# Execute the project
EXPOSE 3000
CMD ["npm", "run", "prod"]

