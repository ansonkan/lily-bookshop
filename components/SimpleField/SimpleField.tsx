import type { FieldInputProps } from 'formik'
import type { FormControlProps } from '@chakra-ui/react'

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react'
import { useField } from 'formik'

export interface Option {
  value: string
  label?: string
}

export interface SimpleFieldProps extends FormControlProps {
  name: string
  type?: string
  label?: string
  placeholder?: string
  helperText?: string
  options?: Option[]
}

export const SimpleField = ({
  name,
  type,
  label,
  placeholder,
  helperText,
  options,
  ...formControlProps
}: SimpleFieldProps): JSX.Element => {
  const [field, meta] = useField({ name, type })
  const isError = meta.touched && !!meta.error

  return (
    <FormControl {...formControlProps} isInvalid={isError}>
      {label && <FormLabel>{label}</FormLabel>}

      <SimpleFieldHelper
        type={type}
        placeholder={placeholder}
        options={options}
        {...field}
      />

      {isError ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

// might need to change `FieldInputProps`'s generic type when more input types are supported by this `SimpleField`
interface SimpleFieldHelperProps extends FieldInputProps<string | number> {
  type?: string
  placeholder?: string
  options?: Option[]
  // for `NumberInput`
  min?: number
  max?: number
  step?: number
  precision?: number
}

function SimpleFieldHelper({
  type,
  options,
  min,
  max,
  step,
  precision,
  ...field
}: SimpleFieldHelperProps) {
  /**
   * TODO:
   * 1. `Menu` might be the easier workaround for multi-select (e.g. categories)
   * 2. `Textarea` + newline split might be the easier workaround for multi-free-text-value (e.g. authors)
   */

  if (options) {
    return (
      <Select {...field}>
        {options.map(({ value, label }) => (
          <option value={value} key={value}>
            {label || value}
          </option>
        ))}
      </Select>
    )
  }

  if (type === 'number') {
    return (
      <NumberInput
        min={min}
        max={max}
        step={step}
        precision={precision}
        {...field}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  }

  return (
    <Input
      type={type}
      {...field}
      // next-dev.js?3515:20 Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.
      value={field.value || ''}
    />
  )
}
