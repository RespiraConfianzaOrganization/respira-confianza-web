FROM node

WORKDIR /app

COPY . /app/

RUN npm install --global yarn

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]
