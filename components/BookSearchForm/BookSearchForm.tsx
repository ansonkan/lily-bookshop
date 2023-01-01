import type { BoxProps, InputProps } from '@chakra-ui/react'

import { Box, Input, Square } from '@chakra-ui/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { SearchModalContext } from '../SearchModal'

export interface BookSearchFormProps
  extends BoxProps,
    Pick<InputProps, 'size' | 'defaultValue'> {}

export const BookSearchForm = ({
  size,
  defaultValue,
  ...props
}: BookSearchFormProps) => {
  const { t } = useTranslation('common')
  const { push, locale, query } = useRouter()
  const [q, setQ] = useState(defaultValue ? `${defaultValue}` : '')
  const { onClose } = useContext(SearchModalContext)
  const inputRef = useRef<HTMLInputElement>(null)
  /**
   * TOOD: this is for the autocomplete options which probably need to be passed to parent to render.
   * Otherwise, multiple versions of `BookSearchForm` might be needed.
   * So far `BaseLayout` and `SearchModal` use this but having different visuals
   */
  // const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    /**
     * might need to find a way to convey this `q` better across components and pages,
     * otherwise they will continue to be tangled together by this hardcoded property
     */
    setQ(typeof query?.q === 'string' ? query.q : '')
  }, [query])

  return (
    <Box
      as="form"
      action="/books"
      method="get"
      display="flex"
      alignItems="center"
      onSubmit={(event) => {
        event.preventDefault()
        onClose()
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
        placeholder={t('book-search-form.placeholder') ?? ''}
        variant="unstyled"
        flexGrow={1}
        size={size}
        value={q}
        defaultValue={defaultValue}
        ref={inputRef}
        onChange={(event) => setQ(event.target.value)}
        onKeyUp={(event) => {
          if (event.key === 'Escape') inputRef.current?.blur()
        }}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(false)}
      />
    </Box>
  )
}
