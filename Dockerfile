FROM --platform=${BUILDPLATFORM} node:22-slim

# Install dependencies required for running the app
RUN apt-get update && \
    apt-get install -y tini curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY patches ./patches
RUN npm ci --quiet

ENV NODE_ENV production

COPY src ./src
COPY tsconfig.json ./
RUN npm run build
RUN npm prune --omit=dev

HEALTHCHECK --interval=60s --timeout=30s --start-period=10s CMD node dist/src/health-check.js

# tcp
EXPOSE 4001
# ws
EXPOSE 4003
# webrtc-direct
EXPOSE 4005
# metrics
EXPOSE 8888
# RPC api
EXPOSE 8899

# Use tini to handle signals properly, see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
ENTRYPOINT ["/usr/bin/tini", "-p", "SIGKILL", "--", "node", "--expose-gc", "dist/src/index.js" ]
