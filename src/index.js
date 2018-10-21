export {
  toArr,
  flattenArr as flatten,
  flattenArr
} from './arr'

export {
  toObj,
  reduceObj,
  mapObj,
  flattenObj,
  filterObj,
  path,
  fallbackTo
} from './obj'

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
} from './fns'

export {
  is,
  isFn,
  isBool,
  isNum,
  isStr,
  isArr,
  isNil,
  isEmpty,
  isEmptyObj,
  isPlainObj
} from './checks'

export {
  alwaysResolve,
  deferredPromise,
  debouncePromise,
  wait
} from './promises'
