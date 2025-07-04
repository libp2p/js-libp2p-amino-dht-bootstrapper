import type { BootstrapInit } from '@libp2p/bootstrap'
import type { AddressManagerInit, ConnectionManagerInit } from 'libp2p'

export interface BootstrapConfig {
  addresses: Omit<AddressManagerInit, 'announceFilter'>
  connectionManager: ConnectionManagerInit
  bootstrap: BootstrapInit
  privateKey: string
}

export const defaultConfig: BootstrapConfig = {
  addresses: {
    announce: [],
    noAnnounce: [],
    listen: [
      '/ip4/0.0.0.0/tcp/4001',
      '/ip4/0.0.0.0/tcp/4002/ws',
      '/ip4/0.0.0.0/udp/4003/quic-v1',
      '/ip4/0.0.0.0/udp/4004/webrtc-direct',
      '/ip6/::/tcp/4001',
      '/ip6/::/tcp/4002/ws',
      '/ip6/::/udp/4003/quic-v1',
      '/ip6/::/udp/4004/webrtc-direct'
    ]
  },
  bootstrap: {
    list: [
      '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
      '/dns4/sg1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
      '/dns4/sv15.bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
      // va1 is not in the TXT records for _dnsaddr.bootstrap.libp2p.io yet
      // so use the host name directly
      '/dnsaddr/va1.bootstrap.libp2p.io/p2p/12D3KooWKnDdG3iXw9eTFijk3EWSunZcFi54Zka4wmtqtt6rPxc8',
      '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ'
    ]
  },
  privateKey: 'generated by `auto-config.ts`',
  connectionManager: {
    inboundConnectionThreshold: 100,
    maxIncomingPendingConnections: 100,
    maxConnections: 500
  }
}
