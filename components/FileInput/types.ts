export type NewFileValue = { type: 'newly-uploaded-file'; file: File }

export type FileValue =
  | NewFileValue
  | {
      type: 's3-object'
      status: 'unchanged' | 'to-be-removed'
      key: string
    }
