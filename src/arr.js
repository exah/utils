// @flow
import { isArr } from './logic'

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
 * Flattens multidimensional arrays.
 *
 * @example
 * import { flatten } from '@exah/utils'
 *
 * @example
 * flatten([ 1, 2, 3 ]) // → [ 1, 2, 3 ]
 * flatten([ 1, 2, 3, [ 4, 5, 6, [ 7 ] ] ]) // → [ 1, 2, 3, 4, 5, 6, 7 ]
 */

export function flatten (arr: Array<*>): Array<*> {
  return arr.reduce((acc, val) => acc.concat(isArr(val) ? flatten(val) : val), [])
}
