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
      let data = action.payload
      if (typeof action.payload === 'object') {
        data = action.payload.message
      }
      return customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        error: true,
        data
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

export const fullReducer = (type, customInitialState, customLocation) => {
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
