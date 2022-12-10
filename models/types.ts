import Zdog from 'zdog'

export interface CreateModelProps extends Zdog.AnchorOptions {
  color?: string
}

export interface CreateModelResult {
  model: Zdog.Anchor
  animate?: () => void
}

export type CreateModel = (props: CreateModelProps) => CreateModelResult
