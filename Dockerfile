FROM node:20.17.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm run migrate
COPY . .
EXPOSE 3333
CMD ["node", "server.js"]