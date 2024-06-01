FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force
RUN npm install bcrypt --force

COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]