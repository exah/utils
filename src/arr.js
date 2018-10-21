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

export const toArr = (value: any): Array<*> => value == null ? [] : [].concat(value)

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

export function flattenArr (arr: Array<*>): Array<*> {
  return arr.reduce((acc, val) => acc.concat(isArr(val) ? flattenArr(val) : val), [])
}
