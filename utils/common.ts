import type { NonNullableFields } from 'types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeNullProps<T extends Record<string, any>>(obj: T) {
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .reduce(
      (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
      {} as NonNullableFields<T>
    )
}

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  delay = 1000
) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
