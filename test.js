import test from 'ava'
import { on, emit, hydrate, getState, create } from './dist/evx.js'

test('single listener', t => {
  on('a', () => t.pass())
  emit('a')
})
test('multi listener', t => {
  on(['a', 'b'], () => t.pass())
  emit('b')
})
test('wildcard', t => {
  on('*', () => t.pass())
  emit('b')
})
test('state', t => {
  on('*', state => {
    if (state.foo) t.pass()
  })
  emit('b', { foo: true })
})
test('hydrate', t => {
  hydrate({ bar: 'hello' })
  t.is(getState().bar, 'hello')
})
test('create hydrate', t => {
  const s = { bar: null }
  const evx = create(s)
  evx.hydrate({ bar: 'hello' })
  t.is(evx.getState().bar, 'hello')
})
test('multiple instances', t => {
  const a = create()
  const b = create()

  a.hydrate({ foo: true })
  b.hydrate({ foo: false })

  t.is(a.getState().foo, true)
  t.is(b.getState().foo, false)
})
test('immutable state', t => {
  const s = { bar: null }
  const evx = create(s)
  const _s = evx.getState()
  _s.bar = 'hello' // won't mutate
  t.is(evx.getState().bar, null)
})
test('emit non-object', t => {
  on('primitive', state => t.is(state.primitive, 'hello'))
  emit('primitive', 'hello')
})
test('destroy', t => {
  let foo = false
  const d = on('*', () => foo = !foo)
  emit('b')
  d()
  emit('b')
  if (foo) t.pass()
})
test('hydrate emit wildcard', t => {
  on('*', state => t.pass())
  const fire = hydrate({ hydrate: true })
  t.is(getState().hydrate, true)
  fire()
})
