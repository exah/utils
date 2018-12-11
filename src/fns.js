// @flow

/**
 * Return function that always returns provided value
 *
 * @return {function} `() => value`
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

export const always = (...args: *): Function => () => args[0]

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
 * @return {any} `value`
 *
 * @example
 * import { identity } from '@exah/utils'
 *
 * @example
 * identity(1) // → 1
 * identity(state) // → state
 */

export const identity = (...args: *): * => args[0]

/**
 * Reverse order of first two arguments
 *
 * @return {Function}
 *
 * @example
 * import { flip } from '@exah/utils'
 *
 * @example
 * const fn = (val) => val;
 *
 * [ 'foo', 'bar', 'baz' ].map(flip(fn)) // → [ 1, 2, 3 ]
 */

export const flip = (fn: Function) => (a: *, b: *, ...rest: *) => fn(b, a, ...rest)

/**
 * @private used for `compose` and `pipe`
 */

const composeTwoFns = (a: Function, b: Function) => (...args: *) => a(b(...args))

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

/**
 * Return curried function with specified number of arguments.
 *
 * @example
 * import { curryN } from '@exah/utils'
 *
 * @example
 * const fn = curryN(3, (one, two, three) => one + two + three)
 *
 * typeof fn(1) // → 'function'
 * typeof fn(1)(2) // → 'function'
 * typeof fn(1, 2) // → 'function'
 *
 * fn(1, 2, 3) // → 6
 * fn(1, 2)(3) // → 6
 * fn(1)(2, 3) // → 6
 * fn(1)(2)(3) // → 6
 */

export function curryN (numOfArgs: number, fn: Function, ...args: *): Function {
  return args.length >= numOfArgs
    ? fn(...args)
    : curryN.bind(null, numOfArgs, fn, ...args)
}

/**
 * Return curried equivalent of provided function.
 *
 * @example
 * import { curry } from '@exah/utils'
 *
 * @example
 * const fn = curry((one, two, three) => one + two + three)
 *
 * typeof fn(1) // → 'function'
 * typeof fn(1)(2) // → 'function'
 * typeof fn(1, 2) // → 'function'
 *
 * fn(1, 2, 3) // → 6
 * fn(1, 2)(3) // → 6
 * fn(1)(2, 3) // → 6
 * fn(1)(2)(3) // → 6
 */

export const curry = (fn: Function, ...args: *): Function =>
  curryN(fn.length, fn, ...args)

/**
 * Return function that always return result of first invocation, so function only called once.
 *
 *
 * @example
 * import { once } from '@exah/utils'
 *
 * @example
 * const fn = once((one, two, three) => one + two + three)
 *
 * fn(1, 2, 3) // → 1 + 2 + 3
 * fn(10, 20, 30) // → 1 + 2 + 3
 */

export const once = (fn: Function): Function => {
  let isRunned = false
  let result

  return function cached (...args) {
    if (isRunned === false) {
      isRunned = true
      result = fn.call(this, ...args)
    }

    return result
  }
}

/**
 * Return debounced function, that delays call until `timeout` is elapsed. <br />
 * If `isImmediate` is `true`, call function first, than delays next call. <br />
 * Useful for preventing "double clicks" or updating metrics after scroll / resize.
 *
 * - 🔗 [The Difference Between Throttling and Debouncing](https://css-tricks.com/the-difference-between-throttling-and-debouncing).
 * - 🔗 [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples).
 *
 * See {@link throttle}, {@link debouncePromise}.
 *
 * @example
 * import { debounce } from '@exah/utils'
 *
 * @example
 * const fn = debounce(() => console.log(window.innerWidth), 100)
 *
 * window.addEventListener('resize', fn)
 */

export const debounce = (fn: Function, time: number = 0, isImmediate: boolean) => {
  let timerId = null

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  function debounced (...args: *) {
    let result
    const run = fn.bind(this, ...args)

    if (isImmediate && timerId === null) {
      result = run()
    }

    cancel()
    timerId = setTimeout(() => {
      if (!isImmediate) run()
      timerId = null
    }, time)

    return result
  }

  return Object.assign(debounced, { cancel })
}

/**
 * Return throttled function, that ensures that function runs once in specific time. <br />
 * If `isImmediate` is `true`, call function first, than wait next call. <br />
 * Useful for optimizing for constant event watching (like `change`, `scroll`, etc.).
 *
 * - 🔗 [The Difference Between Throttling and Debouncing](https://css-tricks.com/the-difference-between-throttling-and-debouncing).
 * - 🔗 [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples).
 *
 * See {@link debounce}, {@link debouncePromise}.
 *
 * @example
 * import { throttle } from '@exah/utils'
 *
 * @example
 * const fn = throttle(() => console.log(window.scrollY), 100)
 *
 * window.addEventListener('scroll', fn)
 */

export const throttle = (fn: Function, time: number = 0, isImmediate: boolean) => {
  let timerId = null

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  function throttled (...args: *) {
    if (timerId !== null) return
    const run = fn.bind(this, ...args)

    if (isImmediate) {
      run()
    }

    timerId = setTimeout(() => {
      if (!isImmediate) run()
      timerId = null
    }, time)
  }

  return Object.assign(throttled, { cancel })
}

/**
 * Simple memoize function
 *
 * @example
 * import { memoize } from '@exah/utils'
 *
 * const expensiveFn = (a, b) => ({ val: a + b })
 * const memoized = memoize(expensiveFn)
 *
 * const result = memoized(1, 2) // → { val: 3 }
 * result === memoized(1, 2) // → true
 */

export function memoize (fn: Function, toString: (*) => string = String, keyJoiner: string = '-') {
  const cache = {}

  return function memoized (...args: *) {
    const key = args.map(toString).join(keyJoiner)

    if (cache.hasOwnProperty(key) === false) {
      cache[key] = fn.call(this, ...args)
    }

    return cache[key]
  }
}
