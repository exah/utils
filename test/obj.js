import test from 'ava'

import {
  toObj,
  reduceObj,
  mapObj,
  flattenObj,
  filterObj,
  path,
  fallbackTo
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

  const objFromEntries = ([ key, value ]) => ({ [key]: value })

  t.deepEqual(
    toObj([ [ 'a', 'b' ] ], objFromEntries),
    { a: 'b' }
  )

  t.deepEqual(
    toObj(objFromEntries)([ [ 'a', 'b' ] ]),
    { a: 'b' }
  )
})

test('reduceObj', t => {
  t.is(reduceObj((acc, key, value) => acc + value, { a: 1, b: 2, c: 3 }, 0), 6)
})

test('mapObj', t => {
  t.deepEqual(
    mapObj((key, value) => [ value, key ], { a: 'b' }),
    { b: 'a' }
  )
})

test('flattenObj', t => {
  const target = {
    a: { b: { c: { d: 1, e: 'string' }, d: false } },
    e: [ 2, 'string', { a: { b: 2 }, c: 3 } ],
    f: null,
    g: 'string',
    h: 100
  }

  t.deepEqual(flattenObj(target), {
    'a.b.c.d': 1,
    'a.b.c.e': 'string',
    'a.b.d': false,
    'e.0': 2,
    'e.1': 'string',
    'e.2.a.b': 2,
    'e.2.c': 3,
    f: null,
    g: 'string',
    h: 100
  })
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

  t.is(path([ 'a', 'b', 'c', 'd' ])(target), 1)
  t.is(path('a.b.c.d')(target), 1)
  t.is(path('e.0')(target), 2)

  t.is(path('a.b.c.d.e.f.g')(target), undefined)
  t.is(path('e.1')(target), undefined)
  t.is(path(null)(target), undefined)
  t.is(path({})(target), undefined)
  t.is(path(0, null)(target), null)

  t.is(path()(target), target)
  t.is(path([])(target), target)
})

test('fallbackTo', t => {
  const target = { a: { b: { c: 1 } }, d: 2, e: 3 }

  t.is(fallbackTo(target.a.b.c, 2), 1)
  t.is(fallbackTo(target.a.b.c.d, 2), 2)
  t.is(fallbackTo(target.nothing, null), null)
  t.is(fallbackTo(target.nothing, target.d, target.e), 2)
  t.is(fallbackTo(target.nothing, target.f, target.e), 3)
  t.is(fallbackTo(target.nothing), undefined)
})
