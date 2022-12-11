// import type { StyleFunctionProps } from '@chakra-ui/styled-system'

import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react'
// import { mode } from '@chakra-ui/theme-tools'

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
        maxW: '120ch',
      }),
    }),
  },
})
