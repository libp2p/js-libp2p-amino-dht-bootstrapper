FROM node:18

WORKDIR /app
ENV CONFIG_FLAGS=""

COPY package*.json .
RUN npm ci --quiet
RUN npm run build
COPY . .
ENTRYPOINT ["node", "dist/src/index.js", "${CONFIG_FLAGS}"]
