import { privateKeyFromProtobuf, privateKeyToProtobuf } from '@libp2p/crypto/keys'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import type { PrivateKey } from '@libp2p/interface'

/**
 * Decode's a privateKey string representation into a PrivateKey object
 * for use by js-libp2p.
 *
 * The string representation is a base64pad encoded protobuf representation of
 * the private key. This aligns with the way Kubo stores private keys in
 * `~/home/.ipfs/config`.
 */
export function decodePrivateKey (privkeyStr: string): PrivateKey {
  const privkeyBytes = uint8ArrayFromString(privkeyStr, 'base64pad')
  return privateKeyFromProtobuf(privkeyBytes)
}

/**
 * Inverse of `decodePrivateKey`. Encodes a PrivateKey object into a string
 */
export function encodePrivateKey (privkey: PrivateKey): string {
  const privKeyBytes = privateKeyToProtobuf(privkey)
  return uint8ArrayToString(privKeyBytes, 'base64pad')
}
