import type { FileInputProps } from 'components'

import { array, mixed, object, string } from 'yup'

import { NewBookSchema } from '../BooksCreateModal/schemas'

export const EditedBookSchema = NewBookSchema.omit(['thumbnail']).concat(
  object({
    id: string().required(),
    // Note: to remove the `length(1)` limit because when editing, `FileInput` keep tracks of `to-be-removed` object for later processing too
    thumbnail: array().of(
      mixed<NonNullable<FileInputProps['value']>[number]>().required()
    ),
  })
)
