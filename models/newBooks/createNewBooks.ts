import type { CreateModel, CreateModelResult } from '../types'

import Zdog from 'zdog'
import anime from 'animejs'

import { createBook } from '../book'
import { getRandomInt } from '../utils'
import { COLUMN_WIDTH, COLUMN_ITEM_HEIGHT } from './constants'

interface CreateNewBooksProps extends Zdog.AnchorOptions {
  colors?: string[]
  columns?: number
  booksPerColumn?: number
}

interface CreateNewBooksResult extends CreateModelResult {
  appear: () => void
  spin: () => void
}

export const createNewBooks: CreateModel<
  CreateNewBooksProps,
  CreateNewBooksResult
> = ({ colors, columns = 4, booksPerColumn = 2, ...others }) => {
  const model = new Zdog.Anchor(others)
  const cols: Zdog.Anchor[] = []
  const books: ReturnType<typeof createBook>[] = []

  const offset = (COLUMN_WIDTH * (columns - 1)) / 2

  for (let i = 0; i < columns; i++) {
    const col = new Zdog.Anchor({
      addTo: model,
      translate: {
        y: -400,
      },
    })

    const base = new Zdog.Anchor({
      addTo: col,
      translate: {
        x: COLUMN_WIDTH * i - offset,
        y: getRandomInt(-120, 120),
      },
    })

    for (let j = 0; j < booksPerColumn; j++) {
      books.push(
        createBook({
          addTo: base,
          rotate: { y: getRandomInt(0, 1) ? Zdog.TAU / 2 : 0 },
          translate: {
            y: COLUMN_ITEM_HEIGHT * j,
          },
        })
      )
    }

    cols.push(col)
  }

  const appearAnime = anime({
    autoplay: false,
    targets: cols.map((c) => c.translate),
    y: 0,
    duration: 2000,
    delay: anime.stagger(50),
  })

  const spinAnime = anime({
    autoplay: false,
    targets: books.map((b) => b.model.rotate),
    x: Zdog.TAU,
    duration: 2000,
    delay: anime.stagger(50),
  })

  return {
    model,
    appear: () => appearAnime.play(),
    spin: () => {
      spinAnime.play()
    },
  }
}
