FROM node:alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

RUN yarn build
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
