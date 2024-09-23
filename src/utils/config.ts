import { readFile } from 'node:fs/promises'
import { fatal } from './errors.js'

/** Subset of options that we care about from an kubo config */
export interface KuboConfig {
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
function validateKey (config: any, key: string, path: string): void {
  if (config[key] == null) {
    fatal(`Config key missing: ${path}`)
  }
}

function validateConfig (config: any): config is KuboConfig {
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

export async function readConfig (filepath: string): Promise<KuboConfig> {
  const configString = await readFile(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateConfig(config)
  return config
}
