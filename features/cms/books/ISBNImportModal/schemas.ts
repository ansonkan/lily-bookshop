import { ISBNSchema, cleanStrArray } from '@lily-bookshop/schemas'

import { array, lazy, object } from 'yup'

export const ISBNImportSchema = object({
  isbnList: array(
    lazy((val) =>
      val.length > 10
        ? ISBNSchema().length(13).required().nonNullable()
        : ISBNSchema().length(10).required().nonNullable()
    )
  )
    .min(1)
    .required()
    .transform(cleanStrArray),
})
