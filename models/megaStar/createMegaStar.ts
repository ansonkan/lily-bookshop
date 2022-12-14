import type { CreateModel, CreateModelResult } from '../types'

import Zdog from 'zdog'
import anime from 'animejs'

import { STAR_COLORS } from './constants'
import { createStar } from '../star'

interface CreateMegaStarProps extends Zdog.AnchorOptions {
  colors?: string[]
}

interface CreateMegaStarResult extends CreateModelResult {
  spin: () => void
}

export const createMegaStar: CreateModel<
  CreateMegaStarProps,
  CreateMegaStarResult
> = ({ colors, ...others }) => {
  const model = new Zdog.Group(others)
  const stars: ReturnType<typeof createStar>[] = []

  for (let i = 1; i <= STAR_COLORS.length; i++) {
    const color = STAR_COLORS[STAR_COLORS.length - i]

    stars.push(
      createStar({
        addTo: model,
        color,
        scale: 2 / i,
        stroke: 50 / i,
      })
    )
  }

  const spinAnime = anime({
    autoplay: false,
    targets: [...stars].reverse().map((s) => s.model.rotate),
    y: Zdog.TAU / 2,
    duration: 2000,
    delay: anime.stagger(100),
  })

  return {
    model,
    spin: () => {
      spinAnime.play()
    },
  }
}
