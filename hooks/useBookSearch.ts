import type { AutocompleteBookResult } from 'types'

import { useCallback, useEffect, useRef, useState } from 'react'
import { captureException } from '@sentry/nextjs'
import { useRouter } from 'next/router'

import { debounce } from 'utils'

export interface UseBookSearchProps {
  debounceDuration?: number
}

const cache = new Map<string, AutocompleteBookResult['books']>()

export const useBookSearch = ({ debounceDuration }: UseBookSearchProps) => {
  const { push, locale, query } = useRouter()
  const [options, setOptions] = useState<AutocompleteBookResult['books']>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const _v = typeof query?.q === 'string' ? query.q : ''
  const [value, setValue] = useState(_v)

  useEffect(() => {
    /**
     * might need to find a way to convey this `q` better across components and pages,
     * otherwise they will continue to be tangled together by this hardcoded property
     */
    setValue(_v)
  }, [_v])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autocomplete = useCallback(
    debounce((input: string) => {
      const cached = cache.get(input)
      if (cached) {
        return setOptions(cached)
      }

      const searchParams = new URLSearchParams({ input })

      fetch(`/api/autocomplete-books?${searchParams.toString()}`)
        .then((result) => result.json())
        .then((json) => {
          cache.set(input, json)
          setOptions(json)
        })
        .catch((err) => captureException(err))
    }, debounceDuration),
    []
  )

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.oninput = function () {
      // console.log('oninpit event: ', JSON.stringify(event, null, 2))

      autocomplete(value)
    }
  }, [autocomplete, value])

  const search = () => {
    push({ pathname: '/books', query: { q: value } }, undefined, { locale })
  }

  return {
    options,
    search,
    // input,
    // setInput,
  }
}
