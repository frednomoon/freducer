import freducer, { asyncReducer, asyncMethod } from ".."

const GET_RESOURCE = "GET_RESOURCE"
const RESET_RESOURCE = "RESET_RESOURCE"

const testStores = {
  defaultInitialStore: {
    success: false,
    pending: false,
    error: null,
  },
  initialStoreWithArray: {
    success: false,
    pending: false,
    error: null,
    data: [],
  },
  initialStoreWithCrazy: {
    success: false,
    pending: false,
    error: null,
    data: { clients: [], message: "yolo shitsdfjkxgn" },
  },
}
const store = {
  success: true,
  pending: false,
  error: null,
  data: "some data",
}

describe("reset function", () => {
  Object.keys(testStores).forEach((key) => {
    it("should restore intitial state", () => {
      const r = freducer(GET_RESOURCE, {
        reset: RESET_RESOURCE,
        initialState: testStores[key],
      })

      const action = { type: RESET_RESOURCE }
      const state = r(store, action)

      expect(state).toEqual(testStores[key])
    })
  })
})
