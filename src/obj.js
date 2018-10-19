// @flow
import { curryN, identity } from './fns'
import { toArr } from './arr'

/**
 * Convert an array to object, by default works like "merge".
 *
 * @example
 * import { toObj } from '@exah/utils'
 *
 * @example
 * toObj({ a: 'b' }) // → { a: 'b' }
 * toObj([ { color: 'red' }, { size: 'big' } ]) // → { color: 'red', size: 'big' }
 * toObj([ [ 'a', 'b' ] ], ([ key, value ]) => ({ [key]: value })) // → { a: 'b' }
 */

export const toObj = (arr: Array<*>, fn: Function = identity): Object =>
  toArr(arr)
    .reduce((acc, ...rest) => ({ ...acc, ...fn(...rest) }), {})

/**
 * Like `Array#map`, but for objects.
 * Useful for renaming keys or converting values.
 *
 * @example
 * import { mapObj } from '@exah/utils'
 *
 * @example
 * mapObj((key, value, index, obj) => [ value, key ], { a: 'b' }) // → { b: 'a' }
 *
 * const swap = mapObj((key, value) => [ value, key ])
 * swap({ a: 'b' }) // → { b: 'a' }
 */

const mapObj = (fn: Function, obj: Object) =>
  Object
    .keys(obj)
    .reduce((acc, key, index) => {
      const [ nextKey, nextVal ] = fn(key, obj[key], index, obj)
      return {
        ...acc,
        [nextKey]: nextVal
      }
    }, {})

const curriedMapObj = curryN(2, mapObj)
export { curriedMapObj as mapObj }

/**
 * Filter object by key or value.
 *
 * @example
 * import { filterObj } from '@exah/utils'
 *
 * @example
 * filterObj((key) => key !== 'a', { a: 'b' }) // → {}
 *
 * const withoutZeros = filterObj((key, value) => value !== 0)
 * withoutZeros({ a: 0, b: 1, c: 3, d: 4 }) // → { b: 1, c: 3, d: 4 }
 */

const filterObj = (fn, obj) => {
  const target = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (fn(key, value)) {
        target[key] = value
      }
    }
  }

  return target
}

const curriedFilterObj = curryN(2, filterObj)
export { curriedFilterObj as filterObj }

/**
 * Get object value by path (string or as argument list)
 *
 * @example
 * import { path } from '@exah/utils'
 *
 * @example
 * const target = {
 *   a: { b: { c: { d: 1 } } },
 *   e: [ 2 ]
 * }
 *
 * path('a', 'b', 'c', 'd')(target) // → 1
 * path('a.b.c.d')(target) // → 1
 * path('e', 0)(target) // → 2
 * path('e.0')(target) // → 2
 * path('a', 'b', 'c', 'd', 'e')(target) // → undefined
 * path('e.1')(target) // → undefined
 */

export const path = (str: string = '', ...paths: Array<string>) => (obj: Object) =>
  str.split('.')
    .concat(paths)
    .reduce((a, c) => Object(a)[c], obj)
