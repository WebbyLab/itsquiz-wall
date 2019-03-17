FROM node:10-alpine

ENV itsquiz_wall_static_url http://localhost:3001

RUN mkdir /app
WORKDIR /app

COPY . .
COPY etc/client-config.json.sample etc/client-config.json

RUN npm install
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start-clean"]