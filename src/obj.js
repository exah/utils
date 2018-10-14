// @flow
import { curryN, identity } from './fns'
import { toArr } from './arr'

const toObj = (arr: Array<*>, fn: Function = identity): {} =>
  toArr(arr)
    .reduce((acc, value) => ({ ...acc, ...fn(value) }), {})

const mapObj = curryN(2, (fn, obj) =>
  Object
    .keys(obj)
    .reduce((acc, key, index) => {
      const [ nextKey, nextVal ] = fn([ key, obj[key] ], index, obj)
      return {
        ...acc,
        [nextKey]: nextVal
      }
    }, {}))

const filterObj = curryN(2, (fn, obj) => {
  const target = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (fn(key, value)) {
        target[key] = value
      }
    }
  }

  return target
})

const fallbackTo = (...args: Array<*>) =>
  args.reduce((prev, val) => prev == null ? val : prev, null)

const path = (str: string = '', ...paths: Array<string>) => (obj: Object) =>
  str.split('.')
    .concat(paths)
    .reduce((a, c) => Object(a)[c], obj)

const pathOr = (fallback: *) => (...paths: Array<string>) => (obj: Object) =>
  fallbackTo(path(...paths)(obj), fallback)

export {
  toObj,
  mapObj,
  filterObj,
  fallbackTo,
  path,
  pathOr
}
