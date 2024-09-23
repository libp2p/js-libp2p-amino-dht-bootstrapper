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
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { peerIdFromString } from '@libp2p/peer-id'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import type { PeerId } from '@libp2p/interface'

function readPositional (): PeerId | Multiaddr | undefined {
  const { positionals } = parseArgs({
    allowPositionals: true
  })

  if (positionals.length === 0) {
    return
  }

  if (positionals.length > 1) {
    throw new Error('Multiple peerIds nor multiaddrs are not supported')
  }

  try {
    return peerIdFromString(positionals[0])
  } catch {
    try {
      return multiaddr(positionals[0])
    } catch {}
  }
}

function readListeningAddrs (): Multiaddr[] {
  try {
    // read from file
    return readFileSync('listening-addrs.txt', 'utf8')
      .split('\n')
      .map(ma => multiaddr(ma))
  } catch (err) {
    console.error('Could read listening-addrs.txt', err)
    process.exit(1)
  }
}

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

const target: PeerId | Multiaddr | Multiaddr[] = readPositional() ?? readListeningAddrs()

console.info('Trying to dial', target)

try {
  await node.dial(target)

  // it works!
  process.exit(0)
} catch (e) {
  console.error('Could not dial any of the listening addresses', e)
  process.exit(1)
}
