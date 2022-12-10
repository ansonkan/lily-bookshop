import type { CreateModel } from '../types'

import Zdog from 'zdog'

import { getRandomColor } from '../utils'

const sunStrokeBase = 150
const multiplier = 1.3
const sunStrokes = [1, 1, 1, 1]
  .map((_, index) => Math.pow(multiplier, index) * sunStrokeBase)
  .reverse()

export const createSun: CreateModel = (props) => {
  const scene = new Zdog.Group(props)

  const suns = sunStrokes.map(
    (stroke) =>
      new Zdog.Shape({
        addTo: scene,
        stroke,
        color: getRandomColor({ a: 100 / multiplier }),
      })
  )

  // animate
  let ticker = 0

  return {
    model: scene,
    animate: () => {
      // the most center sun stays the same
      for (let i = 0; i < suns.length - 1; i++) {
        suns[i].stroke =
          sunStrokes[i] + Math.sin(ticker / 100 - i / 2) * 100 + 60
      }

      ticker++
    },
  }
}
