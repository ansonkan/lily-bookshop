import { useEffect, useRef } from 'react'

export const usePrevious = <T>(data: T) => {
  const previous = useRef<T>(data)

  useEffect(() => {
    previous.current = data
  }, [data])

  return previous.current
}
