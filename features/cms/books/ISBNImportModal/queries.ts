import type { GoogleBookSearchResult } from './types'

type GoogleBook = NonNullable<GoogleBookSearchResult['items']>[number]

export const mapGoogleBooks = async (isbnList: string[]) => {
  const results = await Promise.allSettled<Promise<GoogleBookSearchResult>>(
    isbnList.map((isbn) =>
      fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(
        (r) => r.json()
      )
    )
  )

  const fails: string[] = []
  const matches: GoogleBook[] = []

  for (let r = 0; r < results.length; r++) {
    const currentResult = results[r]
    const targetISBN = isbnList[r]

    if (
      currentResult.status === 'rejected' ||
      currentResult?.value?.items === undefined
    ) {
      fails.push(targetISBN)
      continue
    }

    let matchedGoogleBook: GoogleBook | undefined
    for (let i = 0; i < currentResult.value.items.length; i++) {
      const currentItem = currentResult.value.items[i]

      if (
        currentItem.volumeInfo?.industryIdentifiers?.find(
          (identify) => identify.identifier === targetISBN
        )
      ) {
        matchedGoogleBook = currentItem
        break
      }
    }

    if (matchedGoogleBook) {
      matches.push(matchedGoogleBook)
      continue
    }

    fails.push(targetISBN)
  }

  return { matches, fails }
}
