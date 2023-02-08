import type { FileValue } from 'components'

import { array, mixed, object, string } from 'yup'

import { NewBookSchema } from '../BookCreateForm/schemas'

export const EditedBookSchema = NewBookSchema.omit([
  'thumbnail',
  'other_photos',
]).concat(
  object({
    id: string().required(),
    // Note: to remove the `length(1)` limit because when editing, `FileInput` keep tracks of `to-be-removed` object for later processing too
    thumbnail: array().max(1).of(mixed<FileValue>().required()),
    other_photos: array().max(5).of(mixed<FileValue>().required()),
  })
)
