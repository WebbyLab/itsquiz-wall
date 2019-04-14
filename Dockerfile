FROM node:10-alpine

ENV ITSQUIZ_WALL_STATIC_URL=''

RUN mkdir /app
WORKDIR /app

COPY . .
COPY etc/client-config.json.sample etc/client-config.json

RUN npm install
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start-clean"]