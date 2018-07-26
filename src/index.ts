import * as typeToReducer from 'type-to-reducer'

interface IState {
  success: boolean
  pending: boolean
  error: boolean
  data: object
}

type LocationFunction = (state: IState, action: object, internal: IState) => any

const defaultLocationFunction: LocationFunction = (state, action, internal) => {
  return internal
}

const initialState: IState = {
  success: false,
  pending: false,
  error: false,
  data: {}
}


export const asyncMethod = (customInitialState: object | undefined, customLocation: LocationFunction | undefined) => {
  if (!customInitialState) {
    customInitialState = {}
  }
  return {
    PENDING: (state, action) => {
      if (!customLocation) {
        customLocation = defaultLocationFunction
      }
      return customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        pending: true
      })
    },
    REJECTED: (state, action) => {
      if (!customLocation) {
        customLocation = defaultLocationFunction
      }
      return customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        error: true,
        data: action.payload
      })
    },
    FULFILLED: (state, action) => {
      if (!customLocation) {
        customLocation = defaultLocationFunction
      }
      return customLocation(state, action, {
        ...initialState,
        ...customInitialState,
        success: true,
        data: action.payload
      })
    }
  }
}

export const reducer = typeToReducer.default

export default (type: string, customInitialState: object | undefined, customLocation: LocationFunction | undefined) => {
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
