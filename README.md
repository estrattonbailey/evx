# evx
Handy dandy persistent-state pub/sub with multi, wildcard, and single-property subscriptions. **400
bytes gzipped.**

## Install
```bash
npm i evx --save
```

# Usage
`evx` is just a simple pub/sub bus:
```javascript
import { on, emit } from 'evx'

on('foo', () => console.log('foo was emitted!'))

emit('foo')
```

But it also allows you to subscribe to multiple events at once:
```javascript
// fires once
on(['foo', 'bar'], () => console.log('foo or bar was emitted!'))

emit('bar')
```

And emit multiple events at once:
```javascript
// fires twice
on(['foo', 'bar'], () => console.log('foo or bar was emitted!'))

emit([ 'bar', 'foo' ])
```

It has wildcard support:
```javascript
on('*', () => console.log('an event was emitted!'))

emit('baz')
```

Additionally, you can subscribe to specific property values by passing the
property *key* as the event name:
```javascript
on('someProperty', state => {}) // someProperty updated

emit('foo', { someProperty: true }) // will fire
hydrate({ someProperty: true })() // will also fire
```

### State

Additionally, it has a concept of state. In `evx` state *is always an object*.
Any object passed to `emit` will be *shallowly* merged with global state:
```javascript
emit('foo', { value: true })
```

And all subscribers are passed the full state object:
```javascript
on('foo', state => console.log(state.value)) // true
```

To emit transient data that does not get merged into the global state, pass an object as the third argument to `emit`:
```javascript
emit('event', null, { message: 'Hello' })
```

And access via the second argument subscribers:
```javascript
on('event', (state, data) => console.log(data.message)) // Hello
```

If you need to add some state but don't want to emit any events, use `hydrate`:
```javascript
import { hydrate } from 'evx'

hydrate({ baz: true })
```

But for convenience, `hydrate` also returns a function that, when called, will
emit a '*' event:
```javascript
hydrate({ baz: true })()
```

The current read-only state is accessible as well:
```javascript
import { hydrate, getState } from 'evx'

hydrate({ baz: true })

getState() // { baz: true }
```

### Cleanup

Subscribers return a function that will *unsubscribe* from that event:
```javascript
const unsubscribe = on('foo', () => {})

emit('foo') // will fire

unsubscribe()

emit('foo') // will not fire
```

### Multiple instances

If you need to create a discrete instance of `evx`, use `create`:
```javascript
import { create } from 'evx'

const bus = create()
```

All methods above are now accessible on `bus`.

You can also pass an optional initial state object to `create`:
```javascript
const bus = create({ foo: 'hello' })
```

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
