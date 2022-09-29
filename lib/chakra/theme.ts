import {extendTheme} from '@chakra-ui/react'

// @see parts definitions of multipart component: https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/anatomy/src/components.ts
export const theme = extendTheme({
  styles: {
    global: {
      html: {
        base: {
          fontSize: '14px',
        },
        xl: {
          fontSize: '15px',
        },
      },
      body: {
        color: 'black',
        fontFamily: `"Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
      },
      '*': {
        letterSpacing: '0.03em',
        boxSizing: 'border-box',
      },
    },
  },
  components: {
    Input: {
      sizes: {
        md: {
          field: {
            fontSize: {base: '16px', md: '1em'}, // for iOS
          },
        },
      },
    },
    Textarea: {
      sizes: {
        md: {
          fontSize: {base: '16px', md: '1em'}, // for iOS
        },
      },
    },
  },
})
