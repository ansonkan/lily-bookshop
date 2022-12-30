import type { Book } from 'types'
import type { CardProps } from '@chakra-ui/react'

import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'

import { BookItem } from '../BookItem'

export interface BookScrollXCardProps extends CardProps {
  heading: string
  headingClassName?: string
  books: Book[]
  children?: React.ReactNode
}

export const BookScrollXCard = ({
  heading,
  headingClassName,
  books,
  children,
  ...cardProps
}: BookScrollXCardProps): JSX.Element => (
  <Card className="my-scrollbar" {...cardProps}>
    {children}

    <CardHeader>
      <Heading className={headingClassName}>{heading}</Heading>
    </CardHeader>

    <CardBody display="flex" flexDir="row" gap={4} overflowX="scroll">
      {books.map((book) => (
        <BookItem
          key={book.id}
          w={[125, 130]}
          flexShrink={0}
          flexGrow={0}
          detailsLink={`/books/${book.id}`}
          {...book}
        />
      ))}
    </CardBody>
  </Card>
)
