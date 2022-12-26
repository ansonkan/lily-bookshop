import type { BoxProps, InputProps } from '@chakra-ui/react'

import { Box, Input, Square } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { useState } from 'react'

export interface BookSearchFormProps
  extends BoxProps,
    Pick<InputProps, 'size' | 'defaultValue'> {}

export const BookSearchForm = ({
  size,
  defaultValue,
  ...props
}: BookSearchFormProps) => {
  const { push, locale } = useRouter()
  const [q, setQ] = useState(defaultValue ? `${defaultValue}` : '')

  return (
    <Box
      as="form"
      action="/books"
      method="get"
      display="flex"
      alignItems="center"
      onSubmit={(event) => {
        event.preventDefault()
        push({ pathname: '/books', query: { q } }, undefined, { locale })
      }}
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
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
    </Box>
  )
}
