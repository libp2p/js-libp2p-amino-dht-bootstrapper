/* eslint-disable no-console */
/**
 * If a config option isn't used, and a user doesn't already have a config file,
 * we should automatically generate one by calling `ipfs init` or similar with
 * the Kubo npm package.
 */
import { readFile, writeFile, mkdir, access, constants } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateKeyPair } from '@libp2p/crypto/keys'
import { peerIdFromPrivateKey } from '@libp2p/peer-id'
import { readConfig, type BootstrapConfig } from './config.js'
import { encodePrivateKey } from './peer-id.js'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url))

export const DEFAULT_CONFIG_NAME = 'config.json'

export const CONFIG_FOLDER = join(homedir(), '.config', 'amino')
export async function getConfigPath (): Promise<string> {
  return join(CONFIG_FOLDER, DEFAULT_CONFIG_NAME)
}

/**
 * check if DEFAULT_CONFIG_NAME exists, if it does, use it automatically
 * if not, copy example-config.json to ~/.config.json
 * create a private key and peer ID and add it to the config
 *
 * @returns {Promise<BootstrapConfig>} The parsed config object
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

  const configPath = await getConfigPath()
  console.info('Checking for config file at %s', configPath)
  try {
    const config = await readConfig(configPath)
    console.info('Config file found')
    return config
  } catch {
    // eslint-disable-next-line no-console
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
    const exampleConfigPath = join(__dirname, '..', '..', '..', 'example-config.json')
    console.info('Getting config template from %s', exampleConfigPath)
    const configString = await readFile(exampleConfigPath, 'utf8')
    const configJson = JSON.parse(configString)

    console.info('Generating private key and peer ID...')
    const libp2pGeneratedPrivateKey = await generateKeyPair('Ed25519')
    configJson.Identity.PrivKey = encodePrivateKey(libp2pGeneratedPrivateKey)
    configJson.Identity.PeerID = peerIdFromPrivateKey(libp2pGeneratedPrivateKey).toString()

    console.info('Writing config file')
    await writeFile(configPath, JSON.stringify(configJson, null, 2))
    console.info('Config file created successfully at %s', configPath)
    return configJson
  } catch (e) {
    console.error('Error creating config', e)
    throw e
  }
}
