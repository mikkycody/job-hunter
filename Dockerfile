FROM node:14.17.0-alpine

WORKDIR /usr/src/app

RUN apk add	postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 4040

EXPOSE 4040

CMD ./scripts/wait-for-postgres.sh 172.17.0.2 && npm run migrate && npm run seed && npm run dev
