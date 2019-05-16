const isObj = v => typeof v === 'object' && !Array.isArray(v)

const evx = create()

export const on = evx.on
export const emit = evx.emit

export function create (state = {}) {
  const events = {}

  return {
    on (evs, fn) {
      evs = [].concat(evs)
      evs.map(ev => events[ev] = (events[ev] || []).concat(fn))
      return () => evs.map(
        ev => events[ev].splice(events[ev].indexOf(fn), 1)
      )
    },
    emit (ev, data) {
      data = typeof data === 'function' ? data(state) : data

      if (data) {
        state = Object.assign(
          {},
          state,
          isObj(data) ? data : { [ev]: data }
        )
      }

      ;(events[ev] || []).concat(ev !== '*' ? events['*'] || [] : []).map(fn => fn(state))
    }
  }
}
