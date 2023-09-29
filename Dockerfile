FROM node:18-alpine

WORKDIR /app
ENV CONFIG_FLAGS=""

COPY package*.json .
RUN npm ci --quiet
COPY . .
RUN npm run build
RUN npm link
ENTRYPOINT [ "amino", ${CONFIG_FLAGS} ]
