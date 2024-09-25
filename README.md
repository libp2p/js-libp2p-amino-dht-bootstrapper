# @libp2p/amino-dht-bootstrapper <!-- omit in toc -->

[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/libp2p/js-libp2p-amino-dht-bootstrapper.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-libp2p-amino-dht-bootstrapper)
[![CI](https://img.shields.io/github/actions/workflow/status/libp2p/js-libp2p-amino-dht-bootstrapper/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Run an Amino DHT boostrapper with js-libp2p

## Table of contents <!-- omit in toc -->

- [Bootstrap details](#bootstrap-details)
  - [Requirements of a bootstrap node](#requirements-of-a-bootstrap-node)
- [Start the bootstrapper](#start-the-bootstrapper)
  - [RPC API](#rpc-api)
  - [Configuring bootstrapper options](#configuring-bootstrapper-options)
- [Building the Docker Image](#building-the-docker-image)
  - [Running the docker image (once built):](#running-the-docker-image-once-built)
  - [Running the docker image with monitoring:](#running-the-docker-image-with-monitoring)
- [License](#license)
- [Contribution](#contribution)

## Bootstrap details

EPIC tracking issue: https://github.com/protocol/bifrost-infra/issues/2778

Find more info at https://github.com/protocol/bifrost-infra/blob/master/docs/bootstrap.md

Rust bootstrapper: https://github.com/libp2p/rust-libp2p/tree/master/misc/server

### Requirements of a bootstrap node

* The Peer IDs of the default bootstrap nodes are set explicitly, to assert that you only trust a specific peer at a given ip or dns entry.
    * This makes it harder for attackers to spoof or otherwise MITM attack, as they would also have to compromise our infrastructure to steal the private key behind the Peer ID.
* Defaults
    * The default addresses for the bootstrap nodes are set in the ipfs/go-ipfs-config configuration

## Start the bootstrapper

```console
$ npx --package=@libp2p/amino-dht-bootstrapper -- amino
```

```sh
Options:
      --config <CONFIG>              Path to IPFS config file (required)
      --metrics-path <METRICS_PATH>  Metric endpoint path [default: /metrics]
      --metrics-port <PORT>          Metric endpoint path [default: 8888]
      --enable-kademlia              Whether to run the libp2p Kademlia protocol and join the IPFS DHT
      --enable-autonat               Whether to run the libp2p Autonat protocol
      --api-port <PORT>              Port to serve the RPC API [default: 8899]
      --api-host <HOST>              Host to serve the RPC API on [default: 127.0.0.1]
  -h, --help                         Print help
```

### RPC API

To make a request via CURL, you can use the following command:

```sh
# run garbage collection
$ curl http://${HOST}:${RPC_PORT}/api/v0/nodejs/gc

# execute a heapdump
$ curl http://${HOST}:${RPC_PORT}/api/v0/nodejs/heapdump

# change the log level
$ curl http://${HOST}:${RPC_PORT}/api/v0/nodejs/log?namespace=libp2p:*
```

Please note that the RPC API server only listens on the loopback interface (127.0.0.1) by default. If you decide to change the `api-host` option, please make sure that the RPC API server is only used for development purposes and is not accessible publicly.

### Configuring bootstrapper options

```json
{
  "config": {
    "description": "Path to IPFS config file",
    "type": "string"
  },
  "enable-kademlia": {
    "description": "Whether to run the libp2p Kademlia protocol and join the IPFS DHT",
    "type": "boolean"
  },
  "enable-autonat": {
    "description": "Whether to run the libp2p Autonat protocol",
    "type": "boolean"
  },
  "metrics-path": {
    "description": "Metric endpoint path",
    "default": "/metrics",
    "type": "string"
  },
  "metrics-port": {
    "description": "Port to serve metrics",
    "default": "8888",
    "type": "string"
  },
  "api-port": {
    "description": "Port for api endpoint",
    "default": "8899",
    "type": "string"
  },
  "api-host": {
    "description": "The listen address hostname for the RPC API server",
    "default": "127.0.0.1",
    "type": "string"
  },
  "help": {
    "description": "Show help text",
    "type": "boolean"
  }
```

## Building the Docker Image

Building should be straightforward from the root of the repository:

```sh
$ docker build . --tag amino
```

### Running the docker image (once built):

```sh
$ docker run -v $(pwd)/bootstrapper-config.json:/config.json -it amino --config /config.json
```

To pass args:

```sh
$ docker run -v $(pwd)/bootstrapper-config.json:/config.json -it amino --config /config.json [--enable-kademlia] [--enable-autonat]
```

To expose the metrics port:

```sh
$ docker run -v $(pwd)/bootstrapper-config.json:/config.json -p 8888:8888 -it amino --config /config.json
```

### Running the docker image with monitoring:

```sh
$ docker compose --profile dashboard up -d
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
