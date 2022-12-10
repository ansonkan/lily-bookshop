import Zdog from 'zdog'

import { COLOR_PAIRS } from '../constants'
import { getRandomInt, getRandomColor } from '../utils'

export interface CreateBookProps extends Zdog.AnchorOptions {
  primaryColor?: string
  secondaryColor?: string
  isOpen?: boolean
}

export const createBook = ({
  primaryColor,
  secondaryColor,
  isOpen,
  ...otherProps
}: CreateBookProps): Zdog.Anchor => {
  const book = new Zdog.Anchor(otherProps)

  if (!primaryColor && !secondaryColor) {
    const colorPairs = COLOR_PAIRS[getRandomInt(0, COLOR_PAIRS.length - 1)]

    primaryColor = colorPairs.primaryColor
    secondaryColor = colorPairs.secondaryColor
  } else if (!primaryColor) {
    primaryColor = getRandomColor()
  } else if (!secondaryColor) {
    secondaryColor = getRandomColor()
  }

  // spine
  const spine = new Zdog.Rect({
    addTo: book,
    width: 30,
    height: 130,
    stroke: 5,
    color: primaryColor,
    fill: true,
    rotate: isOpen ? undefined : { y: Zdog.TAU / 4 },
    translate: isOpen ? { z: -15, x: -65 } : { x: -50 },
  })

  const coverWith = 85
  const coverHeight = 130
  const covers = [-1, 1]

  if (isOpen) {
    const coverGroup = new Zdog.Group({
      addTo: spine,
      // translate: { z: 15 },
    })
    covers.forEach((multiplier) => {
      // crease
      new Zdog.Rect({
        addTo: coverGroup,
        width: 5,
        height: coverHeight,
        stroke: 5,
        fill: true,
        translate: { x: 23 * multiplier },
        color: secondaryColor,
      })

      // cover
      new Zdog.Rect({
        addTo: coverGroup,
        width: coverWith,
        height: coverHeight,
        stroke: 5,
        color: primaryColor,
        translate: { x: 73 * multiplier },
        fill: true,
      })
    })
  } else {
    covers.forEach((multiplier) => {
      const coverGroup = new Zdog.Group({
        addTo: book,
        translate: { z: 15 * multiplier, x: 7 },
      })

      // cover
      new Zdog.Rect({
        addTo: coverGroup,
        width: coverWith,
        height: coverHeight,
        stroke: 5,
        color: primaryColor,
        fill: true,
      })

      // crease
      new Zdog.Rect({
        addTo: coverGroup,
        width: 5,
        height: coverHeight,
        stroke: 5,
        fill: true,
        translate: { x: -50 },
        color: secondaryColor,
      })

      // to z-fight with stacks of pages
      const dots = [0, coverWith, coverWith * -1]

      dots.forEach((dotMultiplier) => {
        new Zdog.Shape({
          addTo: coverGroup,
          visible: false,
          translate: { z: 5 * multiplier, x: coverWith * dotMultiplier },
        })
      })
    })
  }

  if (isOpen) {
    const stackOfPage = new Zdog.Group({
      addTo: book,
    })

    const paper = new Zdog.Rect({
      addTo: stackOfPage,
      width: 80,
      height: 120,
      stroke: 10,
      color: '#fefae0',
      // color: 'hsl(200, 100%, 50%, 100%)',
      fill: true,
      translate: { z: -5, x: -15 },
    })

    paper.copy({
      addTo: stackOfPage,
      translate: { z: -5, x: -115 },
    })
  } else {
    const paper = new Zdog.Rect({
      addTo: book,
      width: 80,
      height: 120,
      stroke: 10,
      color: '#fefae0',
      fill: true,
      translate: { z: -5 },
    })

    paper.copy({
      translate: { z: 5 },
    })
  }

  return book
}
