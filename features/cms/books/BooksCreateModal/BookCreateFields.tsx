import { CURRENCIES, LANG_CODES, STATUSES } from '@lily-bookshop/schemas'
import { Grid, GridItem } from '@chakra-ui/react'

import { SimpleField } from 'components'

export interface BookCreateFieldsProps {
  parentFieldName?: string
  index?: number
  extra?: React.ReactNode
}

export const BookCreateFields = ({
  index,
  parentFieldName,
  extra,
}: BookCreateFieldsProps) => {
  const namePrefix =
    typeof index === 'number' && parentFieldName
      ? `${parentFieldName}[${index}].`
      : ''

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={[2, 4]}>
      <GridItem>
        <SimpleField
          label="Status"
          name={`${namePrefix}status`}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Quantity"
          name={`${namePrefix}quantity`}
          type="number"
          min={0}
          precision={0}
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Currency"
          name={`${namePrefix}currency`}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Price"
          name={`${namePrefix}price`}
          type="number"
          min={0}
          precision={3}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Title"
          name={`${namePrefix}title`}
          type="text"
          isRequired
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Subtitle"
          name={`${namePrefix}subtitle`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Description"
          name={`${namePrefix}description`}
          type="text"
          multiline
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Authors"
          name={`${namePrefix}authors`}
          type="text"
          multiline
          format={(value) => `${value}`.split('\n')}
          parse={(value: string[]) => value.join('\n')}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="About the authors"
          name={`${namePrefix}about_the_authors`}
          type="text"
          multiline
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Thumbnail"
          name={`${namePrefix}thumbnail`}
          type="file"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Categories"
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

      {/* `categories` use `Menu` + a new collection for categories CRUD */}

      <GridItem>
        <SimpleField
          label="Publisher"
          name={`${namePrefix}publisher`}
          type="text"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Published date"
          name={`${namePrefix}published_date`}
          type="text"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="ISBN 13"
          name={`${namePrefix}ISBN_13`}
          type="text"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="ISBN 10"
          name={`${namePrefix}ISBN_10`}
          type="text"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Page count"
          name={`${namePrefix}page_count`}
          type="number"
          min={0}
          precision={0}
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Language"
          name={`${namePrefix}language`}
          options={LANG_CODES.map((c) => ({ value: c, label: c }))}
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Google book link"
          name={`${namePrefix}google_book_link`}
          type="url"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Storage location"
          name={`${namePrefix}storage_location`}
          type="text"
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Highlight order"
          name={`${namePrefix}highlight_order`}
          type="number"
          helperText="If this book needs to be put into the 'Featured' section, set a number here. Book with the lowest number placed first."
        />
      </GridItem>

      <GridItem>
        <SimpleField
          label="Date restocked"
          name={`${namePrefix}date_restocked`}
          type="date"
          format={(value?: string) =>
            value ? new Date(value).valueOf() : undefined
          }
          parse={(value?: number) => {
            if (typeof value !== 'number') return undefined

            const date = new Date(value)
            return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(
              2,
              '0'
            )}-${date.getDate().toString().padStart(2, '0')}`
          }}
        />
      </GridItem>

      {extra && <GridItem colSpan={2}>{extra}</GridItem>}
    </Grid>
  )
}
