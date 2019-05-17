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
test('destroy', t => {
  let foo = false
  const d = on('*', () => foo = !foo)
  emit('b')
  d()
  emit('b')
  if (foo) t.pass()
})
