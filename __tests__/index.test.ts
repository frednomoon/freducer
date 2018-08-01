import freducer, { asyncReducer, asyncMethod } from '../src'

const GET_RESOURCE = 'GET_RESOURCE'

const store = {
  pending: false,
  error: null,
  success: false,
  data: null
}

const payload = {
  data: 'yolovibey'
}

// Run indentical tests on the following 2 reducers
basicImplementation(freducer(GET_RESOURCE), 'freducer')
basicImplementation(asyncReducer({
  GET_RESOURCE: asyncMethod()
}, undefined), 'asyncReducer/asyncMethod')

function basicImplementation(reducer, title) {
  describe(`basic implementation for ${title}`, () => {
    it('_PENDING should set pending state', () => {
      const action = {
        type: `${GET_RESOURCE}_PENDING`,
        payload
      }

      const state = reducer(store, action)

      // pending should be set to true
      expect(state.pending).toBe(true)
      // data should remain unchanged
      expect(state.data).toBe(store.data)

      // trivial
      expect(state.error).toBe(store.error)
      expect(state.success).toBe(store.success)
    })
    it('_REJECTED should set error state', () => {
      const action = {
        type: `${GET_RESOURCE}_REJECTED`,
        payload
      }

      const state = reducer(store, action)

      // error should be set to true
      expect(state.error).toBe(payload)

      // trivial
      expect(state.data).toEqual(store.data)
      expect(state.pending).toBe(store.pending)
      expect(state.success).toBe(store.success)
    })
    it('_FULFILLED should set success state', () => {
      const action = {
        type: `${GET_RESOURCE}_FULFILLED`,
        payload
      }

      const state = reducer(store, action)

      // error should be set to true
      expect(state.success).toBe(true)
      // data should equal payload
      expect(state.data).toEqual(payload)

      // trivial
      expect(state.pending).toBe(store.pending)
      expect(state.error).toBe(store.error)
    })
  })
}

