/* eslint-disable no-console */

/**
 * @packageDocumentation
 * Health-check that ensures the bootstrapper is running and dialable.
 *
 * This binary can be executed via the docker --health-cmd option, but we automatically execute it
 * via the health-check DockerFile instruction
 *
 * See https://github.com/libp2p/rust-libp2p/tree/master/misc/server for more information
 *
 * - need to execute functionality similar to https://github.com/mxinden/libp2p-lookup/
 * as used by https://github.com/libp2p/rust-libp2p/tree/master/misc/server
 */
import { readFileSync } from 'node:fs'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import type { PeerId } from '@libp2p/interface'

// load the addresses the bootstrapper is listening on
const target: PeerId | Multiaddr | Multiaddr[] = readFileSync('listening-addrs.txt', 'utf8')
  .split('\n')
  .map(ma => multiaddr(ma))

// we will use this node to dial the bootstrapper
const node = await createLibp2p({
  transports: [
    webSockets(),
    tcp()
  ],
  streamMuxers: [
    yamux()
  ],
  connectionEncrypters: [
    noise()
  ]
})

console.info('Trying to dial', target)

try {
  await node.dial(target)

  // it works!
  process.exit(0)
} catch (e) {
  console.error('Could not dial any of the listening addresses', e)
  process.exit(1)
}
