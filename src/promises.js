// @flow
import { noop } from './fns'

/**
 * Waites for `duration` than resolves promise.
 *
 * @example
 * import { wait } from '@exah/utils'
 *
 * @example
 * wait(2000).then(() => console.log('After 2s'))
 */

export const wait = (duration: number, handler: Function = noop): Promise<void> =>
  new Promise((resolve) => handler(setTimeout(resolve, duration)))

/**
 * Return function that always return promise that resolve provided `val`.
 *
 * @example
 * import { alwaysResolve } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   const F = alwaysResolve(false);
 *   await F() // → false
 * })()
 */

export const alwaysResolve = (val: *): () => Promise<*> => () => Promise.resolve(val)

/**
 * Return promise that never fulfilled. Probably no one should use this.
 *
 * @example
 * import { neverResolve } from '@exah/utils'
 *
 * @example
 * wait(2000)
 *  .then(() => neverResolve())
 *  .then(() => console.log('never happens'))
 */

export const neverResolve = (): Promise<void> => new Promise(() => null)

/**
 * Compose multiple promises together.
 *
 * @example
 * import { queue } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   await queue(
 *     (a, b, c, d) => a + b + c + d,
 *     (val) => wait(200).then(() => val),
 *     (val) => val * val
 *   )(1, 2, 3, 4) // → 100
 * })()
 */

export const queue = (
  first: Function = noop,
  ...rest: Array<Function>
): (...args: *) => Promise<*> => (...args) =>
  rest.reduce((a, b) => a.then(b), Promise.resolve(first(...args)))

/**
 * Resolves every promise by returing `{ success: true, result }` in `then`
 * and `{ success: false, error }` in `catch`.
 * Useful when waiting multiple promises in `Promise.all`
 * and need to get results even if some promises are rejected.
 *
 * @example
 * import { reflect } from '@exah/utils'
 *
 * @example
 * Promise.all(preloadImages().map(reflect)).then((result) => {
 *   console.log('called, even if some promises are rejected')
 *
 *   const correct = result.filter((val) => val.success === true)
 *   const invalid = result.filter((val) => val.success === false)
 * })
 */

export const reflect = (promise: Promise<*>) =>
  promise
    .then((result) => ({ success: true, result }))
    .catch((error) => ({ success: false, error }))

/**
 * Rejects promise if timeout is elapsed before it fulfilled.
 *
 * @example
 * import { timeout } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   await timeout(wait(100), 50).catch((error) => error.message) // → 'Timeout error'
 *   await timeout(wait(50).then(() => true), 100) // → true
 * })()
 */

export const timeout = (
  promise: Promise<*>,
  time: number = 0,
  errorMessage: string = 'Timeout error'
) => Promise.race([
  promise,
  wait(time).then(() => Promise.reject(new Error(errorMessage)))
])

/**
 * Promisify callback-style async function
 *
 * @example
 * import { promisify } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   const fs = require('fs')
 *   const { promisify } = require('@exah/utils')
 *
 *   await promisify(fs.readFile)(__dirname + '/sample.txt', 'utf8')
 *   // → 'Hello World\n'
 * })()
 */

export const promisify = (fn: Function): Function => (input, ...options) =>
  new Promise((resolve, reject) =>
    fn(input, ...options, (error, res) => (error && reject(error)) || resolve(res))
  )

/**
 * Create "deferred" promise.
 * It like regular {@link Promise}, but with exposed `resolve`, `reject` methods.
 *
 * @example
 * import { deferredPromise } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   const deferred = deferredPromise()
 *   deferred.resolve(100)
 *   await deffered // → 100
 * })()
 */

export const deferredPromise = (fn: Function = noop): Promise<*> => {
  const methods = {}

  const promise = new Promise((resolve, reject) => {
    methods.resolve = resolve
    methods.reject = reject

    fn(resolve, reject)
  })

  // $FlowFixMe
  return Object.assign(promise, methods)
}

/**
 * Return debounced function, that delays call until `timeout` is elapsed. <br />
 * Function returns promise that fulfils after `fn` promise is complete.
 *
 * See {@link debounce}.
 *
 * @example
 * import { debouncePromise } from '@exah/utils'
 *
 * @example
 * (async () => {
 *   const fn = (i) => Promise.resolve(i)
 *   const optimizedFn = debouncePromise(fn, 100)
 *
 *   for (let i = 0; i < 10; i++) {
 *     optimizedFn(i).then((val) => console.log(val))
 *   }
 *
 *   // → 0
 *   // → 0
 *   // → 0
 * })()
 */

export const debouncePromise = (
  fn: () => Promise<*>,
  time: number = 0,
  isImmediate: boolean
) => {
  let timerId = null
  let resolveList = []
  let result

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  return function debounced (...args: *): Promise<*> {
    const run = fn.bind(this, ...args)

    return new Promise((resolve) => {
      if (isImmediate === true && timerId === null) {
        result = run()
        resolve(result)
      } else {
        resolveList.push(resolve)
      }

      cancel()
      timerId = setTimeout(() => {
        if (!isImmediate) {
          result = run()
        }

        resolveList.forEach((subResolve) => subResolve(result))
        resolveList = []
        timerId = null
      }, time)
    })
  }
}
