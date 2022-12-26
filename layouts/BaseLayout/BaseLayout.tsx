import { Box, Container } from '@chakra-ui/react'

import { BaseLayoutScene } from 'components'

export interface BaseLayoutProps {
  slotTop?: React.ReactNode
  children: React.ReactNode
}

export const BaseLayout = ({
  slotTop,
  children,
}: BaseLayoutProps): JSX.Element => (
  <Box>
    {/* the `bgColor` is the same from `BaseLayoutScene` to workaround the blank bg before the `appear` animation */}
    <Box position="relative" h={[150, 200]} bgColor="#fbf8cc">
      <BaseLayoutScene />
      {slotTop}
    </Box>

    <Container>{children}</Container>
  </Box>
)
