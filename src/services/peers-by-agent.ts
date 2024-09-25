import { peerMap } from '@libp2p/peer-collections'
import type { Libp2pEvents, Metrics, TypedEventTarget } from '@libp2p/interface'

interface Components {
  metrics?: Metrics
  events: TypedEventTarget<Libp2pEvents>
}

/**
 * A peer with this agent has either not completed identify, doesn't support
 * the protocol or didn't send us their agent
 */
const DEFAULT_AGENT = 'unknown'

/**
 * Report the number of currently connected peers by agent
 *
 * WARNING - this can result in a high level of cardinality which can kill
 * prometheus performance - https://www.robustperception.io/cardinality-is-key/
 */
export function peersByAgentMetrics (): (components: Components) => unknown {
  return (components) => {
    if (components.metrics == null) {
      return
    }

    const agents = peerMap<string>()

    components.events.addEventListener('peer:identify', (evt) => {
      const agent = evt.detail.agentVersion ?? DEFAULT_AGENT
      agents.set(evt.detail.peerId, agent)
    })

    components.events.addEventListener('peer:connect', (evt) => {
      agents.set(evt.detail, DEFAULT_AGENT)
    })

    components.events.addEventListener('peer:disconnect', (evt) => {
      agents.delete(evt.detail)
    })

    components.metrics?.registerMetricGroup('libp2p_peer_agents_total', {
      calculate: () => {
        const output: Record<string, number> = {}

        for (const agent of agents.values()) {
          output[agent] = (output[agent] ?? 0) + 1
        }

        return output
      }
    })

    return {}
  }
}
