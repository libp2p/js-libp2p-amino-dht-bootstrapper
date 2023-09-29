# @libp2p/amino-dht-bootstrapper <!-- omit in toc -->

[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/libp2p/js-libp2p-amino-dht-bootstrapper.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-libp2p-amino-dht-bootstrapper)
[![CI](https://img.shields.io/github/actions/workflow/status/libp2p/js-libp2p-amino-dht-bootstrapper/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Run an Amino DHT boostrapper with js-libp2p

## Table of contents <!-- omit in toc -->

- [Bootstrap details](#bootstrap-details)
  - [Requirements of a bootstrap node](#requirements-of-a-bootstrap-node)
- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
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
$ npx @libp2p/amino-dht-bootstrapper amino
```

### Configuring bootstrapper options

```
{
  "config": {
    "description": "Path to IPFS config file",
    "type": "string"
  },
  "enableKademlia": {
    "description": "Whether to run the libp2p Kademlia protocol and join the IPFS DHT",
    "type": "boolean"
  },
  "enableAutonat": {
    "description": "Whether to run the libp2p Autonat protocol",
    "type": "boolean"
  },
  "metricsPath": {
    "description": "Metric endpoint path",
    "default": "/metrics",
    "type": "string"
  },
  "metricsPort": {
    "description": "Port to serve metrics",
    "default": "8888",
    "type": "string"
  },
  "help": {
    "description": "Show help text",
    "type": "boolean"
  }
}
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
