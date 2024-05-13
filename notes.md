
# docker
## build container for mac

docker build . --platform linux/arm64 --tag js-libp2p-amino-dht-bootstrapper:local-arm64

docker build . --tag amino

## run container

docker run -v ./local-config.json:/config.json -p 8888:8888 -p 4101:4101 -p 4102:4102 -it js-libp2p-amino-dht-bootstrapper:local-arm64 --config /config.json --enable-kademlia

docker run -v ./local-config.json:/config.json -p 8888:8888 -p 4101:4101 -p 4102:4102 -it amino --config /config.json --enable-kademlia

## shell in container

docker run --rm -it --entrypoint bash js-libp2p-amino-dht-bootstrapper:local-arm64

docker run --rm -it --entrypoint bash amino

# docker compose

docker compose --profile dashboard pull
docker compose --profile dashboard build
docker compose --profile dashboard up -d
docker compose --profile dashboard down

## clear grafana data

rm config/grafana/grafana.db
