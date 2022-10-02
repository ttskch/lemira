import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import {NarrowBox} from '../molecules/NarrowBox'
import {pagesPath, staticPath} from '@/lib/$path'
import {useLocale} from '@/lib/i18n'
import I18nSvg from '@/public/i18n.svg'

export const Header: React.FC = () => {
  const router = useRouter()
  const {locale, t} = useLocale()

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
            {t.components.organisms.Header['Simple broadcast mailer']}
          </Text>
          <Menu placement="bottom-end">
            <MenuButton ml="auto">
              <I18nSvg width="1.3rem" height="1.3rem" aria-label="i18n" />
            </MenuButton>
            <MenuList>
              <NextLink href={router.asPath} locale="ja" passHref>
                <MenuItem isDisabled={locale === 'ja'}>日本語</MenuItem>
              </NextLink>
              <NextLink href={router.asPath} locale="en" passHref>
                <MenuItem isDisabled={locale === 'en'}>English</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Flex>
      </NarrowBox>
    </Box>
  )
}
