// import type { StyleFunctionProps } from '@chakra-ui/styled-system'

import { defineStyle, defineStyleConfig, extendTheme } from '@chakra-ui/react'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'
import { modalAnatomy } from '@chakra-ui/anatomy'
// import { mode } from '@chakra-ui/theme-tools'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys)

// Version 2: Using functions
export const theme = extendTheme({
  // styles: {
  //   global: (props: StyleFunctionProps) => ({
  //     body: {
  //       fontFamily: 'body',
  //       color: mode('gray.800', 'whiteAlpha.900')(props),
  //       bg: mode('white', 'gray.800')(props),
  //       lineHeight: 'base',
  //     },
  //   }),
  // },
  components: {
    Container: defineStyleConfig({
      baseStyle: defineStyle({
        maxW: '100ch',
      }),
    }),
    Modal: defineMultiStyleConfig({
      baseStyle: definePartsStyle({
        overlay: {
          backdropFilter: 'auto',
          backdropBlur: 'sm',
        },
      }),
    }),
  },
})
