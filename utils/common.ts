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

export const debounce = (
  func: (...arg: unknown[]) => unknown,
  duration = 1000
) => {
  let timeout: NodeJS.Timeout | undefined

  return (...args: unknown[]) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      return func.apply(this, args)
    }, duration)
  }
}
