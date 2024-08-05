# Troubleshooting

If you encounter any issues while using the application, please refer to the following list of common issues and their solutions.

## Common issues

### How do I get libp2p logs from the bootstrapper?

First, you want to modify `docker-compose.yaml` to set the `DEBUG` environment variable. This will enable debug logging for the bootstrapper. You can then view the logs by running `docker logs <container_id>`.

E.g.

```diff
diff --git a/docker-compose.yaml b/docker-compose.yaml
index dc2dc69..5a5b286 100644
--- a/docker-compose.yaml
+++ b/docker-compose.yaml
@@ -14,6 +14,7 @@ services:
       - 4003:4003
     environment:
       - CONFIG_FLAGS=""
+      - DEBUG="libp2p:websockets*,libp2p:websockets*:trace,libp2p:tcp*,libp2p:tcp*:trace"
```

More information about getting logs can be found at https://github.com/libp2p/js-libp2p/blob/main/doc/GETTING_STARTED.md#node. You can search for logging prefixes for js-libp2p at https://github.com/search?q=repo%3Alibp2p%2Fjs-libp2p%20%22libp2p%3A%22&type=code.

### Grafana / Prometheus are not connecting to the metrics endpoint.

First, go through this checklist to ensure things are set up correctly:

1. Ensure that the metrics endpoint is up and running. You should be able to access metrics at <hostIp/dns>:8888/metrics.
2. Check that prometheus is configured to scrape the js-libp2p-bootstrapper metrics endpoint. You can verify that it's connected by going to <hostIp/dns>:9080/targets.
3. Check that Grafana is configured to use Prometheus as a data source. You can verify this by going to <hostIp/dns>:9181/explore. Ensure that "Prometheus" is selected as the datasource, and that the metrics explorer is showing libp2p_* metrics.

If 1 checks out, but 2 doesn't, then the issue may be related to docker networking. We have `host.docker.internal` configured as the Prometheus target, which doesn't seem super reliable. You can apply the below change, replacing `xxx.xxx.xxx.xxx` with your host IP address, or use a DNS identifier:

```diff
diff --git a/config/grafana/datasources/prometheus.yml b/config/grafana/datasources/prometheus.yml
index 39bbb7c..7a8aab5 100755
--- a/config/grafana/datasources/prometheus.yml
+++ b/config/grafana/datasources/prometheus.yml
@@ -5,7 +5,7 @@ datasources:
     typeName: Prometheus
     typeLogoUrl: public/app/plugins/datasource/prometheus/img/prometheus_logo.svg
     access: proxy
-    url: http://host.docker.internal:9080
+    url: http://xxx.xxx.xxx.xxx:9080
     user: ""
     database: ""
     basicAuth: false
diff --git a/config/prometheus/prometheus.yml b/config/prometheus/prometheus.yml
index 351418b..c5557ba 100644
--- a/config/prometheus/prometheus.yml
+++ b/config/prometheus/prometheus.yml
@@ -6,7 +6,7 @@ scrape_configs:
   - job_name: 'js-libp2p-amino-dht-bootstrapper'
     metrics_path: '/metrics'
     static_configs:
-      - targets: ['host.docker.internal:8888']
+      - targets: ['xxx.xxx.xxx.xxx:8888']
```

If 2 or 3 are not working, then the issue may be related to the configuration of the respective services. Check the configuration files for Prometheus and Grafana to ensure that they are correctly configured. Please open an issue if you found a bug in our configuration, or a PR if you have a fix!

### Docker metrics are not being exported

You need to modify your Docker config or start the Docker daemon with the `--metrics-addr` flag to enable the metrics endpoint. You can do this by modifying the Docker daemon configuration file, or by starting the Docker daemon with the `--metrics-addr` flag. For more information, refer to the [Docker documentation](https://docs.docker.com/config/daemon/prometheus/).


## Commands

### Docker
#### build container for mac

```sh
docker build . --platform linux/arm64 --tag js-libp2p-amino-dht-bootstrapper:local-arm64

docker build . --tag amino
```

#### run container

```sh
docker run -v ./local-config.json:/config.json -p 8888:8888 -p 4101:4101 -p 4102:4102 -it js-libp2p-amino-dht-bootstrapper:local-arm64 --config /config.json --enable-kademlia

docker run -v ./local-config.json:/config.json -p 8888:8888 -p 4101:4101 -p 4102:4102 -it amino --config /config.json --enable-kademlia
```

#### shell in container

```sh
docker run --rm -it --entrypoint bash js-libp2p-amino-dht-bootstrapper:local-arm64

docker run --rm -it --entrypoint bash amino
```

#### docker compose

```sh
docker compose --profile dashboard pull
docker compose --profile dashboard build
docker compose --profile dashboard up -d
docker compose --profile dashboard down
```

#### clear grafana data

This can come in handy if you need to reset the data in Grafana. Keep in mind that all dashboards and data will be lost.

```sh
rm config/grafana/grafana.db
```

#### copy&paste commands for bootstrapper when started with docker compose:

```sh
# View the healthcheck logs
docker inspect --format "{{json .State.Health }}" $(docker container ls  | grep 'js-libp2p-amino-dht-bootstrapper-bootstrapper' | awk '{print $1}') | jq

# view the container logs
docker logs $(docker container ls  | grep 'js-libp2p-amino-dht-bootstrapper-bootstrapper' | awk '{print $1}')
```
