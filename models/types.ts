import Zdog from 'zdog'

export interface CreateModelResult {
  model: Zdog.Anchor
  animate?: () => void
}

export type CreateModel<P = Zdog.AnchorOptions, R = CreateModelResult> = (
  props: P
) => R
