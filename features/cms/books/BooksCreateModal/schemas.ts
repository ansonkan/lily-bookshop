import type { FileInputProps } from 'components'

import { array, mixed, object } from 'yup'
import { BookDocumentSchema } from '@lily-bookshop/schemas'

export const NewBookSchema = BookDocumentSchema.omit([
  'date_created',
  'user_created',
  'date_updated',
  'user_updated',
  'thumbnail',
]).concat(
  object({
    thumbnail: array()
      .length(1)
      .of(mixed<NonNullable<FileInputProps['value']>[number]>().required()),
    // .test('file-check', (value, { path }) => {
    //   if (!value || value.length === 0) return true

    //   if (value[0] instanceof File) {
    //     return true
    //   }

    //   return new ValidationError(
    //     `${path} is not a valid File array`,
    //     value,
    //     path
    //   )
    // }),
  })
)

export const BooksCreateFormikSchema = object({
  books: array().required().min(1).of(NewBookSchema),
})
