import test from 'ava'

import {
  toArr,
  flattenArr,
  initArr
} from '../src'

test('flattenArr', t => {
  t.deepEqual(
    flattenArr([ 1, 2, 3, [ 4, 5, 6, [ 7 ] ] ]),
    [ 1, 2, 3, 4, 5, 6, 7 ]
  )
})

test('toArr', t => {
  t.deepEqual(toArr([ 1, 2, 3 ]), [ 1, 2, 3 ])
  t.deepEqual(toArr([]), [])
  t.deepEqual(toArr(null), [])
  t.deepEqual(toArr(1), [ 1 ])
  t.deepEqual(toArr({}), [ {} ])
})

test('initArr', t => {
  const length = 3
  const val = 'hey'
  t.deepEqual(initArr(length, val), [ val, val, val ])
  t.deepEqual(initArr(length), [ undefined, undefined, undefined ])
  t.deepEqual(initArr(0, val), [])
  t.deepEqual(initArr(), [])
})
