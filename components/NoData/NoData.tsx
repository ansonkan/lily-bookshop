import { Text, VStack } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

export const NoData = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <VStack>
      <CloseIcon
        boxSize={10}
        color="var(--chakra-colors-chakra-border-color)"
      />
      <Text>{t('generic.no-data')}</Text>
    </VStack>
  )
}
