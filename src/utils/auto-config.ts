/* eslint-disable no-console */
/**
 * If a config option isn't used, and a user doesn't already have a config file,
 * we should automatically generate one by calling `ipfs init` or similar with
 * the Kubo npm package.
 */
import { writeFile, mkdir, access, constants } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, isAbsolute } from 'node:path'
import { generateKeyPair } from '@libp2p/crypto/keys'
import { defaultConfig } from './default-config.js'
import { readConfig } from './load-config.js'
import { encodePrivateKey } from './peer-id.js'
import type { BootstrapConfig } from './default-config.js'

export const CONFIG_FOLDER = join(homedir(), '.config', '@libp2p', 'amino-dht-bootstrapper')
export const DEFAULT_CONFIG_NAME = 'config.json'
export const CONFIG_PATH = join(CONFIG_FOLDER, DEFAULT_CONFIG_NAME)

/**
 * check if DEFAULT_CONFIG_NAME exists, if it does, use it automatically
 * if not, copy `defaultConfig` to `${CONFIG_FOLDER}/config.json`
 * create a private key and peer ID and add it to the config
 */
export async function autoConfig (configPathArg?: string): Promise<BootstrapConfig> {
  if (configPathArg != null) {
    console.info('Attempting to use config file from %s', configPathArg)
    /**
     * If a config path is provided, attempt to use it.
     * If it's not an absolute path, assume it's relative to the current working directory.
     */
    const configFilepath = isAbsolute(configPathArg) ? configPathArg : join(process.cwd(), configPathArg)
    return readConfig(configFilepath)
  }

  console.info('Checking for config file at %s', CONFIG_PATH)
  try {
    const config = readConfig(CONFIG_PATH)
    console.info('Config file found')
    return config
  } catch {
    console.info('No config file found, generating one automatically...')
  }

  // check for config folder existence, if it doesn't exist, create it.
  try {
    console.info('Checking for config folder at %s', CONFIG_FOLDER)
    await access(CONFIG_FOLDER, constants.R_OK | constants.W_OK)
  } catch (e) {
    console.info('Config folder not found, creating it...')
    await mkdir(CONFIG_FOLDER, { recursive: true })
  }

  try {
    console.info('Using default config object: %O', defaultConfig)
    const configJson = { ...defaultConfig }

    console.info('Generating private key and peer ID...')
    const libp2pGeneratedPrivateKey = await generateKeyPair('Ed25519')
    configJson.privateKey = encodePrivateKey(libp2pGeneratedPrivateKey)

    console.info('Writing config file')
    await writeFile(CONFIG_PATH, JSON.stringify(configJson, null, 2))
    console.info('Config file created successfully at %s', CONFIG_PATH)
    return configJson
  } catch (e) {
    console.error('Error creating config', e)
    throw e
  }
}
