// @flow
import { isArr } from './checks'

/**
 * Wrap anything into array. <br />
 * If value is `null` or `undefined` returns empty array
 *
 * @example
 * import { toArr } from '@exah/utils'
 *
 * @example
 * toArr(1) // → [ 1 ]
 * toArr(null) // → []
 * toArr([ 1, 2, 3 ]) // → [ 1, 2, 3 ]
 */

export const toArr = (value: *): * => value == null ? [] : [].concat(value)

/**
 * Alias: `flatten`
 *
 * Flattens multidimensional arrays.
 *
 * @example
 * import { flattenArr } from '@exah/utils'
 *
 * @example
 * flattenArr([ 1, 2, 3 ]) // → [ 1, 2, 3 ]
 * flattenArr([ 1, 2, 3, [ 4, 5, 6, [ 7 ] ] ]) // → [ 1, 2, 3, 4, 5, 6, 7 ]
 */

export function flattenArr (arr: *): * {
  return arr.reduce(
    (acc: *, val: *): * => acc.concat(isArr(val) ? flattenArr(val) : val),
    []
  )
}

/**
 * Creates array of specified length and fills it with default value.
 *
 * @example
 * import { initArr } from '@exah/utils'
 *
 * @example
 * initArr(3, 'hey') // → [ 'hey', 'hey', 'hey' ]
 */

export const initArr = (length: number = 0, val: *): * => [ ...Array(length) ].map(_ => val)
