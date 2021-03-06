FROM node:8.10-alpine

ENV HOME=/home/node
WORKDIR $HOME/gorilla/

COPY package.json yarn.lock ./
RUN chown -R node:node .

USER node
RUN yarn install

USER root
COPY . .
RUN chown -R node:node .

USER node
EXPOSE 3000
