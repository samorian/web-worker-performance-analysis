FROM node:18-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH


COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.0 -g --silent

COPY . ./

CMD ["npm", "start"]