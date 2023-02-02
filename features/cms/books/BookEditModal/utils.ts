import { Storage } from 'aws-amplify'

export async function getPublicImage(key: string) {
  const result = await Storage.get(key, {
    level: 'public',
    download: true,
  })

  const body = result.Body

  if (!(body instanceof Blob)) {
    throw new Error('Downloaded body is not a Blob!')
  }

  const fileName = decodeURIComponent(getLastSplit(key, '/'))
  const fileType = 'image/' + getLastSplit(fileName, '.')

  return new File([body], fileName, { type: fileType })
}

export function getLastSplit(value: string, delimiter: string) {
  const splits = value.split(delimiter)
  return splits[splits.length - 1]
}
