FROM node:16.0.0-alpine
# FROM --platform=linux/x86_64 node:16.0.0-alpine

WORKDIR /app
COPY . .
RUN npm install && npm run build

ENV NODE_ENV=production
ENV BABEL_ENV=node

EXPOSE 3001

CMD ["node", "server/runner.js"]
