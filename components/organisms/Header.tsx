import {Box, Flex, Image, Text} from '@chakra-ui/react'
import NextLink from 'next/link'
import {NarrowBox} from '../molecules/NarrowBox'
import {pagesPath, staticPath} from '@/lib/$path'

export const Header: React.FC = () => {
  return (
    <Box as="header" bg="blue.50" position="sticky" top={0} zIndex={100}>
      <NarrowBox>
        <Flex h="60px" align="center">
          <NextLink href={pagesPath.$url()} passHref>
            <Flex as="a" align="center" mr="1rem">
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
          <Text fontSize="0.9rem" color="gray.600">
            シンプルかつ柔軟な一括メール送信ツール
          </Text>
        </Flex>
      </NarrowBox>
    </Box>
  )
}
