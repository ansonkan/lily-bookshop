import { GridItem } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { SimpleField } from 'components'

import { BookCreateFields } from '../BookCreateForm'

export const BookEditFields = (): JSX.Element => {
  const { t } = useTranslation('cms')

  return (
    <BookCreateFields
      editMode={true}
      top={
        <>
          <GridItem>
            <SimpleField
              label={t('books.edit.fields.user_created') ?? 'User created'}
              name="user_created"
              isDisabled
            />
          </GridItem>

          <GridItem>
            <SimpleField
              label={t('books.edit.fields.date_created') ?? 'Date created'}
              name="date_created"
              type="date"
              isDisabled
            />
          </GridItem>

          <GridItem>
            <SimpleField
              label={t('books.edit.fields.user_updated') ?? 'User updated'}
              name="user_updated"
              isDisabled
            />
          </GridItem>

          <GridItem>
            <SimpleField
              label={t('books.edit.fields.date_updated') ?? 'Date updated'}
              name="date_updated"
              type="date"
              isDisabled
            />
          </GridItem>
        </>
      }
    />
  )
}
