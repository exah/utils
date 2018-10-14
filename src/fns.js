// @flow

const always = (val: *): Function => () => val

const T = always(true)

const F = always(false)

const noop = () => {}

const identity = (val: *): * => val

const composeTwoFns = (a, b) => (...args) => a(b(...args))

const compose = (...fns: Array<Function>): Function =>
  fns.reduce(composeTwoFns)

const pipe = (...fns: Array<Function>): Function =>
  fns.reduceRight(composeTwoFns)

const curry = (fn: Function, ...args: Array<*>): Function => (
  args.length === fn.length
    ? fn(...args)
    : curry.bind(null, fn, ...args)
)

const curryN = (numOfArgs: number, fn: Function, ...args: Array<*>): Function => (
  args.length >= numOfArgs
    ? fn(...args)
    : curryN.bind(null, numOfArgs, fn, ...args)
)

const once = (fn: Function): Function => {
  let isRunned = false
  let result = null

  return (...args) => {
    if (isRunned === false) {
      result = fn(...args)
      isRunned = true
    }

    return result
  }
}

const debounce = (fn, duration, isImmediate) => {
  let timerId = null

  const cancel = () => {
    clearTimeout(timerId)
    timerId = null
  }

  return function debounced (...args) {
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

const throttle = (fn, duration, isImmediate) => {
  let timerId = null

  const cancel = () => {
    clearTimeout(timerId)
    timerId = null
  }

  return function throttled (...args) {
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

export {
  always,
  T,
  F,
  noop,
  identity,
  compose,
  pipe,
  curry,
  curryN,
  once,
  debounce,
  throttle
}
