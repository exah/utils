import test from 'ava'

import {
  reduceObj,
  mapObj,
  flattenObj,
  filterObj,
  path,
  deepMerge,
  fallbackTo,
  queryObj
} from '../src'

test('reduceObj', t => {
  t.is(reduceObj((acc, key, value) => acc + value, 0, { a: 1, b: 2, c: 3 }), 6)
})

test('mapObj', t => {
  t.deepEqual(
    mapObj((key, value) => ({ [value]: key }), { a: 'b' }),
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
  t.is(fallbackTo(), undefined)
})

test('queryObj', t => {
  const input = { foo: 'bar', baz: [ 'foo', 'bar', 'baz' ], null: null, false: false, true: true }

  t.is(queryObj(input), 'foo=bar&baz[]=foo&baz[]=bar&baz[]=baz&false=false&true=true')
})

test('deepMerge', t => {
  const src1 = { a: 1, b: { c: 1, a: { b: { c: { d: null } } } }, e: 1, h: [ 0, 1, 2 ] }
  const src2 = { a: 2, b: { d: 2 }, f: 2, h: [ 3, 4, 5 ] }
  const src3 = { a: 3, b: { c: 3, a: { b: { c: null } } }, g: 3 }

  t.deepEqual(deepMerge(src1, src2, src3), {
    a: 3,
    b: { c: 3, d: 2, a: { b: { c: null } } },
    e: 1,
    f: 2,
    g: 3,
    h: [ 0, 1, 2, 3, 4, 5 ]
  })

  t.deepEqual(deepMerge(src3, src2, src1), {
    a: 1,
    b: { c: 1, d: 2, a: { b: { c: { d: null } } } },
    e: 1,
    f: 2,
    g: 3,
    h: [ 3, 4, 5, 0, 1, 2 ]
  })
})
