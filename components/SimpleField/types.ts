import type { FieldHelperProps, FieldInputProps } from 'formik'
import type { FormControlProps, NumberInputProps } from '@chakra-ui/react'

export interface Option {
  value: string
  label?: string
}

interface CommonProps
  extends Pick<NumberInputProps, 'min' | 'max' | 'step' | 'precision'> {
  type?: string
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse?: (value: any) => any
  // Multi-value version of text input, using `Textarea` as a easy workaround
  multiline?: boolean
  rows?: number
  // for `Select`
  options?: Option[]
  multiple?: boolean
  // for `FileInput`
  accept?: string[]
  maxSizePerFile?: number
  maxFiles?: number
}

export interface SimpleFieldProps extends FormControlProps, CommonProps {
  name: string
  label?: string
  helperText?: string
  options?: Option[]
}

// might need to change `FieldInputProps`'s generic type when more input types are supported by this `SimpleField`
export interface SimpleFieldHelperProps<V> extends CommonProps {
  field: FieldInputProps<V>
  // I don't know how to type is to make the `setValue` accept anything, just let it with `unknown` for now
  helper: FieldHelperProps<unknown>
}
