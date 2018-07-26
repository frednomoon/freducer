import * as typeToReducer from 'type-to-reducer'

interface IState {
  success: boolean
  pending: boolean
  error: boolean
  data?: object
}

type LocationFunction = (state: IState, action: object, internal: IState) => any

const defaultLocationFunction: LocationFunction = (state, action, internal) => {
  return internal
}

interface MethodOptions {
  /**
   * Would you like to pass a different initial state object?
   * @default initialState
   */
  initialState?: object;
  /**
   * Would you like to pass a different initial state object?
   * @default defaultLocationFunction
   */
  locationFunction?: LocationFunction;
  /**
   * Do you want the data object in your reducer to be cleared on _PENDING?
   * @default true
   */
  resetData?: boolean;
}

function defaultInitialState({ resetData = true, initialState = {} }: MethodOptions): IState {
  const state = {
    success: false,
    pending: false,
    error: false
  }
  if (resetData) {
    return {
      ...state,
      data: {},
      ...initialState
    }
  }
  return {
    ...state,
    ...initialState
  }
}

export const asyncMethod = (options: MethodOptions) => {
  const { locationFunction = defaultLocationFunction } = options
  return {
    PENDING: (state, action) => {
      return locationFunction(state, action, {
        ...defaultInitialState(options),
        pending: true
      })
    },
    REJECTED: (state, action) => {
      return locationFunction(state, action, {
        ...defaultInitialState(options),
        error: true,
        data: action.payload
      })
    },
    FULFILLED: (state, action) => {
      return locationFunction(state, action, {
        ...defaultInitialState(options),
        success: true,
        data: action.payload
      })
    }
  }
}

export const reducer = typeToReducer.default

export default (type: string, options: MethodOptions) => {
  const { initialState = {}, locationFunction = defaultLocationFunction } = options
  return reducer(
    {
      [type]: asyncMethod({ initialState, locationFunction })
    },
    { data: {}, ...defaultInitialState(options) }
  )
}
