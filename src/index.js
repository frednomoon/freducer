import typeToReducer from 'type-to-reducer'

const initialState = {
  success: false,
  pending: false,
  error: false,
  data: {}
}

export const asyncMethod = (customInitialState, customLocation) => {
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

export const reducer = typeToReducer

export default (type, customInitialState, customLocation) => {
  if (!customInitialState) {
    customInitialState = {}
  }
  return reducer(
    {
      [type]: asyncMethod(customInitialState, customLocation)
    },
    { data: {}, ...initialState, ...customInitialState }
  )
}
