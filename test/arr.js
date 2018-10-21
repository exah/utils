import test from 'ava'

import {
  toArr,
  flattenArr
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
