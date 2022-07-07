FROM node:alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

FROM node:lts-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY src /app/src
COPY public /app/public
RUN yarn build
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
