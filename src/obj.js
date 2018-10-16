// @flow
import { curryN, identity } from './fns'
import { toArr } from './arr'

/**
 * Convert an array to object, by default works like "merge".
 *
 * @example
 * import { toObj } from '@exah/utils'
 *
 * toObj([ { color: 'red' }, { size: 'big' } ])
 * // → { color: 'red', size: 'big' }
 *
 * toObj({ a: 'b' })
 * // → { a: 'b' }
 *
 * toObj([ [ 'a', 'b' ] ], ([ key, value ]) => ({ [key]: value }))
 * // → { a: 'b' }
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
 * mapObj((key, value, index, obj) => [ value, key ], { a: 'b' })
 * // → { b: 'a' }
 *
 * const swap = mapObj((key, value) => [ value, key ])
 * swap({ a: 'b' })
 * // → { b: 'a' }
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
 * filterObj((key) => key !== 'a', { a: 'b' })
 * // → {}
 *
 * const withoutZeros = filterObj((key, value) => value !== 0)
 * withoutZeros({ a: 0, b: 1, c: 3, d: 4 })
 * // → { b: 1, c: 3, d: 4 }
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

export const fallbackTo = (...args: Array<*>) =>
  args.reduce((prev, val) => prev == null ? val : prev, null)

export const path = (str: string = '', ...paths: Array<string>) => (obj: Object) =>
  str.split('.')
    .concat(paths)
    .reduce((a, c) => Object(a)[c], obj)

export const pathOr = (fallback: *) => (...paths: Array<string>) => (obj: Object) =>
  fallbackTo(path(...paths)(obj), fallback)
