import { readFileSync } from 'node:fs'
import type { BootstrapInit } from '@libp2p/bootstrap'
import type { AddressManagerInit, ConnectionManagerInit } from 'libp2p'

export function readConfig (filepath: string): BootstrapConfig {
  const configString = readFileSync(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateConfig(config)
  return config
}

function validateConfig (config: any): config is BootstrapConfig {
  validateKey(config, 'bootstrap', 'bootstrap')
  validateKey(config, 'bootstrap', 'bootstrap.list')
  validateKey(config, 'addresses', 'addresses')
  validateKey(config.addresses, 'listen', 'addresses.listen')
  validateKey(config.addresses, 'announce', 'addresses.announce')
  validateKey(config.addresses, 'noAnnounce', 'addresses.NoAnnounce')
  validateKey(config, 'identity', 'identity')
  validateKey(config.identity, 'peerId', 'identity.peerId')
  validateKey(config.identity, 'privKey', 'identity.privKey')
  return true
}

export interface BootstrapConfig {
  addresses: Omit<AddressManagerInit, 'announceFilter'>
  connectionManager: ConnectionManagerInit
  bootstrap: BootstrapInit
  identity: {
    peerId: string
    privKey: string
  }
}

function validateKey (config: any, key: string, path: string): void {
  if (config[key] == null) {
    throw new Error(`Config key missing: ${path}`)
  }
}
