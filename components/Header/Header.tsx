import {
  Box,
  Button,
  Container,
  Fade,
  HStack,
  Heading,
  Kbd,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'

import { SearchModalContext } from '../SearchModal'

export interface HeaderProps {
  showAllThreshold?: number
  showAllThresholdRatio?: number
}

export const Header = ({
  showAllThreshold,
  showAllThresholdRatio = 0.5,
}: HeaderProps): JSX.Element => {
  const { onOpen } = useContext(SearchModalContext)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const threshold = showAllThreshold
        ? showAllThreshold
        : window.innerHeight * showAllThresholdRatio

      if (window.scrollY > threshold) {
        !showAll && setShowAll(true)
      } else {
        showAll && setShowAll(false)
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [showAll, showAllThreshold, showAllThresholdRatio])

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      backdropFilter="auto"
      backdropBlur={showAll ? 'md' : 'none'}
      bgColor={showAll ? 'whiteAlpha.800' : 'transparent'}
      borderBottom="1px"
      borderColor={showAll ? 'white' : 'transparent'}
      zIndex="sticky"
      transition="all 0.3s ease-in-out"
    >
      <Container py={[2, 4]}>
        <HStack justifyContent="space-between">
          <Heading size="md">Lily Bookshop</Heading>

          <Fade in={showAll}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpen()}
              rightIcon={<Kbd>/</Kbd>}
            >
              Search
            </Button>
          </Fade>
        </HStack>
      </Container>
    </Box>
  )
}
