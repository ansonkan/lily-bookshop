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

export function getLastSplit(value: string, delimiter: string) {
  const splits = value.split(delimiter)
  return splits[splits.length - 1]
}
