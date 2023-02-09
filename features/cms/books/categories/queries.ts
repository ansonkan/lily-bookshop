import type { BookCategoryFE } from 'types'

import { API } from 'aws-amplify'

import useSWR from 'swr'

// export interface UseBookCategoriesProps {
//   locale?: string
// }

// type UseBookCategories = {
//   (): SWRResponse<{
//     book_categories: BookCategoryFE[]
//   }>
//   (props: UseBookCategoriesProps): SWRResponse<{
//     book_categories: Array<{ id: string; label: string }>
//   }>
// }

// TODO: let BE process the `locale`? to avoid over-fetching
export const useBookCategories = () => {
  return useSWR<{ book_categories: BookCategoryFE[] }>(
    ['apicore', '/book-categories'],
    ([apiName, url]) => API.get(apiName, url, {})
  )
}
