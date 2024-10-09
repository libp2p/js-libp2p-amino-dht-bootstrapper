import { readFileSync } from 'node:fs'
import type { Libp2pEvents, Metrics, TypedEventTarget } from '@libp2p/interface'

interface Components {
  metrics?: Metrics
  events: TypedEventTarget<Libp2pEvents>
}

/**
 * Report the number of currently connected peers by agent
 *
 * WARNING - this can result in a high level of cardinality which can kill
 * prometheus performance - https://www.robustperception.io/cardinality-is-key/
 */
export function versionsMetrics (): (components: Components) => unknown {
  return (components) => {
    if (components.metrics == null) {
      return
    }

    const libp2p = JSON.parse(readFileSync('node_modules/libp2p/package.json', {
      encoding: 'utf-8'
    }))

    const bootstrapper = JSON.parse(readFileSync('package.json', {
      encoding: 'utf-8'
    }))

    const metrics = components.metrics.registerMetricGroup('libp2p_versions')

    metrics.increment({
      [`@libp2p/amino-dht-bootstrapper=${bootstrapper.version}`]: true,
      [`libp2p=${libp2p.version}`]: true,
      [`node=${process.versions.node}`]: true
    })

    return {}
  }
}
