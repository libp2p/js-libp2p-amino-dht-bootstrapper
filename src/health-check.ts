#! /usr/bin/env node --trace-warnings
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
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { peerIdFromString } from '@libp2p/peer-id'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'

// // @ts-expect-error unused
const { positionals } = parseArgs({
  allowPositionals: true
})

if (positionals.length > 1) {
  throw new Error('Do not support multiple peerIds nor multiaddrs')
}

const multiaddrOrPeerId = positionals[0]
let multiaddrs: Multiaddr[] = []
let peerId = null

try {
  multiaddrs = [
    multiaddr(multiaddrOrPeerId)
  ]
} catch (e) {
  // don't care about error, try peerId
  console.error('Could not convert input into multiaddr', e)
}

try {
  peerId = peerIdFromString(multiaddrOrPeerId)
} catch (error) {
  // peer id failed, maybe multiaddr didn't?
  console.error('Could not convert input into PeerId', error)
}

if (multiaddr == null && peerId == null) {
  throw new Error('Could not convert input into valid dialable artifact.')
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
  services: {
    dht: kadDHT({})
  }
})

if (peerId != null) {
  // if we receive a PeerId (which would be a string because its from command line) we need to do:
  //  * dht lookup
  //  * dial
  try {
    const resolvedPeer = await node.peerRouting.findPeer(peerId)
    multiaddrs = resolvedPeer.multiaddrs
  } catch (e) {
    console.error('Could not find peer via dht lookup', e)
  }
}

// if we receive a Multiaddr, dial it immediately
await node.dial(multiaddrs)

// it works!
process.exit(0)
