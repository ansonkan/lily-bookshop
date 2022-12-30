import { expect, test } from '@playwright/test'

import { removeNullProps } from 'utils'

test('`removeNullProps` removes `null` and `undefined` properties in the first layer', async () => {
  const actual = removeNullProps({
    a: 1,
    b: 'string',
    c: null,
    d: undefined,
    e: { a: null, b: null },
    f: [],
    g: [{ nested: { a: null, b: null } }],
  })

  expect(actual).toEqual({
    a: 1,
    b: 'string',
    e: { a: null, b: null },
    f: [],
    g: [{ nested: { a: null, b: null } }],
  })

  expect(Object.keys(actual)).toEqual(['a', 'b', 'e', 'f', 'g'])
})
