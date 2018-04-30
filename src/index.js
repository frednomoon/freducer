import typeToReducer from 'type-to-reducer'

const initialState = {
  success: false,
  pending: false,
  error: false
}

const asyncReducer = (customInitialState, customLocation) => {
  if (!customInitialState) {
    customInitialState = {}
  }
  if (!customLocation) {
    customLocation = (state, action, internal) => {
      return internal
    }
  }
  return {
    PENDING: (state, action) =>
      customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        pending: true
      }),
    REJECTED: (state, action) => {
      return customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        error: true,
        data: action.payload
      })
    },
    FULFILLED: (state, action) =>
      customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        success: true,
        data: action.payload
      })
  }
}

export const freducer = (type, customInitialState, customLocation) => {
  if (!customInitialState) {
    customInitialState = initialState
  }
  return typeToReducer(
    {
      [type]: asyncReducer(customInitialState, customLocation)
    },
    { data: {}, ...initialState, ...customInitialState }
  )
}

export default asyncReducer
