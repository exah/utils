import test from 'ava'

import {
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
} from '../src'

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

test('always', t => {
  t.is(always(1)(), 1)
})

test('T', t => {
  t.is(T(), true)
})

test('F', t => {
  t.is(F(), false)
})

test('noop', t => {
  t.is(noop(), void 0)
})

test('identity', t => {
  t.is(identity(100), 100)
})

test('compose', t => {
  t.is(compose((val) => val + '!', (val) => val + 1)(100), '101!')
})

test('pipe', t => {
  t.is(pipe((val) => val + 1, (val) => val + '!')(100), '101!')
})

test('curry', t => {
  const fn = curry((one, two, three) => one + two + three)
  t.is(typeof fn(1), 'function')
  t.is(typeof fn(1, 2), 'function')
  t.is(typeof fn(1, 2, 3), 'number')
  t.is(fn(1, 2, 3), 1 + 2 + 3)
  t.is(fn(1, 2)(3), 1 + 2 + 3)
  t.is(fn(1)(2)(3), 1 + 2 + 3)
})

test('curryN', t => {
  const fn = curryN(2, (one, two, three) => one + two + three)
  t.is(typeof fn(1), 'function')
  t.is(fn(1, 2), NaN)
  t.is(fn(1, 2, 3), 1 + 2 + 3)
  t.is(fn(1)(2, 3), 1 + 2 + 3)
})

test('once', t => {
  const fn = once((one, two, three) => one + two + three)
  t.is(fn(1, 2, 3), 1 + 2 + 3)
  t.is(fn(10, 20, 30), 1 + 2 + 3)
})

test('debounce', async t => {
  let count = 0
  const fn = debounce(() => count++, 20)

  fn()
  fn()
  fn()

  t.is(count, 0)

  await sleep(25)

  t.is(count, 1)

  fn()
  fn()
  fn()
  await sleep(30)

  fn()
  fn()
  fn()
  await sleep(30)

  t.is(count, 3)

  fn()
  await sleep(10)
  fn()
  await sleep(10)
  fn()
  await sleep(10)

  t.is(count, 3)

  await sleep(25)
  t.is(count, 4)
})

test('debounce immediate', async t => {
  let count = 0
  const fn = debounce(() => count++, 20, true)

  fn()
  fn()
  fn()
  t.is(count, 1)

  await sleep(30)
  fn()
  fn()
  fn()

  t.is(count, 2)

  await sleep(30)
  t.is(count, 2)
})

test('throttle', async t => {
  let count = 0
  const fn = throttle(() => count++, 20)

  fn()
  fn()
  fn()

  t.is(count, 0)

  await sleep(25)

  t.is(count, 1)

  fn()
  fn()
  fn()
  await sleep(30)

  fn()
  fn()
  fn()
  await sleep(30)

  t.is(count, 3)

  fn()
  await sleep(10)
  fn()
  await sleep(10)
  fn()
  await sleep(10)

  t.is(count, 4)

  await sleep(25)
  t.is(count, 5)
})

test('throttle immediate', async t => {
  let count = 0
  const fn = throttle(() => count++, 20, true)

  fn()
  fn()
  fn()
  t.is(count, 1)

  await sleep(30)
  fn()
  fn()
  fn()

  t.is(count, 2)

  await sleep(30)
  t.is(count, 2)
})
