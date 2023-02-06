import { CURRENCIES, LANG_CODES, STATUSES } from '@lily-bookshop/schemas'
import { Grid, GridItem } from '@chakra-ui/react'

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
  const namePrefix =
    typeof index === 'number' && parentFieldName
      ? `${parentFieldName}[${index}].`
      : ''

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {top}

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Status"
          name={`${namePrefix}status`}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Quantity"
          name={`${namePrefix}quantity`}
          type="number"
          min={0}
          precision={0}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Currency"
          name={`${namePrefix}currency`}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Price"
          name={`${namePrefix}price`}
          type="number"
          min={0}
          precision={3}
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Title"
          name={`${namePrefix}title`}
          type="text"
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
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

      <GridItem colSpan={COL_SPAN}>
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

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Language"
          name={`${namePrefix}language`}
          options={LANG_CODES.map((c) => ({ value: c, label: c }))}
          isRequired
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Highlight order"
          name={`${namePrefix}highlight_order`}
          type="number"
          helperText="If this book needs to be put into the 'Featured' section, set a number here. Book with the lowest number placed first."
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Date restocked"
          name={`${namePrefix}date_restocked`}
          type="date"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Publisher"
          name={`${namePrefix}publisher`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Published date"
          name={`${namePrefix}published_date`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="ISBN 13"
          name={`${namePrefix}ISBN_13`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="ISBN 10"
          name={`${namePrefix}ISBN_10`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Storage location"
          name={`${namePrefix}storage_location`}
          type="text"
        />
      </GridItem>

      <GridItem colSpan={COL_SPAN}>
        <SimpleField
          label="Page count"
          name={`${namePrefix}page_count`}
          type="number"
          min={0}
          precision={0}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SimpleField
          label="Google book link"
          name={`${namePrefix}google_book_link`}
          type="url"
        />
      </GridItem>

      {bottom}
    </Grid>
  )
}
