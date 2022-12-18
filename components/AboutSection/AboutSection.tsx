import type { BoxProps } from '@chakra-ui/react'

import { Box, Square, Heading, Text } from '@chakra-ui/react'

export const AboutSection = (props: BoxProps): JSX.Element => (
  <Box
    id="about"
    minH={[600, 500]}
    display="flex"
    flexDir={['column', 'row']}
    gap={4}
    {...props}
  >
    <Square flex={1} display="flex" flexDirection="column" gap={4}>
      <Heading textAlign="center">
        We are a second hand bookshop with{' '}
        <Text
          as="span"
          bgGradient="linear(to-tl, #00d9ff, #c700ff)"
          bgClip="text"
        >
          Style
        </Text>
      </Heading>

      <Text textAlign="center">
        Rare books, oversized books, novels, photography, children, art and many
        others. We have English, Chinese, Japanese and other European books.
        Please feel free to contact us and visit us!
      </Text>
    </Square>

    <Square
      flex={1}
      rounded="3xl"
      overflow="hidden"
      boxShadow="xl"
      as="iframe"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Lily+Bookshop,Hong+Kong`}
    />
  </Box>
)
