FROM node:alpine

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV REACT_APP_API_URL=""
ENV REACT_APP_MAP_TOKEN="pk.eyJ1IjoiZGF2aWRlc2NvYmFyIiwiYSI6ImNsMTd4YjJ5bDAwcnUzZHFrNXhqdDVubm0ifQ.LJde1KPn6QTXqaKXUYapuA"
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY public /app/public
COPY src /app/src
EXPOSE 3000
RUN yarn
RUN yarn build
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
