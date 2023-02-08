import { Button, Grid, GridItem, Text } from '@chakra-ui/react'
import { CURRENCIES, LANG_CODES, STATUSES } from '@lily-bookshop/schemas'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { SimpleField } from 'components'

export interface BookCreateFieldsProps {
  parentFieldName?: string
  index?: number
  top?: React.ReactNode
  bottom?: React.ReactNode
}

const COL_SPAN = [2, 1]

export const BookCreateFields = ({
  index,
  parentFieldName,
  top,
  bottom,
}: BookCreateFieldsProps) => {
  const { t } = useTranslation('cms')
  const [showMore, setShowMore] = useState(false)

  const namePrefix =
    typeof index === 'number' && parentFieldName
      ? `${parentFieldName}[${index}].`
      : ''

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
      {top}

      <GridItem colSpan={2}>
        <Text as="h3" fontSize="xl" fontWeight="bold">
          {t('books.add.basic-information')}
        </Text>
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.status') ?? 'Status'}
          name={`${namePrefix}status`}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.quantity') ?? 'Quantity'}
          name={`${namePrefix}quantity`}
          type="number"
          min={0}
          precision={0}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.currency') ?? 'Currency'}
          name={`${namePrefix}currency`}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.price') ?? 'Price'}
          name={`${namePrefix}price`}
          type="number"
          min={0}
          precision={3}
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.title') ?? 'Title'}
          name={`${namePrefix}title`}
          type="text"
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.subtitle') ?? 'Subtitle'}
          name={`${namePrefix}subtitle`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label={t('books.add.fields.description') ?? 'Description'}
          name={`${namePrefix}description`}
          type="text"
          multiline
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label={t('books.add.fields.authors') ?? 'Authors'}
          name={`${namePrefix}authors`}
          type="text"
          multiline
          format={(value) => (value ? `${value}`.split('\n') : '')}
          parse={(value: string[]) => value?.join('\n')}
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.categories') ?? 'Categories'}
          name={`${namePrefix}categories`}
          options={['fiction', 'si-fi', 'english', 'chinese'].map((c) => ({
            value: c,
          }))}
          multiple
          // this is a placeholder until the `book_categories` collection and APIs are ready
          format={(value?: string) => (value ? [value] : undefined)}
          parse={(value?: string[]) => value?.[0]}
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.language') ?? 'Language'}
          name={`${namePrefix}language`}
          options={LANG_CODES.map((c) => ({ value: c, label: c }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label={t('books.add.fields.thumbnail') ?? 'Thumbnail'}
          name={`${namePrefix}thumbnail`}
          type="file"
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label={t('books.add.fields.storage_location') ?? 'Storage location'}
          name={`${namePrefix}storage_location`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.isbn_13') ?? 'ISBN 13'}
          name={`${namePrefix}ISBN_13`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label={t('books.add.fields.isbn_10') ?? 'ISBN 10'}
          name={`${namePrefix}ISBN_10`}
          type="text"
        />
      </GridItem>

      {showMore && (
        <>
          <GridItem colSpan={2}>
            <Text as="h3" fontSize="xl" fontWeight="bold" mt={8}>
              {t('books.add.additional-information')}
            </Text>
          </GridItem>

          <GridItem colSpan={2}>
            <SimpleField
              label={
                t('books.add.fields.about_the_authors') ?? 'About the authors'
              }
              name={`${namePrefix}about_the_authors`}
              type="text"
              multiline
            />
          </GridItem>

          <GridItem colSpan={2}>
            <SimpleField
              label={t('books.add.fields.other_photos') ?? 'Other photos'}
              name={`${namePrefix}other_photos`}
              type="file"
              multiple
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={
                t('books.add.fields.highlight_order.label') ?? 'Highlight order'
              }
              name={`${namePrefix}highlight_order`}
              type="number"
              helperText={t('books.add.fields.highlight_order.helper') ?? ''}
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={t('books.add.fields.date_restocked') ?? 'Date restocked'}
              name={`${namePrefix}date_restocked`}
              type="date"
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={t('books.add.fields.publisher') ?? 'Publisher'}
              name={`${namePrefix}publisher`}
              type="text"
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={t('books.add.fields.published_date') ?? 'Published date'}
              name={`${namePrefix}published_date`}
              type="text"
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={t('books.add.fields.page_count') ?? 'Page count'}
              name={`${namePrefix}page_count`}
              type="number"
              min={0}
              precision={0}
            />
          </GridItem>

          <GridItem colSpan={COL_SPAN}>
            <SimpleField
              label={
                t('books.add.fields.google_book_link') ?? 'Google book link'
              }
              name={`${namePrefix}google_book_link`}
              type="url"
            />
          </GridItem>
        </>
      )}

      <GridItem colSpan={2}>
        <Button
          onClick={() => setShowMore((prev) => !prev)}
          variant="outline"
          w="full"
        >
          {t(showMore ? 'books.add.hide-more' : 'books.add.show-more')}
        </Button>
      </GridItem>

      {bottom}
    </Grid>
  )
}
