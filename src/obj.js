// @flow
import { curryN } from './fns'
import { isPlainObj, isObj, isArr } from './checks'

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
 * reduceObj(countValues, 0, target) // → 420
 */

const reduceObj = (fn: Function, target: *, input: Object) =>
  Object
    .keys(input)
    .reduce((acc, key, index) => fn(acc, key, input[key], index, input), target)

const curriedReduceObj = curryN(3, reduceObj)
export { curriedReduceObj as reduceObj }

/**
 * Like `Array#map`, but for objects.
 * Useful for renaming keys or converting values.
 *
 * @example
 * import { mapObj } from '@exah/utils'
 *
 * @example
 * mapObj((key, value, index, obj) => ({ [value]: key }), { a: 'b' }) // → { b: 'a' }
 *
 * const swap = mapObj((key, value) => ({ [value]: key }))
 * swap({ a: 'b' }) // → { b: 'a' }
 */

const mapObj = (fn: Function, obj: Object) =>
  reduceObj((acc, key, value, index, src) => ({
    ...acc,
    ...fn(key, value, index, obj)
  }), {}, obj)

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
  {},
  obj
)

const curriedFilterObj = curryN(2, filterObj)
export { curriedFilterObj as filterObj }

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

export const fallbackTo = (...args: *) =>
  args.reduce((prev, val) => prev == null ? val : prev, undefined)

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
 * path([ 'a', 'b', 'c', 'd' ])(target) // → 1
 * path('a.b.c.d')(target) // → 1
 * path('e.0')(target) // → 2
 * path('e.1')(target) // → undefined
 * path([ 'e', '0' ])(target) // → 2
 */

export const path = (
  input: string | Array<string> = [],
  defaultValue: *
): Function => (obj: *) => fallbackTo(
  // $FlowFixMe
  (isArr(input) ? input : String(input).split('.')).reduce((a, c) => Object(a)[c], obj),
  defaultValue
)

/**
 * @private Options for `flattenObj`
 */

type OptionsFlattenObj = {
  joiner: string,
  shouldFlattenValue: (value: *) => boolean
}

/**
 * Flatten an object by traveling deep inside {@link Object} or {@link Array} values.
 *
 * @param {Object} input
 * @param {Object} [options]
 *
 * @example
 * import { flattenObj } from '@exah/utils'
 *
 * @example
 * flattenObj({ a: { b: { c: { d: 1, e: [ 1, 2 ] } }, f: 0 })
 * // → { 'a.b.c.d': 1, 'a.b.c.e.0': 1, 'a.b.c.e.1': 2, f: 0 }
 */

export function flattenObj (input: Object, {
  joiner = '.',
  shouldFlattenValue = (val) => isPlainObj(val) || isArr(val)
}: OptionsFlattenObj = {}): Object {
  function serialize (data: Object): Object {
    return reduceObj((acc, key, value) => {
      if (shouldFlattenValue(value)) {
        return {
          ...acc,
          ...mapObj(
            (subKey, subValue) => ({ [[ key, subKey ].join(joiner)]: subValue }),
            serialize(value)
          )
        }
      }

      return {
        ...acc,
        [key]: value
      }
    }, {}, data)
  }

  return serialize(input)
}

/**
 * @private Options for `query`
 */

type OptionsQueryObj = {
  joiner: string,
  encodeKey: (key: string, parent: ? Object, parentKey: string) => string,
  encodeValue: (value: *) => string,
  shouldSerializeValue: (value: *) => boolean
}

/**
 * Convert object to query string
 *
 * @param {Object} input
 * @param {Object} [options]
 *
 * @example
 * import { query } from '@exah/utils'
 *
 * @example
 * const src = { foo: 'bar', baz: [ 'foo', 'bar' ] }
 *
 * query(src) // → 'foo=bar&baz[]=foo&baz[]=bar'
 */

export function queryObj (input: Object, {
  joiner = '&',
  encodeKey = (key, parent, parentKey) => parentKey + (isArr(parent) ? '[]' : key),
  encodeValue = encodeURIComponent,
  shouldSerializeValue = isArr
}: OptionsQueryObj = {}): string {
  // $FlowFixMe
  function serialize (data, parentKey = '', target = []) {
    return reduceObj((acc, key, value) => {
      if (value == null) {
        return acc
      }

      if (!shouldSerializeValue(value)) {
        return acc.concat(`${encodeKey(key, data, parentKey)}=${encodeValue(value)}`)
      }

      return serialize(value, key, acc)
    }, target, data)
  }

  return serialize(Object(input)).join(joiner)
}

/**
 * Deep merge multiple Objects
 *
 * @example
 * import { deepMerge } from '@exah/utils'
 *
 * @example
 * deepMerge(
 *   { a: 1, b: { c: 1 }, e: 1, h: [ 0, 1 ] },
 *   { a: 2, b: { d: 2 }, f: 2, h: [ 2, 3 ] },
 *   { a: 3, b: { c: 3 }, g: 3 }
 * )
 *
 * // → { a: 3, b: { c: 3, d: 2 }, e: 1, f: 2, g: 3, h: [ 0, 1, 2, 3 ] })
 */

export function deepMerge (...input: Object[]) {
  return input.reduce((acc, source) => {
    if (isArr(source)) {
      return [ ...(isArr(acc) ? acc : []), ...source ]
    }

    if (isObj(source)) {
      return {
        ...acc,
        ...mapObj((key, value) => ((isObj(value) && acc.hasOwnProperty(key))
          ? { [key]: deepMerge(acc[key], value) }
          : { [key]: value }
        ), source)
      }
    }

    return acc
  }, {})
}
