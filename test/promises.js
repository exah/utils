import test from 'ava'

import {
  wait,
  queue,
  reflect,
  timeout,
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

test('reflect', async t => {
  const error = new Error('error')
  t.deepEqual(await reflect(Promise.reject(error)), {
    success: false,
    error
  })

  const result = 'ok'
  t.deepEqual(await reflect(Promise.resolve(result)), {
    success: true,
    result
  })
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

  for (let i = 0; i < 10; i++) {
    fn(i)
    await wait(50) // too often
  }

  t.is(await fn(10), 0) // first value
  t.is(count, 1)

  await wait(150)
  t.is(await fn(11), 11) // after proper timeout
  t.is(count, 2)
})

test('queue', async t => {
  const result = await queue(
    (a, b) => a + b,
    (c) => wait(20).then(() => c * c),
    queue((d) => wait(20).then(() => d * d), Math.sqrt, Math.sqrt)
  )(1, 2)

  t.is(result, 3)
})

test('timeout', async t => {
  t.is((await t.throwsAsync(timeout(wait(50), 10))).message, 'Timeout error')
  t.true(await timeout(wait(50).then(() => true), 100))
})
