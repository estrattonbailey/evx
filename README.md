# evx
Handy dandy persistent-state pub/sub with multi & wildcard subscriptions. **400
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
on(['foo', 'bar'], () => console.log('foo or bar was emitted!'))

emit('bar')
```

And has wildcard support:
```javascript
on('*', () => console.log('an event was emitted!'))

emit('baz')
```

### State

Additionally, it has a concept of state. Any object passed to `emit` will be
merged with global state:
```javascript
emit('foo', { value: true })
```

And all subscribers are passed the full state object:
```javascript
on('foo', state => console.log(state.value)) // true
```

If you don't pass an object, `evx` will assign the value to the event name:
```javascript
on('foo', state => console.log(state.foo)) // hello

emit('foo', 'hello')
```

If you need to add some state but don't want to emit any events, use `hydrate`:
```javascript
import { hydrate } from 'evx'

hydrate({ baz: true })
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
