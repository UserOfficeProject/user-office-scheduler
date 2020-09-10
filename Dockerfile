FROM node:12-slim

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production --silent

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4000

CMD [ "node", "./build/index.js" ]