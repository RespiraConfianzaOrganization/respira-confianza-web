FROM node:alpine

WORKDIR /app

COPY . /app

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN yarn && yarn global add serve && yarn build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
