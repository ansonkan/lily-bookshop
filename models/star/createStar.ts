import type { CreateModel } from '../types'

import Zdog from 'zdog'

interface CreateStarProps
  extends Zdog.AnchorOptions,
    Pick<Zdog.ShapeOptions, 'color' | 'stroke'> {}

export const createStar: CreateModel<CreateStarProps> = ({
  color,
  stroke = 20,
  ...others
}) => {
  const model = new Zdog.Anchor(others)

  /**
   * 1. Copy from https://www.svgrepo.com/show/13695/star.svg
   * 2. Convert from relative to absolute commands in https://lea.verou.me/2019/05/utility-convert-svg-path-to-all-relative-or-all-absolute-commands/
   * 3. Parse the commands by https://www.npmjs.com/package/svg-path-parser
   */
  const scale = 5
  const offset = (-47.94 / 2) * scale

  new Zdog.Shape({
    addTo: model,
    color,
    stroke,
    fill: true,
    closed: true,
    scale,
    translate: { x: offset, y: offset },
    path: [
      { move: { x: 26.285, y: 2.486 } },
      { line: { x: 31.692, y: 13.442 } },
      {
        bezier: [
          { x: 32.068, y: 14.204 },
          { x: 32.795, y: 14.732 },
          { x: 33.636, y: 14.854 },
        ],
      },
      { line: { x: 45.727000000000004, y: 16.611 } },
      {
        bezier: [
          { x: 47.845000000000006, y: 16.919 },
          { x: 48.690000000000005, y: 19.521 },
          { x: 47.158, y: 21.014 },
        ],
      },
      { line: { x: 38.409, y: 29.542 } },
      {
        bezier: [
          { x: 37.801, y: 30.135 },
          { x: 37.522999999999996, y: 30.990000000000002 },
          { x: 37.667, y: 31.827 },
        ],
      },
      { line: { x: 39.732, y: 43.869 } },
      {
        bezier: [
          { x: 40.094, y: 45.978 },
          { x: 37.88, y: 47.586 },
          { x: 35.986, y: 46.591 },
        ],
      },
      { line: { x: 25.171999999999997, y: 40.906 } },
      {
        bezier: [
          { x: 24.419999999999998, y: 40.510999999999996 },
          { x: 23.520999999999997, y: 40.510999999999996 },
          { x: 22.769, y: 40.906 },
        ],
      },
      { line: { x: 11.954999999999998, y: 46.591 } },
      {
        bezier: [
          { x: 10.060999999999998, y: 47.587 },
          { x: 7.846999999999999, y: 45.978 },
          { x: 8.208999999999998, y: 43.869 },
        ],
      },
      {
        line: { x: 10.273999999999997, y: 31.826999999999998 },
      },
      {
        bezier: [
          { x: 10.417999999999997, y: 30.99 },
          { x: 10.139999999999997, y: 30.134999999999998 },
          { x: 9.531999999999996, y: 29.541999999999998 },
        ],
      },
      {
        line: { x: 0.7829999999999959, y: 21.013999999999996 },
      },
      {
        bezier: [
          { x: -0.7490000000000041, y: 19.519999999999996 },
          { x: 0.09599999999999587, y: 16.917999999999996 },
          { x: 2.213999999999996, y: 16.610999999999997 },
        ],
      },
      {
        line: { x: 14.304999999999996, y: 14.853999999999997 },
      },
      {
        bezier: [
          { x: 15.145999999999995, y: 14.731999999999998 },
          { x: 15.872999999999996, y: 14.203999999999997 },
          { x: 16.248999999999995, y: 13.441999999999997 },
        ],
      },
      {
        line: { x: 21.655999999999995, y: 2.485999999999997 },
      },
      {
        bezier: [
          { x: 22.602, y: 0.567 },
          { x: 25.338, y: 0.567 },
          { x: 26.285, y: 2.486 },
        ],
      },
    ],
  })

  return {
    model,
  }
}
