import type { CreateModel } from '../types'

import Zdog from 'zdog'

const stroke = 10
const height = 50
const diameter = 50

const smokeLineHeight = 40

export const createMug: CreateModel = (props) => {
  const scene = new Zdog.Anchor(props)

  const primaryColor = 'hsl(85, 90%, 73%, 100%)'
  const secondaryColor = 'hsl(95, 43%, 43%, 100%)'

  const upper = new Zdog.Ellipse({
    addTo: scene,
    diameter,
    stroke,
    color: secondaryColor,
    translate: {
      z: height / 2,
    },
  })

  // bottom
  upper.copy({
    fill: true,
    translate: {
      z: height / -2,
    },
  })

  // body
  const body = new Zdog.Cylinder({
    addTo: scene,
    diameter,
    length: height,
    stroke: false,
    color: primaryColor,
    backface: '#f2e8cf',
  })

  // handle
  new Zdog.Ellipse({
    addTo: body,
    diameter: 30,
    quarters: 2,
    stroke,
    color: secondaryColor,
    rotate: {
      x: Zdog.TAU / 4,
    },
    translate: {
      x: diameter / 2,
    },
  })

  // smoke
  const smokeGroup = new Zdog.Group({
    addTo: body,
    translate: {
      z: height,
    },
  })

  const smokeLine = new Zdog.Shape({
    addTo: smokeGroup,
    stroke: 5,
    color: 'hsl(78, 97%, 95%, 50%)',
    path: [
      {}, // start
      {
        bezier: [
          { z: 10, x: 10 }, // start control point
          { z: smokeLineHeight - 10, x: -10 }, // end control point
          { z: smokeLineHeight }, // end point
        ],
      },
    ],
    closed: false,
  })

  const smokeLines = [15, -15]
  smokeLines.forEach((offset) => {
    smokeLine.copy({
      translate: {
        x: offset,
      },
    })
  })

  // animate
  let ticker = 0
  const cycleCount = 350

  return {
    model: scene,
    animate: () => {
      const progress = ticker / cycleCount
      const tween = Zdog.easeInOut(progress % 1)

      smokeGroup.rotate.z = tween * Zdog.TAU
      ticker++
    },
  }
}
