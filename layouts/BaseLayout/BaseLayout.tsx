import { Box, Container } from '@chakra-ui/react'

import {
  BaseLayoutScene,
  BookSearchForm,
  BookSearchFormProps,
} from 'components'

export interface BaseLayoutProps {
  slotTop?: React.ReactNode
  children: React.ReactNode
  defaultValue?: BookSearchFormProps['defaultValue']
}

export const BaseLayout = ({
  slotTop,
  children,
  defaultValue,
}: BaseLayoutProps): JSX.Element => (
  <Box>
    {/* the `bgColor` is the same from `BaseLayoutScene` to workaround the blank bg before the `appear` animation */}
    <Box position="relative" h={[150, 200]} bgColor="#fbf8cc">
      <BaseLayoutScene />
      {slotTop ?? (
        <BookSearchForm
          position="absolute"
          bottom={0}
          left="50%"
          w="50%"
          transform="translate(-50%, 50%)"
          maxW={600}
          minW={300}
          rounded="3xl"
          boxShadow="md"
          bgColor="white"
          zIndex="dropdown"
          px={2}
          py={1}
          defaultValue={defaultValue}
        />
      )}
    </Box>

    <Container
      display="flex"
      flexDirection="column"
      gap={4}
      /**
       * Because the first rendering doesn't have access to `BookSearchForm`'s height yet, so the gap would still stutter once
       * the part of the Chakra variables below are used inside of `BookSearchForm`
       *
       * 4: base padding
       * 10: icon's height
       * 1: `py`
       */
      pt="calc(var(--chakra-space-4) + (var(--chakra-sizes-10) / 2) + var(--chakra-sizes-1))"
    >
      {children}
    </Container>
  </Box>
)
