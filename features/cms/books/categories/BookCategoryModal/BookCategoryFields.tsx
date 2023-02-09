import { Grid, GridItem } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { SimpleField } from 'components'

const COL_SPAN = [2, 1]

export const BookCategoryFields = () => {
  const { t } = useTranslation('cms')

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={
            t('book-categories.book-category-table.columns.en') ?? 'English'
          }
          name="en"
          type="text"
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={
            t('book-categories.book-category-table.columns.zh_HK') ?? 'Chinese'
          }
          name="zh_HK"
          type="text"
          isRequired
        />
      </GridItem>
    </Grid>
  )
}
