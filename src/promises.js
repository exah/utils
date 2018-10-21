// @flow
import { noop } from './fns'

export const wait = (duration: number, handler: Function = noop): Promise<*> =>
  new Promise((resolve) => handler(setTimeout(resolve, duration)))

export const alwaysResolve = (val: *) => () => Promise.resolve(val)

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

export const debouncePromise = (fn: Function, timeout: number = 0, isImmediate: boolean) => {
  let timerId = null
  let resolveList = []
  let result

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  return function debounced (...args: Array<*>): Promise<*> {
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
      }, timeout)
    })
  }
}
