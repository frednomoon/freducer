import freducer from '../src'
import { nestWithMetaId } from '../src/locationFunctions'

const GET_RESOURCE = 'GET_RESOURCE'

const payload = {
  data: 'yolovibey'
}

const testStores = {
  populatedStore: {
    1: {
      success: true,
      pending: false,
      error: null,
      data: 'some data'
    },
    2: {
      success: true,
      pending: false,
      error: null,
      data: 'some data'
    },
    3: {
      success: true,
      pending: false,
      error: null,
      data: 'some data'
    }
  }
}

const reducer = freducer(GET_RESOURCE, { locationFunction: nestWithMetaId })

describe('location function reducer', () => {
  let state = {}
  it('should set separate pending states for different meta ids', () => {
    const action = id => ({
      type: `${GET_RESOURCE}_PENDING`,
      meta: { id },
      payload
    })

    const ids = [1, 2, 3, 4, 5]
    ids.forEach(id => {
      state = reducer(state, action(id))
    })

    ids.forEach(id => {
      expect(state[id]).toEqual({
        pending: true
      })
    })
  })
  it('should then set full success state', () => {
    const action = id => ({
      type: `${GET_RESOURCE}_FULFILLED`,
      meta: { id },
      payload
    })

    const ids = [1, 2, 3, 4, 5]
    ids.forEach(id => {
      state = reducer(state, action(id))
    })

    ids.forEach(id => {
      expect(state[id]).toEqual({
        pending: false,
        success: true,
        error: null,
        data: payload
      })
    })
  })
})

describe('location function against an already populated store', () => {
  it('should not alter previous state on apart from pending', () => {
    const action = id => ({
      type: `${GET_RESOURCE}_PENDING`,
      meta: { id },
      payload
    })

    const ids = [1, 2, 3]
    let state = { ...testStores.populatedStore }

    ids.forEach(id => {
      state = reducer(state, action(id))
    })

    ids.forEach(id => {
      expect(state[id]).toEqual({
        ...testStores.populatedStore[id],
        pending: true
      })
    })
  })
})