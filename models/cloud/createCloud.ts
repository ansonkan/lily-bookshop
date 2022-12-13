import type { CreateModel } from '../types'

import Zdog from 'zdog'

import { COLOR } from './constants'
import { getRandomInt } from '../utils'

interface CreateCloudProps extends Zdog.AnchorOptions {
  color?: Zdog.ShapeOptions['color']
}

export const createCloud: CreateModel<CreateCloudProps> = ({
  color = COLOR,
  ...others
}) => {
  const model = new Zdog.Anchor(others)

  const variant = getRandomInt(0, 1)

  new Zdog.Shape({
    addTo: model,
    stroke: 20,
    path: [
      { x: -200, z: 0 },
      {
        bezier: [
          { x: -130, z: 0 },
          { x: -120, z: 40 },
          { x: -100, z: 40 },
        ],
      },
      {
        bezier: [
          { x: -80, z: 40 },
          { x: -80, z: 20 },
          { x: -40, z: 20 },
        ],
      },
      {
        bezier: [
          { x: 0, z: 20 },
          { x: 10, z: 60 },
          { x: 40, z: 60 },
        ],
      },
      {
        bezier: [
          { x: 70, z: 60 },
          { x: 60, z: 0 },
          { x: 200, z: 0 },
        ],
      },
    ],
    color,
    fill: true,
    rotate: variant ? { z: Zdog.TAU / 2 } : {},
  })

  return { model }
}
