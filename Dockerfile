FROM --platform=${BUILDPLATFORM} node:20-slim as builder

# Install dependencies required for building the app
RUN apt-get update && \
    apt-get install -y tini curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet

COPY . ./
RUN npm run build
RUN npm prune --omit=dev

FROM --platform=${BUILDPLATFORM} node:20-slim as app

ENV NODE_ENV production
WORKDIR /app

COPY --from=builder /app ./
COPY --from=builder /usr/bin/tini /usr/bin/tini
COPY --from=builder /usr/bin/curl /usr/bin/curl

HEALTHCHECK --interval=60s --timeout=30s --start-period=10s CMD node dist/src/health-check.js

# ws
EXPOSE 4003
# tcp
EXPOSE 4001
# metrics
EXPOSE 8888

# Use tini to handle signals properly, see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
ENTRYPOINT ["/usr/bin/tini", "-p", "SIGKILL", "--", "node", "--expose-gc", "dist/src/index.js" ]
