import type { InferType } from 'yup'

import { EditedBookSchema } from './schemas'

export type EditedBook = InferType<typeof EditedBookSchema>
