import NextHead from 'next/head'
import {staticPath} from '@/lib/$path'

const siteTitle = 'Lemira | シンプルかつ柔軟な一括メール送信ツール'

type Props = {
  title: string
  description?: string
  path: string
}

export const Head: React.FC<Props> = ({title, description, path}) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description ?? title} />

      {/* @see https://ogp.me/ */}
      {/* required */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_ORIGIN}${staticPath.ogp_png}`}
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_ORIGIN}${path}`}
      />
      <meta
        property="fb:app_id"
        content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      />
      {/* optional */}
      <meta property="og:description" content={description ?? title} />
      <meta property="og:site_name" content={siteTitle} />

      {/* @see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started */}
      {/* required */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* optional */}
      <meta name="twitter:site" content="" />
      <meta name="twitter:creator" content="@ttskch" />
    </NextHead>
  )
}
