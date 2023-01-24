import type { FieldHelperProps, FieldInputProps } from 'formik'
import type { FormControlProps, NumberInputProps } from '@chakra-ui/react'

export type Value = string | number
export type RealValue = unknown

export interface Option {
  value: string
  label?: string
}

interface CommonProps
  extends Pick<NumberInputProps, 'min' | 'max' | 'step' | 'precision'> {
  type?: string
  placeholder?: string
  format?: (value: Value) => RealValue
  parse?: (value: RealValue) => Value
  // Multi-value version of text input, using `Textarea` as a easy workaround
  multiline?: boolean
  // for `Select`
  options?: Option[]
}

export interface SimpleFieldProps extends FormControlProps, CommonProps {
  name: string
  label?: string
  helperText?: string
  options?: Option[]
}

// might need to change `FieldInputProps`'s generic type when more input types are supported by this `SimpleField`
export interface SimpleFieldHelperProps extends CommonProps {
  field: FieldInputProps<Value>
  // I don't know how to type is to make the `setValue` accept anything, just let it with `unknown` for now
  helper: FieldHelperProps<RealValue>
}
