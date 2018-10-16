import test from 'ava'

import {
  toObj,
  mapObj,
  filterObj
} from '../src'

test('toObj', t => {
  t.deepEqual(
    toObj([ { color: 'red' }, { size: 'big' } ]),
    { color: 'red', size: 'big' }
  )

  t.deepEqual(
    toObj({ a: 'b' }),
    { a: 'b' }
  )

  t.deepEqual(
    toObj(
      [ [ 'a', 'b' ] ],
      ([ key, value ]) => ({ [key]: value })
    ),
    { a: 'b' }
  )
})

test('mapObj', t => {
  t.deepEqual(
    mapObj((key, value) => [ value, key ], { a: 'b' }),
    { b: 'a' }
  )
})

test('filterObj', t => {
  t.deepEqual(
    filterObj((key) => key !== 'a', { a: 'b' }),
    {}
  )

  const withoutZeros = filterObj((key, value) => value !== 0)

  t.deepEqual(
    withoutZeros({ a: 0, b: 1, c: 3, d: 4 }),
    { b: 1, c: 3, d: 4 }
  )
})
