import Zdog from 'zdog'

import { createBook } from '../book'
import { getRandomCoordinate, getRandomRotation } from '../utils'
import { COLOR_PAIRS } from '../constants'

export const createBooksScene = (props: Zdog.AnchorOptions): Zdog.Anchor => {
  const scene = new Zdog.Anchor(props)

  const spaceDimension =
    window.innerWidth < window.innerHeight
      ? window.innerWidth
      : window.innerHeight

  for (let i = 0; i < 5; i++) {
    const colorPair =
      COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)]

    createBook({
      addTo: scene,
      ...colorPair,
      translate: {
        x: getRandomCoordinate(spaceDimension),
        y: getRandomCoordinate(spaceDimension),
        z: getRandomCoordinate(spaceDimension),
      },
      rotate: {
        x: getRandomRotation(),
        y: getRandomRotation(),
        z: getRandomRotation(),
      },
    })
  }

  return scene
}
