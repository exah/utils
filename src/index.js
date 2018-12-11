// @flow

export {
  toArr,
  flattenArr as flatten,
  flattenArr,
  initArr
} from './arr'

export {
  reduceObj,
  mapObj,
  flattenObj,
  filterObj,
  path,
  fallbackTo,
  queryObj,
  queryObj as query,
  deepMerge
} from './obj'

export {
  always,
  noop,
  identity,
  compose,
  pipe,
  curry,
  curryN,
  once,
  memoize,
  debounce,
  throttle
} from './fns'

export {
  is,
  isFn,
  isBool,
  isNum,
  isStr,
  isObj,
  isArr,
  isNil,
  isThenable,
  isEmpty,
  isEmptyObj,
  isPlainObj
} from './checks'

export {
  wait,
  queue,
  reflect,
  timeout,
  promisify,
  toPromise,
  concurrentN,
  alwaysResolve,
  deferredPromise,
  debouncePromise
} from './promises'
