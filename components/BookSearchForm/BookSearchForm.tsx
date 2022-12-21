import type { BoxProps, InputGroupProps } from '@chakra-ui/react'

import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

export interface BookSearchFormProps
  extends BoxProps,
    Pick<InputGroupProps, 'size'> {}

export const BookSearchForm = ({
  size,
  ...props
}: BookSearchFormProps): JSX.Element => (
  <Box as="form" action="/books" method="get" {...props}>
    <InputGroup backdropFilter="auto" backdropBlur="sm" size={size}>
      <InputLeftElement>
        <SearchIcon />
      </InputLeftElement>
      <Input
        name="q"
        required
        autoComplete="off"
        placeholder="A title, author, ISBN, or anything really..."
      />
    </InputGroup>
  </Box>
)
