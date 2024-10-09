import type { Libp2pEvents, Metrics, TypedEventTarget } from '@libp2p/interface'

interface Components {
  metrics?: Metrics
  events: TypedEventTarget<Libp2pEvents>
}

/**
 * Report the type of encrypters currently in use
 */
export function connectionsByEncrypterMetrics (): (components: Components) => unknown {
  return (components) => {
    if (components.metrics == null) {
      return
    }

    const metrics = components.metrics?.registerMetricGroup('libp2p_connection_encrypters_total')

    components.events.addEventListener('connection:open', (evt) => {
      const conn = evt.detail

      metrics.increment({ [conn.encryption ?? 'none']: true })
    })

    components.events.addEventListener('connection:close', (evt) => {
      const conn = evt.detail

      metrics.decrement({ [conn.encryption ?? 'none']: true })
    })

    return {}
  }
}
