FROM node:18

WORKDIR /app

COPY . /app/

ENV REACT_APP_API_URL='http://localhost:8000'

ENV REACT_APP_MAP_TOKEN='pk.eyJ1IjoiZGF2aWRlc2NvYmFyIiwiYSI6ImNsMTd4YjJ5bDAwcnUzZHFrNXhqdDVubm0ifQ.LJde1KPn6QTXqaKXUYapuA'

ENV NODE_OPTIONS='--openssl-legacy-provider'

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
