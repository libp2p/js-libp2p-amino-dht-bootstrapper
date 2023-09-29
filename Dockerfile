FROM node:18-alpine

COPY package*.json .
RUN npm ci --quiet
COPY . .
RUN npm run build
ENTRYPOINT [ "node", "dist/src/index.js" ]

