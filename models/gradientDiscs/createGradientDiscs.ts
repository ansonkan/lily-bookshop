import type { CreateModel } from '../types'

import Zdog from 'zdog'

import { COLORS } from './constants'

export interface CreateGradientDiscsProps extends Zdog.AnchorOptions {
  colors?: string[]
}

export const createGradientDiscs: CreateModel<CreateGradientDiscsProps> = ({
  colors = COLORS,
  ...others
}) => {
  const model = new Zdog.Group(others)

  for (let i = colors.length; i > 0; i--) {
    new Zdog.Ellipse({
      addTo: model,
      color: colors[i - 1],
      stroke: 20,
      fill: true,
      diameter:
        Math.min(Math.max(window.innerWidth, window.innerHeight), 1000) *
        0.9 *
        Math.pow(1.1, i),
      translate: { z: -50 * i },
    })
  }

  return { model }
}
