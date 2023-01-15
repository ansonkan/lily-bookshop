import type { FormEvent } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { API } from 'aws-amplify'
import useSWR from 'swr'
import { useState } from 'react'

import { Autocomplete } from '../Autocomplete'

export const BooksTabPanel = (): JSX.Element => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<string[]>([])

  useSWR(
    value ? ['apicore', `/books?autocomplete=${value}`] : null,
    ([apiName, url]) => API.get(apiName, url, {}),
    {
      onSuccess(data) {
        data?.options && setOptions(data.options)
      },
    }
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
          options={value ? options : []}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </Box>
    </VStack>
  )
}
