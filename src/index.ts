#! /usr/bin/env node --trace-warnings
/* eslint-disable no-console */

import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { isAbsolute, join } from 'node:path'
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { autoNAT } from '@libp2p/autonat'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { unmarshalPrivateKey } from '@libp2p/crypto/keys'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { peerIdFromKeys, peerIdFromString } from '@libp2p/peer-id'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { LevelDatastore } from 'datastore-level'
import { createLibp2p, type ServiceFactoryMap } from 'libp2p'
import { register } from 'prom-client'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { PeerId } from '@libp2p/interface'

interface Libp2pServices extends ServiceFactoryMap {

}

async function main (): Promise<void> {
  const options = {
    config: {
      description: 'Path to IPFS config file',
      type: 'string'
    },
    enableKademlia: {
      description: 'Whether to run the libp2p Kademlia protocol and join the IPFS DHT',
      type: 'boolean'
    },
    enableAutonat: {
      description: 'Whether to run the libp2p Autonat protocol',
      type: 'boolean'
    },
    metricsPath: {
      description: 'Metric endpoint path',
      default: '/metrics',
      type: 'string'
    },
    metricsPort: {
      description: 'Port to serve metrics',
      default: '8888',
      type: 'string'
    },
    help: {
      description: 'Show help text',
      type: 'boolean'
    }
  } as const

  const args = parseArgs({
    allowPositionals: true,
    strict: true,
    options
  })

  if (args.values.help === true) {
    console.info(JSON.stringify(options, null, 2))
    return
  }

  const configFilename = args.values.config
  if (configFilename == null) {
    fatal('--config must be provided')
  }
  const configFilepath = isAbsolute(configFilename) ? configFilename : join(process.cwd(), configFilename)
  const config = await readConfig(configFilepath)

  const peerId = await decodePeerId(config.Identity.PrivKey)
  if (!peerIdFromString(config.Identity.PeerID).equals(peerId)) {
    fatal('Config Identity.PeerId doesn\'t match Identity.PrivKey')
  }

  const services: Libp2pServices = {
    circuitRelay: circuitRelayServer({
      advertise: true
    }),
    bootstrap: bootstrap({
      list: config.Bootstrap
    })
  }

  if (args.values.enableKademlia === true) {
    services.dht = kadDHT({})
  }

  if (args.values.enableAutonat === true) {
    services.autonat = autoNAT()
  }

  const node = await createLibp2p({
    datastore: new LevelDatastore('js-libp2p-datastore'),
    peerId,
    addresses: {
      listen: config.Addresses.Swarm,
      announce: config.Addresses.Announce,
      noAnnounce: config.Addresses.NoAnnounce
    },
    transports: [
      webSockets(),
      tcp()
    ],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    connectionEncryption: [
      noise()
    ],
    metrics: prometheusMetrics(),
    services
  })

  console.info('libp2p is running')
  console.info('PeerId', node.peerId.toString())

  const metricsServer = createServer((req, res) => {
    if (req.url === args.values.metricsPath && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      void register.metrics().then((metrics) => res.end(metrics))
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })
  const port = parseInt(args.values.metricsPort ?? options.metricsPort.default, 10)
  await new Promise<void>((resolve) => metricsServer.listen(port, '0.0.0.0', resolve))

  console.info('Metrics server listening', `0.0.0.0:${args.values.metricsPort}${args.values.metricsPath}`)
}

main().catch(err => {
  fatal(err)
})

function fatal (msg?: any): never {
  console.error(msg)
  process.exit(1)
}

/** Subset of options that we care about from an kubo config */
interface KuboConfig {
  Bootstrap: string[]
  Addresses: {
    Swarm: string[]
    Announce: string[]
    NoAnnounce: string[]
  }
  Identity: {
    PeerID: string
    PrivKey: string
  }
}

function validateKey (config: any, key: string, path: string): void {
  if (config[key] == null) {
    fatal(`Config key missing: ${path}`)
  }
}

function validateConfig (config: any): config is KuboConfig {
  validateKey(config, 'Bootstrap', 'Bootstrap')
  validateKey(config, 'Addresses', 'Addresses')
  validateKey(config.Addresses, 'Swarm', 'Addresses.Swarm')
  validateKey(config.Addresses, 'Announce', 'Addresses.Announce')
  validateKey(config.Addresses, 'NoAnnounce', 'Addresses.NoAnnounce')
  validateKey(config, 'Identity', 'Identity')
  validateKey(config.Identity, 'PeerID', 'Identity.PeerID')
  validateKey(config.Identity, 'PrivKey', 'Identity.PrivKey')
  return true
}

async function readConfig (filepath: string): Promise<KuboConfig> {
  const configString = await readFile(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateConfig(config)
  return config
}

async function decodePeerId (privkeyStr: string): Promise<PeerId> {
  try {
    const privkeyBytes = uint8ArrayFromString(privkeyStr, 'base64pad')
    const privkey = await unmarshalPrivateKey(privkeyBytes)
    return await peerIdFromKeys(privkey.public.bytes, privkey.bytes)
  } catch (e) {
    fatal('Invalid peer-id private key')
  }
}
