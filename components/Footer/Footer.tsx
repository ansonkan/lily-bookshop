import {
  Box,
  Container,
  HStack,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { PhoneIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

import { MapPinIcon } from '../MapPinIcon'

export const Footer = (): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <Box as="footer" bgColor="purple.800" color="white">
      <Container py={8}>
        <Heading size={['sm', 'md']} mb={8}>
          {t('footer.heading')}
        </Heading>

        <VStack alignItems="flex-start" fontSize="small">
          <HStack>
            <PhoneIcon />
            <Link href={t('footer.tel.href') ?? ''}>
              {t('footer.tel.string')}
            </Link>
          </HStack>

          <HStack alignItems="baseline">
            <MapPinIcon />
            <Link href="https://goo.gl/maps/oZJhrC6xF4kDW4WP7" target="_blank">
              <Text>{t('footer.address.line1')}</Text>
              <Text>{t('footer.address.line2')}</Text>
              <Text>{t('footer.address.line3')}</Text>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
