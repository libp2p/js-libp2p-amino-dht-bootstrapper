import { WebSockets, WebRTC, WebRTCDirect, WebTransport, WebSocketsSecure, TCP, QUIC, Circuit, QUIC_V1 } from '@multiformats/multiaddr-matcher'
import type { Libp2pEvents, Metrics, TypedEventTarget } from '@libp2p/interface'

interface Components {
  metrics?: Metrics
  events: TypedEventTarget<Libp2pEvents>
}

/**
 * Report the type of transports currently in use
 */
export function connectionsByTransportMetrics (): (components: Components) => unknown {
  return (components) => {
    if (components.metrics == null) {
      return
    }

    const metrics = components.metrics?.registerMetricGroup('libp2p_connection_transports_total')

    components.events.addEventListener('connection:open', (evt) => {
      const conn = evt.detail

      if (WebSockets.matches(conn.remoteAddr)) {
        metrics.increment({ WebSockets: true })
      } else if (WebSocketsSecure.matches(conn.remoteAddr)) {
        metrics.increment({ WebSocketsSecure: true })
      } else if (WebRTC.matches(conn.remoteAddr)) {
        metrics.increment({ WebRTC: true })
      } else if (WebRTCDirect.matches(conn.remoteAddr)) {
        metrics.increment({ WebRTCDirect: true })
      } else if (WebTransport.matches(conn.remoteAddr)) {
        metrics.increment({ WebTransport: true })
      } else if (TCP.matches(conn.remoteAddr)) {
        metrics.increment({ TCP: true })
      } else if (QUIC.matches(conn.remoteAddr)) {
        metrics.increment({ QUIC: true })
      } else if (QUIC_V1.matches(conn.remoteAddr)) {
        metrics.increment({ QUIC_V1: true })
      } else if (Circuit.matches(conn.remoteAddr)) {
        metrics.increment({ CircuitRelay: true })
      }
    })

    components.events.addEventListener('connection:close', (evt) => {
      const conn = evt.detail

      if (WebSockets.matches(conn.remoteAddr)) {
        metrics.decrement({ WebSockets: true })
      } else if (WebSocketsSecure.matches(conn.remoteAddr)) {
        metrics.decrement({ WebSocketsSecure: true })
      } else if (WebRTC.matches(conn.remoteAddr)) {
        metrics.decrement({ WebRTC: true })
      } else if (WebRTCDirect.matches(conn.remoteAddr)) {
        metrics.decrement({ WebRTCDirect: true })
      } else if (WebTransport.matches(conn.remoteAddr)) {
        metrics.decrement({ WebTransport: true })
      } else if (TCP.matches(conn.remoteAddr)) {
        metrics.decrement({ TCP: true })
      } else if (QUIC.matches(conn.remoteAddr)) {
        metrics.decrement({ QUIC: true })
      } else if (QUIC_V1.matches(conn.remoteAddr)) {
        metrics.decrement({ QUIC_V1: true })
      } else if (Circuit.matches(conn.remoteAddr)) {
        metrics.decrement({ CircuitRelay: true })
      }
    })

    return {}
  }
}
