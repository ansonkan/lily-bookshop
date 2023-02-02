import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Fade,
  HStack,
  Heading,
  IconButton,
  Kbd,
  Link,
  useBreakpoint,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { SearchIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

import Logo from 'public/favicon.ico'

import { LocaleSwitcher } from '../LocaleSwitcher'
import { SearchModalContext } from '../SearchModal'

export interface HeaderProps {
  showAllThreshold?: number
  showAllThresholdRatio?: number
}

export const Header = ({
  showAllThreshold,
  showAllThresholdRatio = 0.5,
}: HeaderProps): JSX.Element => {
  const bp = useBreakpoint()
  const { t } = useTranslation('common')
  const { onOpen } = useContext(SearchModalContext)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const threshold =
        showAllThreshold !== undefined
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
          <Link
            as={NextLink}
            href="/"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Image src={Logo} alt="Lily Bookshop logo" width={32} />
            <Heading size={['sm', 'md']}>{t('header.heading')}</Heading>
          </Link>

          <ButtonGroup>
            <Fade in={showAll} unmountOnExit>
              {['base', 'sm'].includes(bp) ? (
                <IconButton
                  aria-label="Search"
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpen()}
                  icon={<SearchIcon />}
                />
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpen()}
                  leftIcon={<SearchIcon />}
                  rightIcon={<Kbd>/</Kbd>}
                >
                  {t('header.search-button')}
                </Button>
              )}
            </Fade>

            <LocaleSwitcher />
          </ButtonGroup>
        </HStack>
      </Container>
    </Box>
  )
}
