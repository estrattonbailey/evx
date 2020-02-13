const isObj = v => typeof v === 'object' && !Array.isArray(v)

const validate = o => {
  if (!isObj(o)) throw 'state should be an object'
}

const uniq = arr => arr.reduce((a, b, i) => {
  if (a.indexOf(b) > -1) return a
  return a.concat(b)
}, [])

const fire = (evs, events, state) => uniq(evs)
  .reduce((fns, ev) => fns.concat(events[ev] || []), [])
  .map(fn => fn(state))

const evx = create()

export const on = evx.on
export const emit = evx.emit
export const hydrate = evx.hydrate
export const getState = evx.getState

export function create (state = {}) {
  const events = {}

  return {
    getState () {
      return Object.assign({}, state)
    },
    hydrate (s) {
      validate(s)

      Object.assign(state, s)

      return () => {
        const evs = ['*'].concat(Object.keys(s))
        fire(evs, events, state)
      }
    },
    on (evs, fn) {
      evs = [].concat(evs)
      evs.map(ev => events[ev] = (events[ev] || []).concat(fn))
      return () => evs.map(
        ev => events[ev].splice(events[ev].indexOf(fn), 1)
      )
    },
    emit (ev, data, merge = true) {
      let evs = (ev === '*' ? [] : ['*']).concat(ev)

      data = typeof data === 'function' ? data(state) : data

      if (data) {
        validate(data)
        merge && Object.assign(state, data)
        evs = evs.concat(Object.keys(data))
      }

      fire(evs, events, merge ? state : data)
    }
  }
}
