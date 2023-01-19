import { useEffect, useState } from 'react'

export const useDebounce = <T>(data: T, duration = 1000) => {
  const [value, setValue] = useState<T>(data)

  useEffect(() => {
    const timeout = setTimeout(() => setValue(data), duration)
    return () => clearTimeout(timeout)
  }, [data, duration])

  return value
}
