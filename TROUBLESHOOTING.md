# Troubleshooting

If you encounter any issues while using the application, please refer to the following list of common issues and their solutions.

## Common issues

### Grafana / Prometheus are not connecting to the metrics endpoint.

First, go through this checklist to ensure things are set up correctly:

1. Ensure that the metrics endpoint is up and running. You should be able to access metrics at <hostIp/dns>:8888/metrics.
2. Check that prometheus is configured to scrape the metrics endpoint. You can verify that it's connected by going to <hostIp/dns>:9080/targets.
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
