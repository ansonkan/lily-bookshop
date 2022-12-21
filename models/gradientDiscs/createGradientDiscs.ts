import type { CreateModel } from '../types'

import Zdog from 'zdog'

export const createGradientDiscs: CreateModel = (props) => {
  const model = new Zdog.Anchor(props)

  return { model }
}
