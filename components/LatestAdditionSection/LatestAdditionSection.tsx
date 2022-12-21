import type { Book } from '@types'
import type { CardProps } from '@chakra-ui/react'

import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'

import { BookItem, LatestAdditionsScene } from '@components'

import styles from './styles.module.scss'

export interface LatestAdditionSectionProps extends CardProps {
  books: Book[]
}

export const LatestAdditionSection = ({
  books,
  ...cardProps
}: LatestAdditionSectionProps): JSX.Element => (
  <Card {...cardProps} color="white">
    <LatestAdditionsScene />

    <CardHeader>
      <Heading className={styles.heading}>Latest Additions</Heading>
    </CardHeader>

    <CardBody display="flex" flexDir="row" gap={4} overflowX="scroll">
      {books.map((book) => (
        <BookItem
          key={book.id}
          w={[125, 150]}
          flexShrink={0}
          flexGrow={0}
          detailsLink={`/books/${book.id}`}
          {...book}
        />
      ))}
    </CardBody>
  </Card>
)
