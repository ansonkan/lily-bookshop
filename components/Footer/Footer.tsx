import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Link,
} from '@chakra-ui/react'
import { PhoneIcon } from '@chakra-ui/icons'

import { MapPinIcon } from '@components'

export const Footer = (): JSX.Element => (
  <Box as="footer" bgColor="purple.800" color="white" fontSize="small">
    <Container py={8}>
      <Heading size="md" mb={8}>
        Lily Bookshop
      </Heading>

      <VStack alignItems="flex-start">
        <HStack>
          <PhoneIcon />
          <Link href="tel:85269775833">+852 6977 5833</Link>
        </HStack>

        <HStack alignItems="baseline">
          <MapPinIcon />
          <Link href="https://goo.gl/maps/oZJhrC6xF4kDW4WP7" target="_blank">
            <Text>Address: Room F-G, 1st Floor, Kai Fung Mansion</Text>
            <Text>189-205 Queen’s Road, Central, Sheung Wan</Text>
            <Text>Hong Kong</Text>
            <Text>(香港皇后大道中189-205號啓豐大廈1樓F-G室)</Text>
          </Link>
        </HStack>
      </VStack>
    </Container>
  </Box>
)
