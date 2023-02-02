import { GridItem } from '@chakra-ui/react'

import { SimpleField } from 'components'

import { BookCreateFields } from '../BooksCreateModal'

export const BookEditFields = (): JSX.Element => {
  return (
    <BookCreateFields
      extra={
        <>
          <GridItem>
            <SimpleField label="User created" name="user_created" isDisabled />
          </GridItem>

          <GridItem>
            <SimpleField
              label="Date created"
              name="date_created"
              type="date"
              isDisabled
            />
          </GridItem>

          <GridItem>
            <SimpleField label="User updated" name="user_updated" isDisabled />
          </GridItem>

          <GridItem>
            <SimpleField
              label="Date updated"
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
