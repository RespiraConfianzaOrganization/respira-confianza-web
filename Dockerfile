FROM node

WORKDIR /app

COPY . /app/

RUN yarn

RUN yarn global serve

RUN yarn build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
