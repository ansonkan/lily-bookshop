import type { CreateModel, CreateModelResult } from '../types'

import Zdog from 'zdog'
import anime from 'animejs'

import { STAR_COLORS } from './constants'
import { createStar } from '../star'

interface CreateMegaStarProps extends Zdog.AnchorOptions {
  colors?: string[]
}

interface CreateMegaStarResult extends CreateModelResult {
  appear: () => Promise<void>
  spin: () => Promise<void>
}

export const createMegaStar: CreateModel<
  CreateMegaStarProps,
  CreateMegaStarResult
> = ({ colors, ...others }) => {
  const model = new Zdog.Group(others)
  const stars: ReturnType<typeof createStar>[] = []

  const base = new Zdog.Anchor({
    addTo: model,
  })

  for (let i = 1; i <= STAR_COLORS.length; i++) {
    const color = STAR_COLORS[STAR_COLORS.length - i]

    stars.push(
      createStar({
        addTo: base,
        color,
        scale: 2 / i,
        stroke: 50 / i,
        translate: { z: Math.min(window.innerWidth / -10, -700) },
      })
    )
  }

  const appearAnime = anime({
    autoplay: false,
    targets: stars.map((s) => s.model.translate),
    z: anime.stagger([-100, 100]),
    duration: 2000,
    delay: anime.stagger(100),
  })

  const spinAnime = anime({
    autoplay: false,
    targets: [...stars].reverse().map((s) => s.model.rotate),
    y: Zdog.TAU,
    duration: 2000,
    delay: anime.stagger(100),
  })

  return {
    model,
    appear: () => {
      appearAnime.play()
      return appearAnime.finished
    },
    spin: () => {
      spinAnime.play()
      return spinAnime.finished
    },
  }
}
