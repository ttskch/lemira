import {Head, Html, Main, NextScript} from 'next/document'
import {staticPath} from '@/lib/$path'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" type="image/png" href={staticPath.logo_192x192_png} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
