import { readFileSync } from 'node:fs'
import type { ConnectionManagerInit } from 'libp2p'

export function readConfig (filepath: string): BootstrapConfig {
  const configString = readFileSync(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateKuboConfig(config)
  return config
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

/**
 * Subset of options that we care about from the kubo config
 */
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
    throw new Error(`Config key missing: ${path}`)
  }
}
