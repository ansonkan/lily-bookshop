import type { CenterProps } from '@chakra-ui/react'

import { Center } from '@chakra-ui/react'

import { BASE_COLOR } from './constants'

export type RootProps = CenterProps

export const Root = ({
  position = 'relative',
  borderColor = BASE_COLOR,
  borderWidth = 1,
  borderStyle = 'dashed',
  borderRadius = 'md',
  h = '40',
  p = '2',
  children,
  ...others
}: RootProps): JSX.Element => (
  <Center
    position={position}
    borderColor={borderColor}
    borderWidth={borderWidth}
    borderStyle={borderStyle}
    borderRadius={borderRadius}
    h={h}
    p={p}
    {...others}
  >
    {children}
  </Center>
)
