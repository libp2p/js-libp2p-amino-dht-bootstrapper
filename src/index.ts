#! /usr/bin/env node --trace-warnings
/* eslint-disable no-console */

import { parseArgs } from 'node:util'
import { createServer } from 'node:http'
import { createLibp2p } from 'libp2p'
import { circuitRelayServer } from 'libp2p/circuit-relay'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { kadDHT } from '@libp2p/kad-dht'
import { autoNATService } from 'libp2p/autonat'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { register } from 'prom-client'

async function main (): Promise<void> {
  const args = parseArgs({
    allowPositionals: true,
    strict: true,
    options: {
      help: {
        description: 'Show help text',
        type: 'boolean'
      },
      config: {
        description: 'Path to IPFS config file',
        type: 'string'
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
      enableKademlia: {
        description: 'Whether to run the libp2p Kademlia protocol and join the IPFS DHT',
        type: 'boolean'
      },
      enableAutonat: {
        description: 'Whether to run the libp2p Autonat protocol',
        type: 'boolean'
      }
    }
  })

  if (args.values.help) {
    console.info('Help!')
    return
  }

  const services: Record<string, any> = {
    relay: circuitRelayServer({
      advertise: true
    })
  }

  if (args.values.enableKademlia) {
    services.dht = kadDHT()
  }

  if (args.values.enableAutonat) {
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
      register.metrics().then((metrics) => res.end(metrics))
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })
  await new Promise<void>((resolve) => metricsServer.listen(parseInt(args.values.metricsPort ?? '8888', 10), '0.0.0.0', resolve))

  console.info('Metrics server listening', `0.0.0.0:${args.values.metricsPort}/${args.values.metricsPath}`)

}

main().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
