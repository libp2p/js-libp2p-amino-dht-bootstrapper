## [1.5.3](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.5.2...v1.5.3) (2024-09-25)

### Bug Fixes

* patch libp2p to have quieter logging, enable extra metrics ([#156](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/156)) ([4d7729e](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/4d7729ef73875563df28ea455d569470f03c81a7))
* restore host networking ([013cb04](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/013cb04c132bbb409f225587dd439e8d3626148e))

## [1.5.2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.5.1...v1.5.2) (2024-09-24)

### Bug Fixes

* update libp2p deps ([#155](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/155)) ([927cbd2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/927cbd2262d6d95c920aaa0befca8048ea06d0e3))

## [1.5.1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.5.0...v1.5.1) (2024-09-24)

### Bug Fixes

* download heapdump instead of writing to disk ([#153](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/153)) ([38cf657](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/38cf657f5d6d91e783214279285b8f4cea2cb482))
* simplify docker image with single stage build ([#154](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/154)) ([1921e35](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/1921e3566ba79f1d5dae926a2821c12c1ed7debb))

## [1.5.0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.4.2...v1.5.0) (2024-09-24)

### Features

* add dynamic logging to js bootstrapper ([#152](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/152)) ([2493b1b](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/2493b1bce9e3a0cbb433b02c0859e8920c24c1ec))

## [1.4.2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.4.1...v1.4.2) (2024-09-23)

### Bug Fixes

* handle fatal metrics error ([#150](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/150)) ([7edbbcd](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/7edbbcd0e56357709a14a7922ea6f1fc9ea3ae23))
* only start one libp2p node for healthcheck ([#149](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/149)) ([2fe378b](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/2fe378b3994b62458b0cf7bba745c93b713d44af))

## [1.4.1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.4.0...v1.4.1) (2024-09-20)

### Bug Fixes

* add required identify dependency ([#148](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/148)) ([5cecc40](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/5cecc408a82e890b2376440e89b472e7424ceebe))

## [1.4.0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.3.1...v1.4.0) (2024-09-20)

### Features

* remove webrtc and and ping and connection manager config ([#147](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/147)) ([dc17960](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/dc17960d373cde46e28955e0a6944246b8925b89))

## [1.3.1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.3.0...v1.3.1) (2024-09-19)

### Bug Fixes

* bin is mapped correctly and executable ([#145](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/145)) ([ca1b2e5](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ca1b2e592998fd5a24ca452c461161307bb9b802)), closes [#143](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/143)

## [1.3.0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.2.0...v1.3.0) (2024-09-19)

### Features

* RPC API server listens on loopback by default ([#142](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/142)) ([ac52598](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ac52598b7a0ee4b5281da695652070e51d2a134b))

### Trivial Changes

* **ci:** add git commit hash to docker tags ([#144](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/144)) ([ba0a5af](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ba0a5afac7ad47cda963d85aadb8f30de065cb93))

## [1.2.0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.13...v1.2.0) (2024-09-19)

### Features

* bootstrapper ready alpha use/testing in deployed env ([#135](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/135)) ([4faa2bd](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/4faa2bdb3f5935dabcd5c77d7d1944c8de996e22))

### Bug Fixes

* docker build & docs ([#133](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/133)) ([4ffc788](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/4ffc78884c6d54d1072fba4a184f99e59f2372dc))
* use correct casing for Identity.PeerID ([ffe222a](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ffe222a0061044f0550a9463901f6c2125ed2368))
* use persistent datastore ([#134](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/134)) ([1574195](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/1574195fc29d932bfb40dacf72c1b04e8207a1b6))

### Trivial Changes

* recreate lockfile ([#141](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/141)) ([2df90f0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/2df90f0a04aea79ec2f285ed56cc23af7220b81c))
* update lockfile ([69efe2e](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/69efe2ee7770321305c06eba12be6e8b73284824))
* use libp2p@2.0 ([#139](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/139)) ([6ecb7c6](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/6ecb7c6ce7e335cf817f2b94745fce809c8597ef))

### Dependencies

* update all deps ([01611b9](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/01611b91a2799925ac955ba42bade947c55728b1))

## [1.1.13](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.12...v1.1.13) (2024-02-19)


### Dependencies

* bump uint8arrays from 5.0.0 to 5.0.2 ([#110](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/110)) ([8b71bed](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/8b71bedbc761807864955c1f42fda3a1a6dcfe60))

## [1.1.12](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.11...v1.1.12) (2024-02-17)


### Trivial Changes

* Update .github/pull_request_template.md [skip ci] ([894628f](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/894628f511630cbc7f8af26858d707cf0ef1d6e8))
* Update .github/workflows/semantic-pull-request.yml [skip ci] ([75736a4](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/75736a43b66a0a310971ef721192e24a810bf396))
* Update .github/workflows/stale.yml [skip ci] ([5dfe6f2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/5dfe6f27bcf206babd3f0c38995e367684aa74f6))


### Dependencies

* **dev:** bump undici from 5.25.2 to 5.28.3 ([#109](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/109)) ([5a1e2d9](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/5a1e2d930b2e475a74071045fc6e1eb8108e2493))

## [1.1.11](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.10...v1.1.11) (2023-12-19)


### Trivial Changes

* **release:** 1.1.11 [skip ci] ([f5eab2c](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/f5eab2cc98db97f439e922b65f2425d1a65bc0ef)), closes [#91](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/91)


### Dependencies

* bump @multiformats/multiaddr from 12.1.10 to 12.1.11 ([#92](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/92)) ([b906bb6](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/b906bb69f00e5f2c1252dead6b903789776d0334))
* bump prom-client from 14.2.0 to 15.1.0 ([#91](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/91)) ([381941d](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/381941d9e08f8d8cf90907782d2479e7e1e5fab4))

## [1.1.11](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.10...v1.1.11) (2023-12-18)


### Dependencies

* bump prom-client from 14.2.0 to 15.1.0 ([#91](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/91)) ([381941d](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/381941d9e08f8d8cf90907782d2479e7e1e5fab4))

## [1.1.10](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.9...v1.1.10) (2023-12-08)


### Dependencies

* **dev:** bump aegir from 41.0.0 to 41.1.14 ([#86](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/86)) ([832da23](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/832da2309844a471f7bd2108f4f9b9b971d1ccf1))

## [1.1.9](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.8...v1.1.9) (2023-12-08)


### Dependencies

* bump @libp2p/interface from 0.1.6 to 1.0.1 ([#87](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/87)) ([c0db809](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/c0db809dbafcad8978f41fbd7f0c163813b4e6a2))

## [1.1.8](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.7...v1.1.8) (2023-12-07)


### Dependencies

* bump @libp2p/crypto from 2.0.4 to 3.0.1 ([#76](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/76)) ([32b134d](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/32b134d40799a81941943b98c11b2a8c77661ede))

## [1.1.7](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.6...v1.1.7) (2023-12-07)


### Dependencies

* bump uint8arrays from 4.0.6 to 5.0.0 ([#85](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/85)) ([a550525](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/a550525b1c2e6e479e5cbbb1deefb10e3ebcc538))

## [1.1.6](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.5...v1.1.6) (2023-12-06)


### Dependencies

* bump @libp2p/prometheus-metrics from 3.0.0 to 3.0.6 ([#83](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/83)) ([76ee84d](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/76ee84d0cb5d2a80a41f0239b1ab053a1b5bac55))

## [1.1.5](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.4...v1.1.5) (2023-12-05)


### Dependencies

* bump @libp2p/bootstrap from 9.0.7 to 10.0.5 ([#79](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/79)) ([e80c125](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/e80c1259d3ec6ee4af77eb496870a15a89ce84b6))

## [1.1.4](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.3...v1.1.4) (2023-11-30)


### Dependencies

* bump @libp2p/prometheus-metrics from 2.0.7 to 3.0.0 ([#69](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/69)) ([bef5ee1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/bef5ee17bca4841d63282e2bef968ae287dd1e06))

## [1.1.3](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.2...v1.1.3) (2023-10-19)


### Dependencies

* bump @babel/traverse and depcheck ([#31](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/31)) ([a390465](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/a390465cf269a68259d3add85191205ee6547a4b))

## [1.1.2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.1...v1.1.2) (2023-10-03)


### Trivial Changes

* add or force update .github/workflows/js-test-and-release.yml ([#17](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/17)) ([73c77f8](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/73c77f81df119a9fa7f1062643536d6d60666853))
* delete templates [skip ci] ([#16](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/16)) ([2903b22](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/2903b226981fa73266bfb0f0df52557f4b21a69a))
* Update .github/pull_request_template.md [skip ci] ([ef06487](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ef0648715039ad9885eb21504853aea1846b5ba9))
* Update .github/workflows/semantic-pull-request.yml [skip ci] ([845e03e](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/845e03e10e25c4e385cae69746a63e6c052a3883))
* Update .github/workflows/stale.yml [skip ci] ([0392196](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/0392196056f6ad361229399ad3b99fdbdf4a1e8e))


### Dependencies

* bump @libp2p/bootstrap from 9.0.6 to 9.0.7 ([#13](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/13)) ([9feba97](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/9feba970520a1238fccbe9fd6465cf3d9becb7c1))
* bump @libp2p/kad-dht from 10.0.7 to 10.0.8 ([#9](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/9)) ([44310b1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/44310b18d0b940cecca3f57905e8dd3f6483dbae))
* bump @libp2p/mplex from 9.0.6 to 9.0.7 ([#12](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/12)) ([6ba03f1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/6ba03f1b88be0f466b1a363c2cec588cac84ade3))
* bump @libp2p/prometheus-metrics from 2.0.6 to 2.0.7 ([#10](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/10)) ([842099b](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/842099ba9b0b1ea788591de55296e2f40db09e88))
* bump @libp2p/tcp from 8.0.7 to 8.0.8 ([#14](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/14)) ([5faa456](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/5faa4564f6f9f37f81f249ade21232c012cdd741))
* bump @libp2p/websockets from 7.0.7 to 7.0.8 ([#15](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/15)) ([476d9d3](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/476d9d3e4422cbf230baf956c76256fd9eac4117))

## [1.1.1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.1.0...v1.1.1) (2023-10-02)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.0.0 ([#7](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/7)) ([7cff688](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/7cff688a1b0c3415d8c693216487e71440dec237))

## [1.1.0](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.0.2...v1.1.0) (2023-10-02)


### Features

* use kubo config file for configuration ([#6](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/6)) ([5b2d520](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/5b2d5204ee64daf6b18fc2f42b457d9eddf5b152))

## [1.0.2](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.0.1...v1.0.2) (2023-09-29)


### Bug Fixes

* **docker:** Fixing Dockerfile Paths. ([#3](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/3)) ([a36c499](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/a36c499ec45e8d098c5784f5a12db93dc36c14bd))

## [1.0.1](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/compare/v1.0.0...v1.0.1) (2023-09-29)


### Bug Fixes

* add docker-compose ([#5](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/issues/5)) ([3b4c764](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/3b4c764475ecbf28ed0344497743de2a7761ab93))


### Trivial Changes

* minor clean up ([e649dfa](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/e649dfa1737d62fcba95485aecbe88706bdc4466))

## 1.0.0 (2023-09-29)


### Features

* add heath check and docker file ([3e55899](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/3e55899be0f54aa24045680fc976ed3ac91343f5))


### Trivial Changes

* add empty test ([ae4eb17](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ae4eb17bb8e21ed13a64d664dbc3b024f4f9e7b3))
* commit package-lock.json ([ac4bcb4](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/ac4bcb4c3049aac8b2fb24a2915452694530282d))
* fix linting ([961d505](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/961d505f1c22fe0ae03d233158e2f650f412f9df))
* inital import ([d030766](https://github.com/libp2p/js-libp2p-amino-dht-bootstrapper/commit/d0307667757a3b3b8c7af7388b26e06045b7b466))
