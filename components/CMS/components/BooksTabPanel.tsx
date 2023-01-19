import type { FormEvent } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { API } from 'aws-amplify'
import useSWR from 'swr'
import { useState } from 'react'

import { useDebounce } from 'hooks'

import { Autocomplete } from './Autocomplete'
import { BookTable } from './BookTable'

export const BooksTabPanel = (): JSX.Element => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const { data } = useSWR(
    value ? ['apicore', `/books?autocomplete=${value}`] : null,
    ([apiName, url]) => API.get(apiName, url, {})
  )

  return (
    <VStack gap={[2, 4]}>
      <Box
        as="form"
        w="full"
        onSubmit={(event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
          event.preventDefault()
          // console.log(value)
        }}
      >
        <Autocomplete
          options={data?.options || []}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </Box>

      <BookTable w="full" query={debouncedValue} />
    </VStack>
  )
}
