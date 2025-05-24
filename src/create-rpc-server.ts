/* eslint-disable no-console */

import { createServer } from 'node:http'
import { decode } from 'node:querystring'
import { getHeapSnapshot } from 'node:v8'
import { setTimeout } from 'timers/promises'
import { enable } from '@libp2p/logger'
import type { Libp2p } from '@libp2p/interface'

export interface RpcServerOptions {
  apiPort?: number
  apiHost?: string
  libp2p: Libp2p
}

export async function createRpcServer ({ apiPort, apiHost, libp2p }: RpcServerOptions): Promise<void> {
  if (apiHost !== '127.0.0.1') {
    console.info('Warning: The RPC API host has been changed from 127.0.0.1. The RPC server is now running in insecure mode. This may expose critical control to external sources. Ensure that you implement proper authentication and authorization measures.')
  }

  const resources: Record<string, Record<string, Parameters<typeof createServer>[1]>> = {
    '/api/v0/nodejs/gc': {
      GET: (req, res) => {
        if (globalThis.gc == null) {
          // maybe we're running in a non-v8 engine or `--expose-gc` wasn't passed
          res.writeHead(503, { 'Content-Type': 'text/plain' })
          res.end('Service Unavailable')

          console.info('RPC /api/v0/nodejs/gc - garbage collection is not enabled')

          return
        }

        const start = Date.now()
        console.info('RPC /api/v0/nodejs/gc - performing garbage collection')

        // force nodejs to run garbage collection
        globalThis.gc?.()

        console.info(`RPC /api/v0/nodejs/gc - performed garbage collection in ${Date.now() - start}ms`)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('OK')
      }
    },
    '/api/v0/nodejs/heapdump': {
      GET: (req, res) => {
        void Promise.resolve()
          .then(async () => {
            global.gc?.()
            await setTimeout(1000)
            global.gc?.()

            const start = new Date()
            console.info('RPC /api/v0/nodejs/heapdump - creating heap snapshot')

            // force nodejs to generate a heapdump
            // you can analyze the heapdump with https://github.com/facebook/memlab#heap-analysis-and-investigation to get some really useful insights
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Content-Disposition': `attachment; filename="amino-${process.pid}-${formatDate(start)}.heapsnapshot"`
            })

            const stream = getHeapSnapshot()

            // destroy stream if the request is cancelled
            req.on('end', () => {
              stream.destroy()
            })

            stream.on('data', (buf) => {
              const sendMore = res.write(buf)

              // respect backpressure
              if (!sendMore) {
                stream.pause()
              }
            })
            // start sending data again when the send buffer empties
            res.on('drain', () => {
              stream.resume()
            })

            stream.on('end', () => {
              res.end()
              console.info(`RPC /api/v0/nodejs/heapdump - created heap snapshot in ${Date.now() - start.getTime()}ms`)
            })
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

        if (query.namespace.trim() === '') {
          console.info('RPC /api/v0/nodejs/log - Disable logging')
        } else {
          console.info('RPC /api/v0/nodejs/log - Enable logging with namespace', query.namespace)
        }

        // change the logging settings
        enable(query.namespace)

        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('OK')
      }
    },
    '/api/v0/libp2p/stop': {
      GET: (req, res) => {
        const start = Date.now()
        console.info('RPC /api/v0/libp2p/stop - stopping the libp2p node')

        Promise.resolve()
          .then(async () => {
            await libp2p.stop()

            console.info(`RPC /api/v0/libp2p/stop - stopping the libp2p node in ${Date.now() - start}ms`)
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('OK')
          })
          .catch(err => {
            console.error('RPC /api/v0/libp2p/stop - error stopping the libp2p node', err)
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('Internal server error')
          })
      }
    },
    '/api/v0/libp2p/start': {
      GET: (req, res) => {
        const start = Date.now()
        console.info('RPC /api/v0/libp2p/start - starting the libp2p node')

        Promise.resolve()
          .then(async () => {
            await libp2p.start()

            console.info(`RPC /api/v0/libp2p/start - started the libp2p node in ${Date.now() - start}ms`)
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('OK')
          })
          .catch(err => {
            console.error('RPC /api/v0/libp2p/stop - error starting the libp2p node', err)
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('Internal server error')
          })
      }
    }
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

function formatDate (date: Date): string {
  function pad (num: number): string {
    return num.toString().padStart(2, '0')
  }

  return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}
