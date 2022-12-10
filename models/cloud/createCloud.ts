import type { CreateModel } from '../types'

import Zdog from 'zdog'

export const createCloud: CreateModel = (props) => {
  const scene = new Zdog.Anchor(props)

  return { model: scene }
}
