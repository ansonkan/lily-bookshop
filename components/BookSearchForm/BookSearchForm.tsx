import type { BoxProps, InputGroupProps } from '@chakra-ui/react'

import { Box, Input, Square } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

export interface BookSearchFormProps
  extends BoxProps,
    Pick<InputGroupProps, 'size'> {}

export const BookSearchForm = ({
  size,
  ...props
}: BookSearchFormProps): JSX.Element => (
  <Box
    as="form"
    action="/books"
    method="get"
    display="flex"
    alignItems="center"
    {...props}
  >
    <Square size="10">
      <SearchIcon />
    </Square>

    <Input
      name="q"
      required
      autoComplete="off"
      placeholder="A title, author, ISBN, or anything really..."
      variant="unstyled"
      flexGrow={1}
      size={size}
    />
  </Box>
)
