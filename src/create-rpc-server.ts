import { createServer } from 'node:http'
import { writeHeapSnapshot } from 'node:v8'

export interface RpcServerOptions {
  apiPort?: number
}

export async function createRpcServer ({ apiPort }: RpcServerOptions): Promise<void> {
  const rpcUsername = process.env.RPC_USERNAME
  const rpcPassword = process.env.RPC_PASSWORD

  if (rpcUsername == null || rpcPassword == null) {
    // eslint-disable-next-line no-console
    console.info('RPC_USERNAME and RPC_PASSWORD are not set. Not starting the RPC server.')
    return
  }

  const apiServer = createServer((req, res) => {
    const authenticate = (): void => {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' })
      res.end('Unauthorized')
    }

    const checkAuth = (): boolean => {
      const authHeader = req.headers.authorization
      if (authHeader == null) {
        return false
      }

      const [scheme, encoded] = authHeader.split(' ')
      if (scheme !== 'Basic' || encoded == null) {
        return false
      }

      const decoded = Buffer.from(encoded, 'base64').toString('utf8')
      const [username, password] = decoded.split(':')

      return username === rpcUsername && password === rpcPassword
    }

    if (!checkAuth()) {
      authenticate()
      return
    }
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

  await new Promise<void>((resolve) => apiServer.listen(apiPort, '0.0.0.0', resolve))

  // eslint-disable-next-line no-console
  console.info(`RPC api listening on: 0.0.0.0:${apiPort}`)
}
