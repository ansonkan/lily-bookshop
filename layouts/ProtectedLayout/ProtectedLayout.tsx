import '@aws-amplify/ui-react/styles.css'
import {
  Authenticator,
  ThemeProvider,
  translations,
} from '@aws-amplify/ui-react'
import { I18n } from 'aws-amplify'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { BaseLayout } from '../BaseLayout'

I18n.putVocabularies(translations)

export interface ProtectedLayoutProps {
  children: React.ReactNode
}

export const ProtectedLayout = ({
  children,
}: ProtectedLayoutProps): JSX.Element => {
  const { locale } = useRouter()

  useEffect(() => {
    I18n.setLanguage(locale)
  }, [locale])

  return (
    <ThemeProvider>
      <BaseLayout hideTopSlot>
        <Authenticator hideSignUp key={locale}>
          {children}
        </Authenticator>
      </BaseLayout>
    </ThemeProvider>
  )
}
