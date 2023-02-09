import { object, string } from 'yup'
import { BookCategoryDocumentSchema } from '@lily-bookshop/schemas'

export const EditedBookCategorySchema = BookCategoryDocumentSchema.concat(
  object({
    id: string().required(),
  })
)
