import {Box} from '@chakra-ui/react'
import type {NextPage} from 'next'
import Head from 'next/head'
import {NarrowBox} from '@/components/molecules/NarrowBox'
import {AppTemplate} from '@/components/templates/AppTemplate'

const Index: NextPage = () => {
  return (
    <AppTemplate>
      <Head>
        <title>Lemira</title>
        <meta name="description" content="Lemira" />
      </Head>

      <Box bg="bgGray" h="100%">
        <NarrowBox py={{base: '1rem', sm: '3rem'}}>test</NarrowBox>
      </Box>
    </AppTemplate>
  )
}

export default Index
