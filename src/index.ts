/* eslint-disable no-console */

import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { isAbsolute, join } from 'node:path'
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { autoNAT } from '@libp2p/autonat'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { privateKeyFromProtobuf } from '@libp2p/crypto/keys'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush } from '@libp2p/identify'
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht'
import { peerIdFromPrivateKey, peerIdFromString } from '@libp2p/peer-id'
import { ping } from '@libp2p/ping'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { isPrivateIp } from '@libp2p/utils/private-ip'
import { webSockets } from '@libp2p/websockets'
import { LevelDatastore } from 'datastore-level'
import { createLibp2p, type ServiceFactoryMap } from 'libp2p'
import { register } from 'prom-client'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { createRpcServer } from './create-rpc-server.js'
import { connectionsByEncrypterMetrics } from './services/connections-by-encrypter-metrics.js'
import { connectionsByMultiplexerMetrics } from './services/connections-by-multiplexer-metrics.js'
import { connectionsByTransportMetrics } from './services/connections-by-transport-metrics.js'
import { peersByAgentMetrics } from './services/peers-by-agent-metrics.js'
import { versionsMetrics } from './services/versions-metrics.js'
import type { PrivateKey } from '@libp2p/interface'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { ConnectionManagerInit } from 'libp2p/connection-manager'

interface Libp2pServices extends ServiceFactoryMap {

}

async function main (): Promise<void> {
  const options = {
    config: {
      description: 'Path to IPFS config file',
      type: 'string'
    },
    'enable-kademlia': {
      description: 'Whether to run the libp2p Kademlia protocol and join the IPFS DHT',
      type: 'boolean'
    },
    'enable-autonat': {
      description: 'Whether to run the libp2p Autonat protocol',
      type: 'boolean'
    },
    'metrics-path': {
      description: 'Metric endpoint path',
      default: '/metrics',
      type: 'string'
    },
    'metrics-port': {
      description: 'Port to serve metrics',
      default: '8888',
      type: 'string'
    },
    'api-port': {
      description: 'Port for api endpoint',
      default: '8899',
      type: 'string'
    },
    'api-host': {
      description: 'The listen address hostname for the RPC API server',
      default: '127.0.0.1',
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

  const {
    config: configFilename,
    'enable-kademlia': argEnableKademlia,
    'enable-autonat': argEnableAutonat,
    'metrics-path': argMetricsPath,
    'metrics-port': argMetricsPort,
    'api-port': argApiPort,
    'api-host': argApiHost,
    help: argHelp
  } = args.values

  if (argHelp === true) {
    console.info(JSON.stringify(options, null, 2))
    return
  }

  if (configFilename == null) {
    fatal('--config must be provided')
  }
  const configFilepath = isAbsolute(configFilename) ? configFilename : join(process.cwd(), configFilename)
  const config = await readConfig(configFilepath)

  const privateKey = decodePeerId(config.Identity.PrivKey)
  if (!peerIdFromString(config.Identity.PeerID).equals(peerIdFromPrivateKey(privateKey))) {
    fatal('Config Identity.PeerId doesn\'t match Identity.PrivKey')
  }

  const services: Libp2pServices = {
    circuitRelay: circuitRelayServer(),
    bootstrap: bootstrap({
      list: config.Bootstrap
    }),
    identify: identify({
      agentVersion: 'js-libp2p-bootstrapper'
    }),
    identifyPush: identifyPush(),
    ping: ping(),
    dcutr: dcutr(),

    // extra metrics
    connectionsByTransportMetrics: connectionsByTransportMetrics(),
    connectionsByEncrypterMetrics: connectionsByEncrypterMetrics(),
    connectionsByMultiplexerMetrics: connectionsByMultiplexerMetrics(),
    peersByAgentMetrics: peersByAgentMetrics(),
    versionsMetrics: versionsMetrics()
  }

  if (argEnableKademlia === true) {
    console.info('Enabling Kademlia DHT')
    services.dht = kadDHT({
      protocol: '/ipfs/kad/1.0.0',
      peerInfoMapper: removePrivateAddressesMapper
    })
  }

  if (argEnableAutonat === true) {
    console.info('Enabling Autonat')
    services.autonat = autoNAT()
  }

  const node = await createLibp2p({
    datastore: new LevelDatastore('js-libp2p-datastore'),
    privateKey,
    addresses: {
      announceFilter: (addrs) => {
        // filter out private IP addresses
        return addrs.filter((addr) => {
          const nodeAddress = addr.nodeAddress()
          return isPrivateIp(nodeAddress.address) !== true
        })
      },
      listen: config.Addresses.Swarm,
      announce: config.Addresses.Announce,
      noAnnounce: config.Addresses.NoAnnounce
    },
    connectionManager: config.connectionManager,
    connectionGater: {
      // do not try to dial private addresses
      denyDialMultiaddr (multiaddr) {
        const nodeAddress = multiaddr.nodeAddress()
        return isPrivateIp(nodeAddress.address) === true
      }
    },
    transports: [
      webSockets(),
      tcp()
    ],
    streamMuxers: [
      yamux()
    ],
    connectionEncrypters: [
      noise(),
      tls()
    ],
    metrics: prometheusMetrics(),
    services
  })

  console.info('libp2p is running')
  console.info('PeerId', node.peerId.toString())

  const waitForPublicInterval = setInterval(() => {
    const maddrs = node.getMultiaddrs()
    if (maddrs.length > 0) {
      console.info()
      console.info('libp2p listening on:')
      // output listening addresses every 10 seconds
      maddrs.forEach((ma) => { console.info(`${ma.toString()}`) })
      console.info()
      clearInterval(waitForPublicInterval)
      writeListeningAddrsToFile(maddrs).catch(fatal)
    } else {
      console.info('Waiting for public listening addresses...')
    }
  }, 1000)

  const metricsServer = createServer((req, res) => {
    if (req.url === argMetricsPath && req.method === 'GET') {
      register.metrics()
        .then((metrics) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end(metrics)
        }, (err) => {
          console.error('could not read metrics', err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Internal Server Error')
        })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })
  const metricsPort = parseInt(argMetricsPort ?? options['metrics-port'].default, 10)
  await new Promise<void>((resolve) => metricsServer.listen(metricsPort, '0.0.0.0', resolve))

  console.info('Metrics server listening', `0.0.0.0:${argMetricsPort}${argMetricsPath}`)

  await createRpcServer({ apiPort: parseInt(argApiPort ?? options['api-port'].default, 10), apiHost: argApiHost })
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

type BootstrapConfig = KuboConfig & {
  connectionManager: ConnectionManagerInit
}

function validateKey (config: any, key: string, path: string): void {
  if (config[key] == null) {
    fatal(`Config key missing: ${path}`)
  }
}

function validateKuboConfig (config: any): config is KuboConfig {
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

async function readConfig (filepath: string): Promise<BootstrapConfig> {
  const configString = await readFile(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateKuboConfig(config)
  return config
}

function decodePeerId (privkeyStr: string): PrivateKey {
  const privkeyBytes = uint8ArrayFromString(privkeyStr, 'base64pad')
  return privateKeyFromProtobuf(privkeyBytes)
}

async function writeListeningAddrsToFile (maddrs: Multiaddr[]): Promise<void> {
  const addrs = maddrs.map((ma) => ma.toString())
  const addrsString = addrs.join('\n')
  await writeFile('listening-addrs.txt', addrsString, 'utf8')
}
