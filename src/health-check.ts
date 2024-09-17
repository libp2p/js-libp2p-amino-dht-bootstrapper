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
import { readFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { peerIdFromString } from '@libp2p/peer-id'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'
import { createLibp2p, type Libp2p } from 'libp2p'
import type { PeerId } from '@libp2p/interface'

async function getMaddrFromPeerId (node: Libp2p, peerId: PeerId): Promise<Multiaddr[]> {
  /**
   * if we receive a PeerId (which would be a string because its from command line) we need to do:
   * * dht lookup
   * * dial
   */
  const resolvedPeer = await node.peerRouting.findPeer(peerId)

  return resolvedPeer.multiaddrs
}

async function tryToDialMaddrOrPeerId (multiaddrOrPeerId: string): Promise<void> {
  let multiaddrs: Multiaddr[] = []
  let peerId = null
  let maddr: Multiaddr | null = null

  try {
    maddr = multiaddr(multiaddrOrPeerId)
    multiaddrs = [maddr]
  } catch (e) {
    // don't care about error, try peerId
    console.error('Could not convert input into multiaddr', e)
  }

  try {
    if (maddr == null) {
      // don't try to parse peerId if we already have a multiaddr, to prevent flooding output with unnecessary errors
      peerId = peerIdFromString(multiaddrOrPeerId)
    }
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
    connectionEncrypters: [
      noise()
    ],
    services: {
      dht: kadDHT({ clientMode: true })
    }
  })

  if (peerId != null) {
    multiaddrs = await getMaddrFromPeerId(node, peerId)
  }

  // if we receive a Multiaddr, dial it immediately
  const conn = await node.dial(multiaddrs, {
    onProgress: (evt) => {
      console.info(evt.type, evt.detail)
    }
  })
  console.info('Successfully dialed server', multiaddrs)
  // close the connection
  await conn.close()

  // shut the node down
  await node.stop()
}

async function tryToDialListeningAddrs (): Promise<void> {
  // read from file
  const listeningAddrs = await readFile('listening-addrs.txt', 'utf8')
  const addrs = listeningAddrs.split('\n')
  console.info('Trying to dial listening addresses:', addrs)
  try {
    await Promise.any(addrs.map(async (addr) => tryToDialMaddrOrPeerId(addr)))
    // it works!
    process.exit(0)
  } catch (e) {
    console.error('Could not dial any of the listening addresses', e)
    process.exit(1)
  }
}

const { positionals } = parseArgs({
  allowPositionals: true
})

if (positionals.length > 1) {
  throw new Error('Do not support multiple peerIds nor multiaddrs')
}

const multiaddrOrPeerId = positionals[0]

if (multiaddrOrPeerId != null) {
  try {
    await tryToDialMaddrOrPeerId(multiaddrOrPeerId)
  } catch (e) {
    console.error('Could not dial', e)
    console.info('Trying to dial listening addresses')
    await tryToDialListeningAddrs()
  }
} else {
  await tryToDialListeningAddrs()
}
