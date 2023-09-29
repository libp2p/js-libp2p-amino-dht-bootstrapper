FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV CONFIG_FLAGS=""

COPY package*.json .
RUN npm ci --quiet
COPY . .
RUN npm run build
RUN npm link
ENTRYPOINT [ "amino", ${CONFIG_FLAGS} ]
