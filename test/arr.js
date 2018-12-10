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
  const val = 'val'
  const valFn = () => val

  t.deepEqual(initArr(length, val), [ val, val, val ])
  t.deepEqual(initArr(length, valFn), [ val, val, val ])
  t.deepEqual(initArr(length), [ 0, 1, 2 ])
  t.deepEqual(initArr(length, (i) => i), [ 0, 1, 2 ])
  t.deepEqual(initArr(0, val), [])
  t.deepEqual(initArr(), [])
  t.deepEqual(initArr(3, []), [ [], [], [] ])
})
