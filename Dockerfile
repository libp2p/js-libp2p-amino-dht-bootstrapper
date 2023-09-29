FROM node:18-alpine

ENV CONFIG_FLAGS=""

COPY package*.json .
RUN npm ci --quiet
COPY . .
RUN npm run build
RUN npm link
CMD [ "node", "dist/src/index.js", "${CONFIG_FLAGS}" ]
