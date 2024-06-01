FROM node:18.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 5000

CMD [ "node", "app.js" ]