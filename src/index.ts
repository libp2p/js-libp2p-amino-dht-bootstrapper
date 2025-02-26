/* eslint-disable no-console */

import { writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { autoNAT } from '@libp2p/autonat'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush } from '@libp2p/identify'
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht'
import { ping } from '@libp2p/ping'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { isPrivateIp } from '@libp2p/utils/private-ip'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { LevelDatastore } from 'datastore-level'
import { createLibp2p } from 'libp2p'
import { userAgent } from 'libp2p/user-agent'
import { register } from 'prom-client'
// @ts-expect-error no types
import info from '../package.json' with { type: 'json' }
import { createRpcServer } from './create-rpc-server.js'
import { connectionsByEncrypterMetrics } from './services/connections-by-encrypter-metrics.js'
import { connectionsByMultiplexerMetrics } from './services/connections-by-multiplexer-metrics.js'
import { connectionsByTransportMetrics } from './services/connections-by-transport-metrics.js'
import { versionsMetrics } from './services/versions-metrics.js'
import { autoConfig } from './utils/auto-config.js'
import { decodePrivateKey } from './utils/peer-id.js'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { Libp2pOptions, ServiceFactoryMap } from 'libp2p'

process.addListener('uncaughtException', (err) => {
  console.error(err)
  process.exit(1)
})

function writeListeningAddrsToFile (maddrs: Multiaddr[]): void {
  const addrs = maddrs.map((ma) => ma.toString())
  const addrsString = addrs.join('\n')
  writeFileSync('listening-addrs.txt', addrsString, 'utf8')
}

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
  'enable-tls': {
    description: 'Whether to enable the tls connection encrypter',
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
  datastore: {
    description: 'The path to the libp2p datastore directory',
    default: 'datastore',
    type: 'string'
  },
  'peer-log': {
    description: 'Enable logging connected peers and their user agents',
    default: false,
    type: 'boolean'
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
  config: argConfigFilename,
  'enable-kademlia': argEnableKademlia,
  'enable-autonat': argEnableAutonat,
  'enable-tls': argEnableTls,
  'metrics-path': argMetricsPath,
  'metrics-port': argMetricsPort,
  'api-port': argApiPort,
  'api-host': argApiHost,
  datastore: argDatastore,
  'peer-log': argPeerLog,
  help: argHelp
} = args.values

if (argHelp === true) {
  console.info(JSON.stringify(options, null, 2))
  process.exit(0)
}

const agentVersion = `${info.name}/${info.version} ${userAgent()}`

console.info('Starting', agentVersion)

const config = await autoConfig(argConfigFilename)

const privateKey = decodePrivateKey(config.privateKey)

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

const services: ServiceFactoryMap = {
  circuitRelay: circuitRelayServer(),
  bootstrap: bootstrap({
    ...config.bootstrap
  }),
  identify: identify(),
  identifyPush: identifyPush(),
  ping: ping(),
  dcutr: dcutr(),

  // extra metrics
  connectionsByTransportMetrics: connectionsByTransportMetrics(),
  connectionsByEncrypterMetrics: connectionsByEncrypterMetrics(),
  connectionsByMultiplexerMetrics: connectionsByMultiplexerMetrics(),
  versionsMetrics: versionsMetrics()
}

const libp2pOptions: Libp2pOptions = {
  datastore: new LevelDatastore(argDatastore ?? options.datastore.default),
  nodeInfo: {
    userAgent: agentVersion
  },
  privateKey,
  addresses: {
    ...config.addresses,
    announceFilter: (addrs) => {
      // filter out private IP addresses
      return addrs.filter((addr) => {
        const nodeAddress = addr.nodeAddress()
        return isPrivateIp(nodeAddress.address) !== true
      })
    }
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
    circuitRelayTransport(),
    webSockets(),
    webRTC(),
    webRTCDirect(),
    tcp()
  ],
  streamMuxers: [
    yamux()
  ],
  connectionEncrypters: [
    noise()
  ],
  metrics: prometheusMetrics(),
  services
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

if (argEnableTls === true) {
  console.info('Enabling TLS connection encryption')
  libp2pOptions.connectionEncrypters?.push(tls())
}

const node = await createLibp2p(libp2pOptions)

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
    writeListeningAddrsToFile(maddrs)
  } else {
    console.info('Waiting for public listening addresses...')
  }
}, 1000)

// replicate https://github.com/ipfs/kubo/blob/97527472fe4c037bb897aa2c7d4e0b2243b58f85/plugin/plugins/peerlog/peerlog.go
if (argPeerLog) {
  node.addEventListener('peer:connect', (evt) => {
    console.info(JSON.stringify({
      level: 'info',
      ts: new Date().toISOString(),
      logger: 'plugin/peerlog',
      caller: 'peerlog/peerlog.go:51',
      msg: 'connected',
      peer: evt.detail.toString()
    }))
  })

  node.addEventListener('peer:identify', (evt) => {
    console.info(JSON.stringify({
      level: 'info',
      ts: new Date().toISOString(),
      logger: 'plugin/peerlog',
      caller: 'peerlog/peerlog.go:56',
      msg: 'identified',
      peer: evt.detail.peerId.toString(),
      agent: evt.detail.agentVersion
    }))
  })
}
