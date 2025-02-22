FROM node:20-alpine3.21

WORKDIR /app

COPY ./index.js /app/
COPY ./package.json /app/
COPY ./src /app/src/

RUN npm install

CMD ["npm", "run", "app"]
