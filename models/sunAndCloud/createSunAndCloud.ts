import type { CreateModel } from '../types'

import Zdog from 'zdog'

import { createCloud } from '../cloud'

export const createSunAndCloud: CreateModel = (props) => {
  const model = new Zdog.Anchor(props)

  // sun
  new Zdog.Shape({
    addTo: model,
    stroke: 150,
    color: 'orange',
  })

  createCloud({
    addTo: model,
    rotate: {},
    translate: {
      x: 50,
      y: 100,
      z: 20,
    },
  })

  createCloud({
    addTo: model,
    translate: {
      x: -100,
      y: -100,
      z: -50,
    },
  })

  return { model }
}
