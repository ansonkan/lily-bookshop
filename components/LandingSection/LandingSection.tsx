import { CenterProps } from '@chakra-ui/react'

import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Heading,
  Kbd,
  Link,
  Text,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { useTranslation } from 'next-i18next'

import { SearchModalContext } from '../SearchModal'

export const LandingSection = (props: CenterProps): JSX.Element => {
  const { t } = useTranslation('common')
  const { onOpen } = useContext(SearchModalContext)

  return (
    <Center {...props}>
      <Flex direction="column" gap={4} maxW="full">
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
          overflow="hidden"
        >
          <HStack>
            <SearchIcon />
            <Text>{t('landing-section.search-button')}</Text>
          </HStack>
        </Button>

        <ButtonGroup alignSelf="center">
          <Button as={Link} href="#about">
            {t('landing-section.visit-us-button')}
          </Button>

          {/* WIP */}
          {/* <Button>{t('landing-section.blog-button')}</Button> */}
        </ButtonGroup>
      </Flex>
    </Center>
  )
}
