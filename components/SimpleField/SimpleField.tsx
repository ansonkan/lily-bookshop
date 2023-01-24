import type { SimpleFieldHelperProps, SimpleFieldProps, Value } from './types'

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
  Textarea,
} from '@chakra-ui/react'
import { useField } from 'formik'

export const SimpleField = ({
  name,
  type,
  label,
  placeholder,
  helperText,
  format,
  parse,
  multiline,
  options,
  min,
  max,
  step,
  precision,
  ...formControlProps
}: SimpleFieldProps): JSX.Element => {
  const [field, meta, helper] = useField({ name, type })
  const isError = meta.touched && !!meta.error

  return (
    <FormControl {...formControlProps} isInvalid={isError}>
      {label && <FormLabel>{label}</FormLabel>}

      <SimpleFieldHelper
        type={type}
        placeholder={placeholder}
        field={field}
        helper={helper}
        format={format}
        parse={parse}
        multiline={multiline}
        options={options}
        min={min}
        max={max}
        step={step}
        precision={precision}
      />

      {isError ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

function SimpleFieldHelper({
  type,
  format = (value: Value) => value,
  parse,
  multiline,
  options,
  min,
  max,
  step,
  precision,
  field,
  helper,
}: SimpleFieldHelperProps) {
  /**
   * TODO:
   * 1. `Menu` might be the easier workaround for multi-select (e.g. categories)
   * 2. `Textarea` + newline split might be the easier workaround for multi-free-text-value (e.g. authors)
   */

  const _value = parse ? parse(field.value) : field.value

  if (options) {
    return (
      <Select
        {...field}
        value={_value}
        onChange={(event) => helper.setValue(format(event.target.value))}
      >
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
        value={_value}
        onChange={(str, num) => helper.setValue(format(isNaN(num) ? '' : num))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  }

  if (multiline) {
    return (
      <Textarea
        {...field}
        value={_value}
        onChange={(event) => helper.setValue(format(event.target.value))}
      />
    )
  }

  return (
    <Input
      type={type}
      {...field}
      // next-dev.js?3515:20 Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.
      value={_value || ''}
      onChange={(event) => helper.setValue(format(event.target.value))}
    />
  )
}
