import test from 'ava'

import {
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
} from '../src'

function Fn () {}
const Obj = {}

test('is', t => {
  t.true(is(Fn, new Fn()))
  t.true(is(Obj, Object.create(Obj)))
  t.true(is(Number, 1))
  t.true(is(Number, NaN))
  t.true(is(String, ''))
  t.true(is(Array, []))
  t.true(is(Function, Fn))
  t.true(is(Set, new Set()))
  t.true(is(Map, new Map()))
  t.true(is(Promise, Promise.resolve()))
  t.true(is(Object, []))
  t.true(is(Object, {}))
  t.true(is(Object, new Fn()))
  t.false(is(Array, {}))
  t.false(is(Object, null))
})

test('isFn', t => {
  t.true(isFn(() => null))
  t.false(isFn(null))
})

test('isBool', t => {
  t.true(isBool(true))
  t.true(isBool(false))
  t.false(isBool(1))
  t.false(isBool('true'))
  t.false(isBool([]))
  t.false(isBool({}))
})

test('isNum', t => {
  t.true(isNum(10))
  t.false(isNum(NaN))
  t.false(isNum('1'))
  t.false(isNum('100'))
})

test('isStr', t => {
  t.true(isStr(''))
  t.true(isStr('1'))
  t.false(isStr(1))
})

test('isArr', t => {
  t.true(isArr([]))
  t.true(isArr([ 1, 2, 3 ]))
  t.false(isArr({ length: 3 }))
  t.false(isArr(arguments)) // eslint-disable-line
})

test('isNil', t => {
  t.true(isNil())
  t.true(isNil(undefined))
  t.true(isNil(null))
  t.false(isNil(0))
})

test('isEmpty', t => {
  t.true(isEmpty(null))
  t.true(isEmpty(''))
  t.true(isEmpty([]))
  t.true(isEmpty({}))
  t.true(isEmpty(new Map()))
  t.true(isEmpty(new Set()))
  t.false(isEmpty([ 1, 2, 3 ]))
  t.false(isEmpty({ foo: 'bar' }))
  t.false(isEmpty(new Set([ 1, 2, 3 ])))
})

test('isEmptyObj', t => {
  t.true(isEmptyObj([]))
  t.true(isEmptyObj({}))
  t.true(isEmptyObj(new Map()))
  t.true(isEmptyObj(new Set()))
  t.false(isEmptyObj(''))
  t.false(isEmptyObj(null))
  t.false(isEmptyObj([ 1, 2, 3 ]))
  t.false(isEmptyObj({ foo: 'bar' }))
  t.false(isEmptyObj(new Set([ 1, 2, 3 ])))
})

test('isPlainObj', t => {
  t.true(isPlainObj({}))
  t.false(isPlainObj([]))
  t.false(isPlainObj(null))
  t.false(isPlainObj(undefined))
  t.false(isPlainObj(1))
  t.false(isPlainObj(new Fn()))
  t.false(isPlainObj(new Map()))
  t.false(isPlainObj(Object.create(null)))
  t.false(isPlainObj(() => null))
})
