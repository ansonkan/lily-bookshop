import type { CreateModel, CreateModelResult } from '../types'

import Zdog from 'zdog'
import anime from 'animejs'

import { createBook } from '../book'

interface CreateNewBooksProps extends Zdog.AnchorOptions {
  colors?: string[]
}

interface CreateNewBooksResult extends CreateModelResult {
  spin: () => void
}

export const createNewBooks: CreateModel<
  CreateNewBooksProps,
  CreateNewBooksResult
> = ({ colors, ...others }) => {
  const model = new Zdog.Anchor(others)
  const books: ReturnType<typeof createBook>[] = []

  for (let i = 0; i < 1; i++) {
    // const color = STAR_COLORS[STAR_COLORS.length - i]

    books.push(
      createBook({
        addTo: model,
      })
    )
  }

  const spinAnime = anime({
    autoplay: false,
    targets: [...books].reverse().map((s) => s.model.rotate),
    y: Zdog.TAU,
    duration: 2500,
    delay: anime.stagger(100),
    complete: () => {
      model.rotate.y = 0
    },
  })

  return {
    model,
    spin: () => {
      spinAnime.restart()
    },
  }
}
