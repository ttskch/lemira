import {Box, Flex} from '@chakra-ui/react'
import {NarrowBox} from '../molecules/NarrowBox'

export const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.700" color="white">
      <NarrowBox py="1.5rem" fontSize="sm">
        <Flex>
          <Flex align="center" gap="0.2em" ml="auto">
            <a
              href="https://twitter.com/ttskch"
              target="_blank"
              rel="noreferrer"
            >
              <strong>ttskch</strong>
            </a>
            <span>&copy;</span>
            <span>{new Date().getFullYear()}</span>
          </Flex>
        </Flex>
      </NarrowBox>
    </Box>
  )
}
