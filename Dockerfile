FROM node:alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY public /app/public
COPY src /app/src
EXPOSE 3000
RUN yarn
RUN yarn build
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
