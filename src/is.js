// @flow
import { curryN } from './fns'

/**
 * Checks if `val` has prototype of an `Object`. (Alternative to `instanceof`)
 *
 * @param obj — Base `Object`
 * @param val — Value to test
 *
 *
 * @example
 * import { is } from '@exah/utils'
 *
 * function Fn () {}
 * const Obj = {}
 *
 * is(Fn, new Fn()) // → true
 * is(Obj, Object.create(Obj)) // → true
 * is(Number, 1) // → true
 * is(Number, NaN) // → true
 * is(String, '') // → true
 * is(Array, []) // → true
 * is(Function, Fn) // → true
 * is(Set, new Set()) // → true
 * is(Map, new Map()) // → true
 * is(Promise, Promise.resolve()) // → true
 * is(Object, [])) // → true
 * is(Object, {})) // → true
 * is(Object, new Fn()) // → true
 * is(Array, {}) // → false
 * is(Object, null) // → false
 *
 * @example
 * const isNum = is(Number)
 * isNum(1) // → true
 */

const is = (obj: Object, val: *): boolean => (
  obj != null &&
  val != null &&
  Object.prototype.isPrototypeOf.call((obj.prototype || obj), Object(val))
)

const curriedIs = curryN(2, is)

/**
 * Check if `val` primitive type is `function`.
 *
 * @example
 * import { isFn } from '@exah/utils'
 *
 * isFn(() => ()) // → true
 * isFn(1) // → false
 */

const isFn = (val: *): %checks => typeof val === 'function'

/**
 * Check if `val` primitive type is `boolean`.
 *
 * @example
 * import { isBool } from '@exah/utils'
 *
 * isBool(true) // → true
 * isBool(false) // → true
 * isBool(0) // → false
 */

const isBool = (val: *): %checks => typeof val === 'boolean'

/**
 * @private
 */

const isNaN = (val: *) => val !== val // eslint-disable-line no-self-compare

/**
 * Check if `val` primitive type is `number`, but not `NaN`.
 *
 * @example
 * import { isNum } from '@exah/utils'
 *
 * isNum(1) // → true
 * isNum(10) // → true
 * isNum(NaN) // → false
 */

const isNum = (val: *): %checks => !isNaN(val) && typeof val === 'number'

/**
 * Check if `val` primitive type is `string`.
 *
 * @example
 * import { isStr } from '@exah/utils'
 *
 * isStr('') // → true
 * isStr([]) // → false
 */

const isStr = (val: *): %checks => typeof val === 'string'

/**
 * Check if `val` is an `Array`.
 *
 * @example
 * import { isArr } from '@exah/utils'
 *
 * isArr([]) // → true
 * isArr({ length: 3 }) // → false
 */

const isArr = (val: *): %checks => Array.isArray(val)

/**
 * Check if `val` is `null` or `undefined`.
 *
 * @example
 * import { isNil } from '@exah/utils'
 *
 * isNil(null) // → true
 * isNil(undefined) // → true
 * isNil(0) // → false
 */

const isNil = (val: *): %checks => val == null

/**
 * Check if `val` is empty. Works with `Array`, `Objects`, `Map`, `Set` and `null`
 *
 * @example
 * import { isEmpty } from '@exah/utils'
 *
 * isEmpty({}) // → true
 * isEmpty([]) // → true
 * isEmpty('') // → true
 * isEmpty(null) // → true
 * isEmpty(new Map()) // → true
 * isEmpty(new Set()) // → true
 * isEmpty(new Set([ 1, 2, 3 ])) // → false
 * isEmpty({ foo: 'bar' }) // → false
 * isEmpty([ 1, 2, 3 ]) // → false
 */

const isEmpty = (val: Object) => val == null || val === '' || (
  (is(Map, val) || is(Set, val))
    ? val.size === 0
    : Object.keys(val).length === 0
)

/**
 * Check if `val` is "plain" `Object`.
 *
 * @example
 * import { isPlainObj } from '@exah/utils'
 *
 * isPlainObj({}) // → true
 * isPlainObj([]) // → false
 * isPlainObj(new Map()) // → false
 * isPlainObj(new Set()) // → false
 * isPlainObj(Object.create(null)) // → false
 *
 * function Fn () {}
 * isPlainObj(new Fn()) // → false
 */

const isPlainObj = (val: *): boolean => (
  Object.prototype.toString.call(val) === '[object Object]' &&
  Object.getPrototypeOf(val) === Object.prototype
)

export {
  curriedIs as is,
  isFn,
  isBool,
  isNaN,
  isNum,
  isStr,
  isArr,
  isNil,
  isEmpty,
  isPlainObj
}
