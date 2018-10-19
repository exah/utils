import test from 'ava'

import {
  toObj,
  mapObj,
  filterObj,
  path
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

test('path', t => {
  const target = {
    a: { b: { c: { d: 1 } } },
    e: [ 2 ]
  }

  t.is(path('a', 'b', 'c', 'd')(target), 1)
  t.is(path('a.b.c.d')(target), 1)
  t.is(path('e', 0)(target), 2)
  t.is(path('e.0')(target), 2)

  t.is(path('a', 'b', 'c', 'd', 'e')(target), undefined)
  t.is(path('a.b.c.d.e.f.g')(target), undefined)
  t.is(path('e.1')(target), undefined)
})
