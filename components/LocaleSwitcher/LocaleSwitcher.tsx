import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { LOCALES } from './constants'

export const LocaleSwitcher = (): JSX.Element => {
  const { t } = useTranslation('common')
  const { pathname, query, locale } = useRouter()

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
        {t(`locale-switcher.${locale}`)}
      </MenuButton>

      <MenuList>
        {LOCALES.map((l) => (
          <MenuItem key={l} as={NextLink} href={{ pathname, query }} locale={l}>
            {t(`locale-switcher.${l}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
