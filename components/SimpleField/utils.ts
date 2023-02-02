export const formatDate = (value?: string) => {
  if (value) {
    const d = new Date(value)
    // otherwise, the time will be set to 8:00 am in HK by default it seems, should to be to the timezone offset GMT+8
    d.setHours(0, 0, 0, 0)
    return d.valueOf()
  }
  return undefined
}

export const parseDate = (value?: number) => {
  if (typeof value !== 'number') return undefined

  const date = new Date(value)
  return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(
    2,
    '0'
  )}-${date.getDate().toString().padStart(2, '0')}`
}
