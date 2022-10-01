import {Box, Flex} from '@chakra-ui/react'

type Props = {
  left: React.ReactNode
  right: React.ReactNode
  leftWidth?: string
}

export const ResponsiveRow: React.FC<Props> = ({left, right, leftWidth}) => {
  return (
    <Box>
      <Flex wrap={{base: 'wrap', md: 'nowrap'}}>
        <Box w={{base: '100%', md: leftWidth ?? '20%'}}>{left}</Box>
        <Box w="100%">{right}</Box>
      </Flex>
    </Box>
  )
}
