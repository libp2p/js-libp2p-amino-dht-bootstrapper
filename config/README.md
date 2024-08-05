# Configuration

This folder is intended to contain various configuration files for the project.

## Metrics

### Using our provided grafana dashboard with prometheus and grafana

If you run with the `dashboard` profile, it will enable the grafana and prometheus services.

```sh
docker compose --profile dashboard pull
docker compose --profile dashboard up -d
```
