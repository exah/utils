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
 * @example
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

export { curriedIs as is }

/**
 * Check if `val` primitive type is `function`.
 *
 * @example
 * import { isFn } from '@exah/utils'
 *
 * @example
 * isFn(() => ()) // → true
 * isFn(1) // → false
 */

export const isFn = (val: *)/*:: : boolean %checks */ => typeof val === 'function'

/**
 * Check if `val` primitive type is `boolean`.
 *
 * @example
 * import { isBool } from '@exah/utils'
 *
 * @example
 * isBool(true) // → true
 * isBool(false) // → true
 * isBool(0) // → false
 */

export const isBool = (val: *)/*:: : boolean %checks */ => typeof val === 'boolean'

/**
 * @private used for `isNum`
 */

export const isNaN = (val: *) => val !== val // eslint-disable-line no-self-compare

/**
 * Check if `val` primitive type is `number`, but not `NaN`.
 *
 * @example
 * import { isNum } from '@exah/utils'
 *
 * @example
 * isNum(1) // → true
 * isNum(10) // → true
 * isNum(NaN) // → false
 */

export const isNum = (val: *)/*:: : boolean %checks */ => !isNaN(val) && typeof val === 'number'

/**
 * Check if `val` primitive type is `string`.
 *
 * @example
 * import { isStr } from '@exah/utils'
 *
 * @example
 * isStr('') // → true
 * isStr([]) // → false
 */

export const isStr = (val: *)/*:: : boolean %checks */ => typeof val === 'string'

/**
 * Check if `val` primitive type is `object`.
 *
 * @example
 * import { isObj } from '@exah/utils'
 *
 * @example
 * isObj({}) // → true
 * isObj([]) // → true
 * isObj(new Map()) // → true
 * isObj(null) // → false
 */

export const isObj = (val: *)/*:: : boolean %checks */ => val !== null && typeof val === 'object'

/**
 * Check if `val` is an `Array`.
 *
 * @example
 * import { isArr } from '@exah/utils'
 *
 * @example
 * isArr([]) // → true
 * isArr({ length: 3 }) // → false
 */

export const isArr = (val: *)/*:: : boolean %checks */ => Array.isArray(val)

/**
 * Check if `val` is `null` or `undefined`.
 *
 * @example
 * import { isNil } from '@exah/utils'
 *
 * @example
 * isNil(null) // → true
 * isNil(undefined) // → true
 * isNil(0) // → false
 */

export const isNil = (val: *)/*:: : boolean %checks */ => val == null

/**
 * Check if `val` is thenable
 *
 * @example
 * import { isThenable } from '@exah/utils'
 *
 * @example
 * isThenable(Promise.resolve()) // → true
 * isThenable({ then () {} }) // → true
 * isThenable({}) // → false
 */

export const isThenable = (val: *): boolean => isObj(val) && isFn(val.then)

/**
 * Check if `val` is empty object. Tests `Array`, `Objects`, `Map`, `Set`
 *
 * @example
 * import { isEmptyObj } from '@exah/utils'
 *
 * @example
 * isEmptyObj({}) // → true
 * isEmptyObj([]) // → true
 * isEmptyObj('') // → false
 * isEmptyObj(null) // → false
 * isEmptyObj(new Map()) // → true
 * isEmptyObj(new Set()) // → true
 * isEmptyObj(new Set([ 1, 2, 3 ])) // → false
 * isEmptyObj({ foo: 'bar' }) // → false
 * isEmptyObj([ 1, 2, 3 ]) // → false
 */

export const isEmptyObj = (val: Object) => Boolean(val) && (
  (is(Map, val) || is(Set, val))
    ? val.size === 0
    : Object.keys(val).length === 0
)

/**
 * Check if `val` is empty. Tests `Array`, `Objects`, `Map`, `Set`, `String` and `null`
 *
 * @example
 * import { isEmpty } from '@exah/utils'
 *
 * @example
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

export const isEmpty = (val: *) =>
  val == null || val === '' || isEmptyObj(val)

/**
 * Check if `val` is "plain" `Object`.
 *
 * @example
 * import { isPlainObj } from '@exah/utils'
 *
 * @example
 * isPlainObj({}) // → true
 * isPlainObj([]) // → false
 * isPlainObj(new Map()) // → false
 * isPlainObj(new Set()) // → false
 * isPlainObj(Object.create(null)) // → false
 *
 * function Fn () {}
 * isPlainObj(new Fn()) // → false
 */

export const isPlainObj = (val: *): boolean => (
  Object.prototype.toString.call(val) === '[object Object]' &&
  Object.getPrototypeOf(val) === Object.prototype
)
