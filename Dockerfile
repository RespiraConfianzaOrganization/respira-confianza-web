FROM node:alpine AS builder

WORKDIR /app

COPY . /app

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN yarn && yarn build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app /app
RUN yarn global add serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
