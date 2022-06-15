FROM node:alpine

WORKDIR /app

COPY . /app

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN yarn

RUN yarn global add serve

RUN yarn build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
