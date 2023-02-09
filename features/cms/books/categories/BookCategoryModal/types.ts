import type { InferType } from 'yup'

import { EditedBookCategorySchema } from './schemas'

export type EditedBookCategory = InferType<typeof EditedBookCategorySchema>
