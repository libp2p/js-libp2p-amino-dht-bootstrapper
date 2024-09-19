import { createServer } from 'node:http'
import { writeHeapSnapshot } from 'node:v8'

export interface RpcServerOptions {
  apiPort?: number
  apiHost?: string
}

export async function createRpcServer ({ apiPort, apiHost }: RpcServerOptions): Promise<void> {
  if (apiHost !== '127.0.0.1') {
    // eslint-disable-next-line no-console
    console.info('Warning: The RPC API host has been changed from 127.0.0.1. The RPC server is now running in insecure mode. This may expose critical control to external sources. Ensure that you implement proper authentication and authorization measures.')
  }

  const apiServer = createServer((req, res) => {
    if (req.method === 'GET') {
      if (req.url === '/api/v0/nodejs/gc') {
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
      } else if (req.url === '/api/v0/nodejs/heapdump') {
        // force nodejs to generate a heapdump
        // you can analyze the heapdump with https://github.com/facebook/memlab#heap-analysis-and-investigation to get some really useful insights
        const filename = writeHeapSnapshot(`./snapshot-dir/${(new Date()).toISOString()}.heapsnapshot`)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(`OK ${filename}`)
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })

  await new Promise<void>((resolve) => apiServer.listen(apiPort, apiHost, resolve))

  // eslint-disable-next-line no-console
  console.info(`RPC api listening on: ${apiHost}:${apiPort}`)
}
