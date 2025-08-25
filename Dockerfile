# Uses node v22 as our base image
FROM node:22 

# Goes to the app directory
WORKDIR /app

# Copies the package.json and package-lock.json files
COPY package*.json ./

# Installs the app dependencies
RUN npm install

# Copies the app source code
COPY . .

RUN npm run build

# Set port environment variable
ENV PORT=9000

# Exposes the app port
EXPOSE 9000

# Starts the app
CMD ["npm", "start"]