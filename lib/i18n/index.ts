import {useRouter} from 'next/router'
import en from '@/lib/i18n/en'
import ja from '@/lib/i18n/ja'

export type Translation = typeof en | typeof ja

export const useLocale = () => {
  const {locale} = useRouter()
  const t: Translation = locale === 'en' ? en : ja
  return {locale, t}
}
