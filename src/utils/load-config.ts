import { readFileSync } from 'node:fs'
import type { BootstrapConfig } from './default-config.js'

export function readConfig (filepath: string): BootstrapConfig {
  const configString = readFileSync(filepath, 'utf8')
  const config = JSON.parse(configString)
  validateConfig(config)
  return config
}

function validateConfig (config: any): config is BootstrapConfig {
  validateKey(config, 'bootstrap', 'bootstrap')
  validateKey(config.bootstrap, 'list', 'bootstrap.list')
  validateKey(config, 'addresses', 'addresses')
  validateKey(config.addresses, 'listen', 'addresses.listen')
  validateKey(config.addresses, 'announce', 'addresses.announce')
  validateKey(config.addresses, 'noAnnounce', 'addresses.noAnnounce')
  validateKey(config, 'privateKey', 'privateKey')
  return true
}

function validateKey (config: any, key: string, path: string): void {
  if (config[key] == null) {
    throw new Error(`Config key missing: ${path}`)
  }
}
