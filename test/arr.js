import test from 'ava'

import {
  toArr,
  flatten
} from '../src'

test('flatten', t => {
  t.deepEqual(
    flatten([ 1, 2, 3, [ 4, 5, 6, [ 7 ] ] ]),
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
