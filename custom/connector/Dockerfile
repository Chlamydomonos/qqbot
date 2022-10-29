FROM node:latest

RUN mkdir /app
WORKDIR /app
ADD ./.npmrc /app/.npmrc
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json
ADD ./tsconfig.json /app/tsconfig.json
ADD ./src /app/src
ADD ./startApp.sh /app/startApp.sh
RUN npm install
RUN npm run build
RUN npm version patch
RUN npm publish
