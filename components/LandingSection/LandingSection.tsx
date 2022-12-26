import type { CenterProps } from '@chakra-ui/react'

import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Kbd,
  Link,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { useTranslation } from 'next-i18next'

import { SearchModalContext } from '../SearchModal'

export const LandingSection = (props: CenterProps): JSX.Element => {
  const { t } = useTranslation('common')
  const { onOpen } = useContext(SearchModalContext)

  return (
    <Center {...props}>
      <Flex direction="column" gap={4}>
        <Heading
          as="h1"
          fontSize={['2xl', '4xl', '4xl', '5xl']}
          textAlign="center"
        >
          {t('landing-section.heading')}
        </Heading>

        <Button
          variant="outline"
          onClick={() => onOpen()}
          rightIcon={<Kbd>/</Kbd>}
          justifyContent="space-between"
          color="chakra-placeholder-color"
          fontWeight="normal"
        >
          {t('landing-section.search-button')}
        </Button>

        <ButtonGroup alignSelf="center">
          <Button as={Link} href="#about">
            {t('landing-section.visit-us-button')}
          </Button>
          <Button>{t('landing-section.blog-button')}</Button>
        </ButtonGroup>
      </Flex>
    </Center>
  )
}
