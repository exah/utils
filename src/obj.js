// @flow
import { curryN, identity } from './fns'
import { toArr } from './arr'
import { isPlainObj, isArr } from './checks'

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
 * Like `Array#reduce`, but for objects.
 *
 * @example
 * import { reduceObj } from '@exah/utils'
 *
 * @example
 * const target = { john: 100, jack: 150, joseph: 170 }
 * const countValues = (acc, key, value) => acc + value
 *
 * reduceObj(countValues, target, 0) // → 420
 */

const reduceObj = (fn: Function, obj: Object, target: * = {}) =>
  Object
    .keys(obj)
    .reduce((acc, key, index) => fn(acc, key, obj[key], index, obj), target)

const curriedReduceObj = curryN(2, reduceObj)
export { curriedReduceObj as reduceObj }

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
  reduceObj((acc, key, value, index, src) => {
    const [ nextKey, nextVal ] = fn(key, value, index, obj)
    return { ...acc, [nextKey]: nextVal }
  }, obj)

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

const filterObj = (fn: Function, obj: Object) => reduceObj(
  (acc, key, value) => fn(key, value) ? { ...acc, [key]: value } : acc,
  obj
)

const curriedFilterObj = curryN(2, filterObj)
export { curriedFilterObj as filterObj }

/**
 * @private For `flattenObj`
 */

const isPlainObjectOrArray = (val: *): boolean => isPlainObj(val) || isArr(val)

/**
 * Flatten an object by traveling deep inside {@link Object} or {@link Array} values.
 *
 * @example
 * import { flattenObj } from '@exah/utils'
 *
 * @example
 * flattenObj({ a: { b: { c: { d: 1, e: [ 1, 2 ] } }, f: 0 })
 * // → { 'a.b.c.d': 1, 'a.b.c.e.0': 1, 'a.b.c.e.1': 2, f: 0 }
 */

export function flattenObj (
  obj: Object,
  joiner: string = '.',
  travelInside: (*) => boolean = isPlainObjectOrArray
): Object {
  return reduceObj((acc, key, value) => {
    if (travelInside(value)) {
      return {
        ...acc,
        ...mapObj(
          (subKey, subValue) => [ [ key, subKey ].join(joiner), subValue ],
          flattenObj(value, joiner)
        )
      }
    }

    return {
      ...acc,
      [key]: value
    }
  }, obj)
}

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

/**
 * Return last value if some of arguments is `null` or `undefined`
 *
 * @example
 * import { fallbackTo } from '@exah/utils'
 *
 * @example
 * const target = { a: { b: { c: 1 } }, d: 2, e: 3 }
 *
 * fallbackTo(target.a.b.c, 2) // → 1
 * fallbackTo(target.a.b.c.d, 2) // → 2
 * fallbackTo(target.nothing, null) // → null
 * fallbackTo(target.nothing, target.d, target.e) // → 2
 * fallbackTo(target.nothing, target.f, target.e) // → 3
 * fallbackTo(target.nothing) // → undefined
 */

export const fallbackTo = (...args: Array<*>) =>
  args.reduce((prev, val) => prev == null ? val : prev, null)
