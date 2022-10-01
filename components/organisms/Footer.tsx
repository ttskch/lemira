import {Box, Flex, Icon} from '@chakra-ui/react'
import {AiFillGithub} from 'react-icons/ai'
import {NarrowBox} from '../molecules/NarrowBox'

export const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.700" color="white">
      <NarrowBox py="1.5rem" fontSize="sm">
        <Flex align="center">
          <a
            href="https://github.com/ttskch/lemira"
            target="_blank"
            rel="noreferrer"
          >
            <Icon as={AiFillGithub} fontSize="1.5rem" />
          </a>
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
