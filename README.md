# evx

## Install 
```bash
npm i evx --save
```

# Usage
```javascript
import { on, emit } from 'evx'

const foo = on(
  'foo',
  state => console.log('\n  a', JSON.stringify(state))
)

const fooAndBar = on(
  ['foo', 'bar'],
  state => console.log('\n  b', JSON.stringify(state))
)

const wildcard = on(
  '*',
  state => console.log('\n  c', JSON.stringify(state))
)
```

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
