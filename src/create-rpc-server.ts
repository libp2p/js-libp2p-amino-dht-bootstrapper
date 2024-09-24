/* eslint-disable no-console */

import { createServer } from 'node:http'
import { decode } from 'node:querystring'
import { getHeapSnapshot } from 'node:v8'
import { enable } from '@libp2p/logger'

export interface RpcServerOptions {
  apiPort?: number
  apiHost?: string
}

const resources: Record<string, Record<string, Parameters<typeof createServer>[1]>> = {
  '/api/v0/nodejs/gc': {
    GET: (req, res) => {
      if (globalThis.gc == null) {
        // maybe we're running in a non-v8 engine or `--expose-gc` wasn't passed
        res.writeHead(503, { 'Content-Type': 'text/plain' })
        res.end('Service Unavailable')

        return
      }

      // force nodejs to run garbage collection
      globalThis.gc?.()
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('OK')
    }
  },
  '/api/v0/nodejs/heapdump': {
    GET: (req, res) => {
      // force nodejs to generate a heapdump
      // you can analyze the heapdump with https://github.com/facebook/memlab#heap-analysis-and-investigation to get some really useful insights
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${(new Date()).toISOString()}.heapsnapshot"`
      })

      const stream = getHeapSnapshot()
      res.on('drain', () => {
        stream.resume()
      })
      stream.on('data', (buf) => {
        const sendMore = res.write(buf)

        // respect backpressure
        if (!sendMore) {
          stream.pause()
        }
      })
      stream.on('end', () => {
        res.end()
      })
    }
  },
  '/api/v0/nodejs/log': {
    GET: (req, res) => {
      const query = decode(req.url?.split('?').pop() ?? '')

      if (!(typeof query.namespace === 'string')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Bad Request')

        return
      }

      enable(query.namespace)

      // change the logging settings
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('OK')
    }
  }
}

export async function createRpcServer ({ apiPort, apiHost }: RpcServerOptions): Promise<void> {
  if (apiHost !== '127.0.0.1') {
    // eslint-disable-next-line no-console
    console.info('Warning: The RPC API host has been changed from 127.0.0.1. The RPC server is now running in insecure mode. This may expose critical control to external sources. Ensure that you implement proper authentication and authorization measures.')
  }

  const apiServer = createServer((req, res) => {
    if (req.url == null || req.method == null) {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Bad Request')

      return
    }

    // remove query string
    const path = req.url.split('?')[0]
    const resource = resources[path]

    if (resource == null) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')

      return
    }

    // find the handler for the method
    const handler = resource[req.method]

    if (handler == null) {
      res.writeHead(405, { 'Content-Type': 'text/plain' })
      res.end('Method Not Allowed')

      return
    }

    try {
      handler(req, res)
    } catch (err) {
      console.error('Error handling', req.method, req.url, err)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('InternalServer Error')
    }
  })

  await new Promise<void>((resolve) => apiServer.listen(apiPort, apiHost, resolve))

  console.info(`RPC api listening on: ${apiHost}:${apiPort}`)
}
