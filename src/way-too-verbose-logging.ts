/* eslint-disable no-console */
import type { Libp2p } from '@libp2p/interface'

export function wayTooVerboseLogging (node: Libp2p): void {
  // node.addEventListener('active', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('add', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('added', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('advert:error', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('advert:success', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('close', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('completed', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('connection', (evt) => {
  //   console.info(evt)
  // })
  node.addEventListener('connection:close', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('connection:open', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('connection:prune', (evt) => {
    console.info(evt.detail)
  })
  // node.addEventListener('empty', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('error', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('failure', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('idle', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('listening', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('next', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('peer', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('peer:add', (evt) => {
  //   console.info(evt)
  // })
  node.addEventListener('peer:connect', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('peer:disconnect', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('peer:discovery', (evt) => {
    console.info(evt.detail)
  })
  // node.addEventListener('peer:remove', (evt) => {
  //   console.info(evt)
  // })
  node.addEventListener('peer:update', (evt) => {
    console.info(evt.detail)
  })
  // node.addEventListener('ping', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('relay:advert:error', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('relay:advert:success', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('relay:discover', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('relay:not-enough-relays', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('relay:removed', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('removed', (evt) => {
  //   console.info(evt)
  // })
  node.addEventListener('self:peer:update', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('start', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('stop', (evt) => {
    console.info(evt.detail)
  })
  // node.addEventListener('success', (evt) => {
  //   console.info(evt)
  // })
  node.addEventListener('transport:close', (evt) => {
    console.info(evt.detail)
  })
  node.addEventListener('transport:listening', (evt) => {
    console.info(evt.detail)
  })
  // node.addEventListener('updated', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('walk:error', (evt) => {
  //   console.info(evt)
  // })
  // node.addEventListener('walk:peer', (evt) => {
  //   console.info(evt)
  // })
}
