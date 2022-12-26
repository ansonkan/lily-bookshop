import type { BoxProps, InputProps } from '@chakra-ui/react'

import { Box, Input, Square } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { forwardRef } from 'react'

export interface BookSearchFormProps
  extends BoxProps,
    Pick<InputProps, 'size' | 'defaultValue'> {}

export const BookSearchForm = forwardRef<HTMLDivElement, BookSearchFormProps>(
  ({ size, defaultValue, ...props }, ref) => (
    <Box
      as="form"
      action="/books"
      method="get"
      display="flex"
      alignItems="center"
      ref={ref}
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
        defaultValue={defaultValue}
      />
    </Box>
  )
)

BookSearchForm.displayName = 'BookSearchForm'
