import type { BoxProps } from '@chakra-ui/react'

import { Box, Heading, Square, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

export const AboutSection = (props: BoxProps): JSX.Element => {
  const { t, i18n } = useTranslation('common')

  const [mapVisible, setMapVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // `500` is just a arbitrary number, just wanted to show/load the map what user starts to scroll down
      if (window.scrollY > 500) {
        !mapVisible && setMapVisible(true)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [mapVisible])

  return (
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
          <Trans
            i18nKey="about-section.heading"
            components={[
              <Text
                key={0}
                as="span"
                bgGradient="linear(to-tl, #00d9ff, #c700ff)"
                bgClip="text"
              />,
            ]}
          />
        </Heading>

        <Text textAlign="center">{t('about-section.main')}</Text>
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
        src={
          mapVisible
            ? `https://www.google.com/maps/embed/v1/place?key=${
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              }&q=Lily+Bookshop,Hong+Kong&language=${i18n.language ?? 'en'}`
            : undefined
        }
        bgColor="gray.100"
      />
    </Box>
  )
}
