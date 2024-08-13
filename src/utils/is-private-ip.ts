import isIpPrivate from 'private-ip'
import type { NodeAddress } from '@multiformats/multiaddr'

export function isPrivate (nodeAddress: NodeAddress): boolean {
  const ipAddr = nodeAddress.address
  return isIpPrivate(ipAddr) === true
}
