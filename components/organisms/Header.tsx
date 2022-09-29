import {Box, Flex, Image, Text} from '@chakra-ui/react'
import NextLink from 'next/link'
import {NarrowBox} from '../molecules/NarrowBox'
import {pagesPath, staticPath} from '@/lib/$path'

export const Header: React.FC = () => {
  return (
    <Box as="header" bg="gray.50" position="sticky" top={0} zIndex={100}>
      <NarrowBox>
        <Flex h="60px" align="center">
          <NextLink href={pagesPath.$url()} passHref>
            <Flex as="a" align="center">
              <Image
                src={staticPath.logo_192x192_png}
                w="30px"
                h="30px"
                alt="logo"
                mr="0.5rem"
              />
              <Text as="h1" fontWeight="bold">
                Lemira
              </Text>
            </Flex>
          </NextLink>
        </Flex>
      </NarrowBox>
    </Box>
  )
}
