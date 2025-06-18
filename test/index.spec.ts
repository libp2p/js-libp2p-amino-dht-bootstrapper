import { execa } from 'execa'

describe('amino DHT bootstrapper', () => {
  let controller: AbortController

  beforeEach(() => {
    controller = new AbortController()
  })

  afterEach(() => {
    controller.abort()
  })

  it('should start the bootstrapper', async () => {
    const config = {
      bootstrap: {
        list: [
          "/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dns4/sg1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
          "/dns4/sv15.bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN"
        ]
      }
    }

    const proc = execa('node', ['dist/src/index.js'], {
      cancelSignal: controller.signal
    })

    proc.stdout.on('data', buf => {
      console.info(buf.toString())
    })
    proc.stderr.on('data', buf => {
      console.error(buf.toString())
    })

    await proc
  })
})
