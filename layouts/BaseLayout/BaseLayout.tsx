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
    <Box position="relative" h={[150, 200]} bgColor="GrayText">
      <BaseLayoutScene />
      {slotTop}
    </Box>

    <Container>{children}</Container>
  </Box>
)
