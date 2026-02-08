FROM node:22-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "index.js"]