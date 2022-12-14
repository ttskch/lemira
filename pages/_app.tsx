import {ChakraProvider} from '@chakra-ui/react'
import type {AppProps} from 'next/app'
import {GoogleAnalytics} from '@/components/molecules/GoogleAnalytics'
import {theme} from '@/lib/chakra/theme'
import '../styles/globals.scss'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default MyApp
