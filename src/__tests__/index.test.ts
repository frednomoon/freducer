import freducer, { asyncReducer, asyncMethod } from ".."

const GET_RESOURCE = "GET_RESOURCE"

const testStores = {
  initialStore: {
    success: false,
    pending: false,
    error: null,
    data: null,
  },
  store: {
    success: true,
    pending: false,
    error: null,
    data: "some data",
  },
  errorStore: {
    success: true,
    pending: false,
    error: "you got an error boiii",
    data: "previous data",
  },
  pendingAfterErrorStore: {
    success: false,
    pending: true,
    error: "its an error pal",
    data: "still got data tho",
  },
  pendingAfterSuccessStore: {
    success: true,
    pending: true,
    error: null,
    data: "still got data tho",
  },
}

const payload = {
  data: "yolovibey",
}

// Run indentical tests on the following 2 reducers
basicImplementation(freducer(GET_RESOURCE), "freducer")
basicImplementation(
  asyncReducer(
    {
      GET_RESOURCE: asyncMethod(),
    },
    undefined
  ),
  "asyncReducer/asyncMethod"
)

function basicImplementation(reducer, title) {
  describe(`basic implementation for ${title}`, () => {
    Object.keys(testStores).forEach((key) => {
      it(`_PENDING should set pending state - ${key}`, () => {
        const action = {
          type: `${GET_RESOURCE}_PENDING`,
          payload,
        }

        const state = reducer(testStores[key], action)

        // pending should be set to true
        expect(state.pending).toBe(true)
        // all other parts should persist from previous state
        expect(state.data).toBe(testStores[key].data)
        expect(state.error).toBe(testStores[key].error)
        expect(state.success).toBe(testStores[key].success)
      })
      it(`_REJECTED should set error state - ${key}`, () => {
        const action = {
          type: `${GET_RESOURCE}_REJECTED`,
          payload,
        }

        const state = reducer(testStores[key], action)

        // error should be set to true
        expect(state.error).toBe(payload)
        // should set success to false
        expect(state.success).toBe(false)
        // pending should be false
        expect(state.pending).toBe(false)
        // data should persist from the the previous state
        expect(state.data).toEqual(testStores[key].data)
      })
      it(`_FULFILLED should set success state - ${key}`, () => {
        const action = {
          type: `${GET_RESOURCE}_FULFILLED`,
          payload,
        }

        const state = reducer(testStores[key], action)

        // error should be set to true
        expect(state.success).toBe(true)
        // data should equal payload
        expect(state.data).toEqual(payload)
        // should set error to null
        expect(state.error).toBe(null)
        // pending should be false
        expect(state.pending).toBe(false)
      })
    })
  })
}
