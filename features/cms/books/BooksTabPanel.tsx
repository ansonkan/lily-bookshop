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
  useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { API } from 'aws-amplify'
import useSWR from 'swr'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { Autocomplete } from 'components'
import { useDebounce } from 'hooks'

import { BooksCreateModal } from './BooksCreateModal'
import { BooksTable } from './BooksTable'

export const BooksTabPanel = (): JSX.Element => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const disclosure = useDisclosure()

  const { data } = useSWR(
    debouncedValue
      ? ['apicore', `/books?autocomplete=${debouncedValue}`]
      : null,
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
            placeholder={t('book-search-form.placeholder') ?? ''}
            onChange={(value) => setValue(value)}
          />
        </Box>

        <ButtonGroup isAttached size="sm">
          <Button
            leftIcon={<PlusSquareIcon />}
            onClick={() => disclosure.onOpen()}
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

      <BooksTable w="full" query={debouncedValue} />

      <BooksCreateModal {...disclosure} />
    </VStack>
  )
}