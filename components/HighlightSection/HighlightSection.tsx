import type { Book } from '@types'
import type { CardProps } from '@chakra-ui/react'

import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'

import { BookItem, HighlightScene } from '@components'

import styles from './styles.module.scss'

export interface HighlightSectionProps extends CardProps {
  books: Book[]
}

export const HighlightSection = ({
  books,
  ...cardProps
}: HighlightSectionProps): JSX.Element => (
  <Card {...cardProps}>
    <HighlightScene />

    <CardHeader>
      <Heading className={styles.heading}>Highlights</Heading>
    </CardHeader>

    <CardBody
      display="flex"
      flexDir="row"
      alignItems="stretch"
      gap={4}
      overflowX="scroll"
    >
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
