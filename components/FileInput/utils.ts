export const isValidFileType = (
  file: File,
  acceptedFileTypes: string[]
): boolean => {
  const fileName = file.name || ''
  const mimeType = (file.type || '').toLowerCase()
  const baseMimeType = mimeType.replace(/\/.*$/, '')
  return acceptedFileTypes.some((type) => {
    const validType = type.trim().toLowerCase()
    if (validType.charAt(0) === '.') {
      return fileName.toLowerCase().endsWith(validType)
    } else if (validType.endsWith('/*')) {
      // This is something like a image/* mime type
      return baseMimeType === validType.replace(/\/.*$/, '')
    }
    return mimeType === validType
  })
}

// Copied from https://github.com/aws-amplify/amplify-ui/tree/main/packages/react/src/components/Storage/FileUploader
export const returnAcceptedFiles = (
  files: File[],
  acceptedFileTypes: string[]
): File[] => {
  // Remove any files that are not in the accepted file list
  return files.filter((file) => isValidFileType(file, acceptedFileTypes))
}

export const fileListToArray = (list: FileList) => {
  const files: File[] = []
  for (let i = 0; i < list.length; i++) {
    files.push(list[i])
  }
  return files
}

// Copied from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
export const returnFileSize = (number: number) => {
  if (number < 1024) {
    return `${number} bytes`
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`
  }
}
