#! /usr/bin/env node --trace-warnings
/* eslint-disable no-console */

import { createServer } from 'node:http'
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'
import { autoNATService } from 'libp2p/autonat'
import { circuitRelayServer } from 'libp2p/circuit-relay'
import { register } from 'prom-client'

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

  const services: Record<string, any> = {
    relay: circuitRelayServer({
      advertise: true
    })
  }

  if (args.values.enableKademlia === true) {
    services.dht = kadDHT()
  }

  if (args.values.enableAutonat === true) {
    services.autonat = autoNATService()
  }

  const node = await createLibp2p({
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

  console.info('Metrics server listening', `0.0.0.0:${args.values.metricsPort}/${args.values.metricsPath}`)
}

main().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
