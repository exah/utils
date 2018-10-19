// @flow

/**
 * Return function that always returns value
 *
 * @example
 * import { always } from '@exah/utils'
 *
 * @example
 * always(1)() // → 1
 * always({})() // → {}
 *
 * const noop = always()
 * noop() // → undefined
 */

export const always = (val: *): Function => () => val

/**
 * Function that always returns `true`
 *
 * @return {true}
 *
 * @example
 * import { T } from '@exah/utils'
 *
 * @example
 * T() // → true
 */

export const T = always(true)

/**
 * Function that always returns `false`
 *
 * @return {false}
 *
 * @example
 * import { F } from '@exah/utils'
 *
 * @example
 * F() // → false
 */

export const F = always(false)

/**
 * Function that do nothing
 *
 * @return {undefined}
 *
 * @example
 * import { noop } from '@exah/utils'
 *
 * @example
 * noop() // → undefined
 */

export const noop = always()

/**
 * Function that returns its value
 *
 * @example
 * import { identity } from '@exah/utils'
 *
 * @example
 * identity(1) // → 1
 * identity(state) // → state
 */

export const identity = (val: *): * => val

/**
 * @private used for `compose` and `pipe`
 */

const composeTwoFns = (a: Function, b: Function) => (...args: Array<*>) => a(b(...args))

/**
 * Right-to-left function composition
 *
 * @example
 * import { compose } from '@exah/utils'
 *
 * @example
 * const a = (val) => val + 1
 * const b = (val) => val / 2
 * const c = (val) => val * 10
 *
 * compose(a, b, c)(1) // → a(b(c(1))) → (((1 * 10) / 2) + 1) → 6
 */

export const compose = (...fns: Array<Function>): Function =>
  fns.reduce(composeTwoFns)

/**
 * Left-to-right function composition
 *
 * @example
 * import { pipe } from '@exah/utils'
 *
 * @example
 * const a = (val) => val + 1
 * const b = () => val / 2
 * const c = (val) => val * 10
 *
 * pipe(a, b, c)(1) // → c(b(a(1))) → (((1 + 1) / 2) * 10) → 10
 */

export const pipe = (...fns: Array<Function>): Function =>
  fns.reduceRight(composeTwoFns)

export const curry = (fn: Function, ...args: Array<*>): Function => (
  args.length === fn.length
    ? fn(...args)
    : curry.bind(null, fn, ...args)
)

export const curryN = (numOfArgs: number, fn: Function, ...args: Array<*>): Function => (
  args.length >= numOfArgs
    ? fn(...args)
    : curryN.bind(null, numOfArgs, fn, ...args)
)

export const once = (fn: Function): Function => {
  let isRunned = false
  let result = null

  return (...args) => {
    if (isRunned === false) {
      isRunned = true
      result = fn(...args)
    }

    return result
  }
}

export const debounce = (fn: Function, duration: number = 0, isImmediate: boolean) => {
  let timerId = null

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  return function debounced (...args: Array<*>) {
    const run = fn.bind(this, ...args)

    if (isImmediate && timerId === null) {
      run()
    }

    cancel()
    timerId = setTimeout(() => {
      if (!isImmediate) run()
      timerId = null
    }, duration)

    return cancel
  }
}

export const throttle = (fn: Function, duration: number = 0, isImmediate: boolean) => {
  let timerId = null

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  return function throttled (...args: Array<*>) {
    if (timerId !== null) return

    const run = fn.bind(this, ...args)

    if (isImmediate) {
      run()
    }

    timerId = setTimeout(() => {
      if (!isImmediate) run()
      timerId = null
    }, duration)

    return cancel
  }
}
