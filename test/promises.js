import test from 'ava'

import {
  wait,
  alwaysResolve,
  deferredPromise,
  debouncePromise
} from '../src'

test('wait', async t => {
  const duration = 20

  const start = Date.now()
  await wait(duration)
  const end = Date.now()

  t.true((end - start) >= duration)
})

test('alwaysResolve', async t => {
  const T = alwaysResolve(true)
  t.is(await T(), true)
})

test('deferredPromise', async t => {
  const promise1 = deferredPromise()
  const promise2 = deferredPromise()

  promise1.resolve('ok')
  t.is(await promise1, 'ok')

  promise2.reject(new Error('error'))
  t.is((await t.throwsAsync(promise2)).message, 'error')
})

test('debouncePromise', async t => {
  let count = 0
  const fn = debouncePromise((val) => {
    count++
    return Promise.resolve(val)
  }, 100)

  let promises = []

  for (let i = 0; i < 10; i++) {
    promises.push(fn(i))
    await wait(50)
  }

  t.is(await fn(10), 10)
  t.is(count, 1)
})

test('debouncePromise immediate', async t => {
  let count = 0
  const fn = debouncePromise((val) => {
    count++
    return Promise.resolve(val)
  }, 100, true)

  let promises = []

  for (let i = 0; i < 10; i++) {
    await wait(50) // too often
    promises.push(fn(i))
  }

  t.is(await fn(10), 0) // first value
  t.is(count, 1)

  await wait(150)
  t.is(await fn(11), 11) // after proper timeout
  t.is(count, 2)
})
