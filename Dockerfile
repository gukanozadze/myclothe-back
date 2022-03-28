FROM node:16.14.0

WORKDIR /app
COPY package.json .
RUN yarn 
COPY . .

CMD yarn run start:dev