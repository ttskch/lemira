import {Box} from '@chakra-ui/react'
import {Footer} from '@/components/organisms/Footer'
import {Header} from '@/components/organisms/Header'

type Props = {
  children: React.ReactNode
}

export const AppTemplate: React.FC<Props> = ({children}) => {
  return (
    <Box
      display="grid"
      gridTemplateRows="auto 1fr auto"
      gridTemplateColumns="100%"
      minHeight="100vh"
    >
      <Header />
      <Box as="main" minH="70vh">
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
