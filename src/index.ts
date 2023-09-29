#! /usr/bin/env node --trace-warnings
/* eslint-disable no-console */

import { parseArgs } from 'node:util'
import { createLibp2p } from 'libp2p'

async function main (): Promise<void> {
  const args = parseArgs({
    allowPositionals: true,
    strict: true,
    options: {
      help: {
        description: 'Show help text',
        type: 'boolean'
      }
    }
  })

  const node = await createLibp2p({})
}

main().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
