import {Box} from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
} & React.ComponentProps<typeof Box>

export const NarrowBox: React.FC<Props> = ({children, ...styles}) => {
  return (
    <Box w="100%" maxW="1280px" mx="auto" px="1rem" {...styles}>
      {children}
    </Box>
  )
}
