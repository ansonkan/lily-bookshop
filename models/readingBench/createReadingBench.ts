import type { CreateModel } from '../types'

import Zdog from 'zdog'

import { GRASS_COORDS, TABLE_LEGS } from './constants'
import { createBook } from '../book'
import { createMug } from '../mug'
import { getRandomColor, getRandomRotation } from '../utils'

export const createReadingBench: CreateModel = (props) => {
  const model = new Zdog.Anchor(props)

  // ground
  const groundColor = 'hsl(228, 40%, 26%, 100%)'
  const groundStroke = 20
  const groundDiameter = 700
  const ground = new Zdog.Ellipse({
    addTo: model,
    diameter: groundDiameter,
    stroke: groundStroke,
    fill: true,
    color: groundColor,
  })

  // grass
  const grassGroup = new Zdog.Group({
    addTo: ground,
    translate: {
      z: groundStroke / 2,
    },
  })

  const grass = new Zdog.Shape({
    addTo: grassGroup,
    stroke: 5,
    path: [
      {},
      { arc: [{ z: 20 }, { z: 20, x: -20 }] },
      { move: { x: 0, y: 0, z: 0 } },
      { arc: [{ z: 15 }, { z: 15, x: 15 }] },
    ],
    closed: false,
    color: 'hsl(98, 78%, 40%, 100%)',
    visible: false,
  })

  GRASS_COORDS.forEach(({ x, y }) => {
    grass.copy({
      visible: true,
      rotate: {
        z: getRandomRotation(),
      },
      translate: {
        x,
        y,
      },
    })
  })

  // table
  const table = new Zdog.Anchor({
    addTo: model,
    translate: { z: 70 },
  })

  const tableWidth = 250
  const tableHeight = 450
  const tableWidthHalf = tableWidth / 2
  const tableHeightHalf = tableHeight / 2
  const tableLegInset = (Math.min(tableWidth, tableHeight) / 2) * 0.2
  const tableStroke = 20
  const tableColors = ['hsl(8, 92%, 75%, 100%)', 'hsl(150, 59%, 31%, 100%)']

  // table - top
  const plankCount = 4
  const plankGap = tableWidth * 0.1
  const plankWidth =
    tableWidth / plankCount - (plankGap * (plankCount - 1)) / plankCount
  const planks = new Zdog.Group({
    addTo: table,
  })

  const xOffset = ((plankWidth + plankGap) * (plankCount - 1)) / 2
  for (let i = 0; i < plankCount; i++) {
    new Zdog.Rect({
      addTo: planks,
      width: plankWidth,
      height: tableHeight,
      stroke: tableStroke,
      fill: true,
      color: tableColors[i % 2],
      translate: {
        x: i * (plankWidth + plankGap) - xOffset,
      },
    })
  }

  // table - legs
  const tableLegsGroup = new Zdog.Group({
    addTo: table,
  })

  TABLE_LEGS.forEach(([xMultiplier, yMultiplier]) => {
    new Zdog.Shape({
      addTo: tableLegsGroup,
      stroke: 20,
      color: tableColors[0],
      path: [{ z: -10 }, { z: -40 }],
      translate: {
        z: -10,
        x: (tableWidthHalf - tableLegInset) * xMultiplier,
        y: (tableHeightHalf - tableLegInset) * yMultiplier,
      },
    })
  })

  // stack of books
  const bookStackTranslate = {
    x: tableWidthHalf * -0.4,
    y: tableHeightHalf * 0.7,
  }
  const offsetToTableTop = -5
  const bookThickness = 40

  createBook({
    addTo: table,
    rotate: { z: Zdog.TAU * 0.7 },
    translate: { z: offsetToTableTop + bookThickness, ...bookStackTranslate },
  })

  createBook({
    addTo: table,
    rotate: { z: Zdog.TAU * 0.73 },
    translate: {
      z: offsetToTableTop + bookThickness * 2,
      ...bookStackTranslate,
    },
  })

  createBook({
    addTo: table,
    rotate: { z: Zdog.TAU * 0.65 },
    translate: {
      z: offsetToTableTop + bookThickness * 3,
      ...bookStackTranslate,
    },
  })

  const openBookGroup = new Zdog.Group({
    addTo: table,
    rotate: { z: Zdog.TAU * 0.05 },
    translate: {
      z: offsetToTableTop + bookThickness,
      x: tableWidthHalf * 1.1,
      y: tableHeightHalf * -0.35,
    },
  })

  createBook({
    addTo: openBookGroup,
    isOpen: true,
  })

  const mug = createMug({
    addTo: table,
    rotate: { z: Zdog.TAU / 6 },
    translate: {
      z: 40,
      x: tableWidthHalf * 0.7,
      y: tableHeightHalf * 0.7,
    },
  })

  return {
    model,
    animate: () => {
      mug.animate?.()
    },
  }
}
