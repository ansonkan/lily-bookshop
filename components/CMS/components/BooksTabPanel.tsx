import type { FormEvent } from 'react'

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react'
import { API } from 'aws-amplify'
import { HamburgerIcon } from '@chakra-ui/icons'
import { PlusSquareIcon } from '@chakra-ui/icons'
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
      <HStack w="full">
        <Box
          as="form"
          flexGrow={1}
          onSubmit={(event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
            event.preventDefault()
          }}
        >
          <Autocomplete
            size="sm"
            options={data?.options || []}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>

        <ButtonGroup isAttached size="sm">
          <Button
            leftIcon={<PlusSquareIcon />}
            onClick={() => {
              // show create modal
            }}
          >
            Create
          </Button>
          <Menu>
            <MenuButton as={IconButton}>
              <HamburgerIcon />
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  // show quick import modal
                }}
              >
                Quick import
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </HStack>

      <BookTable w="full" query={debouncedValue} />
    </VStack>
  )
}
