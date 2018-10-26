import * as typeToReducer from 'type-to-reducer'

type IState = {
  // Success state
  success: true
  pending: false
  error: null
  data?: any
} | {
  // Pending state
  success: true | false | null // success persisting from previous state
  pending: true
  error: any // also persists
  data?: any // also persists
} | {
  // Error state
  success: false
  pending: false
  error: any
  data?: any
}

interface FluxStandardAction {
  type: string
  meta?: any
  payload?: any
  error?: true
}

export type LocationFunction = (state: any, action: FluxStandardAction, internal: IState) => any

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
   * Would you like to pass a different location function?
   * @default defaultLocationFunction
   */
  locationFunction?: LocationFunction;
}

/**
 * Returns the base object for the definition
 * of each action, combining the effects of
 * various options
 */
function defaultInitialState(options: MethodOptions | undefined = {}): IState {
  const { initialState = {} } = options

  const state: IState = {
    success: false,
    pending: false,
    error: null
  }
  return {
    ...state,
    ...initialState
  }
}

interface reducerMapFunction {
  (state: any, action: any): any
}

interface reducerMap {
  [key: string]: reducerMap | reducerMapFunction
}

/**
 * Returns a set of reducer map functions, each corresponding to a different stage
 * of the asyncronous action. The result is contained within a reducerMap.
 */
export function asyncMethod(options: MethodOptions | undefined = {}): reducerMap {
  const { locationFunction = defaultLocationFunction } = options
  return {
    PENDING: (state, action) => {
      return locationFunction(state, action, {
        ...state,
        pending: true
      })
    },
    REJECTED: (state, action) => {
      return locationFunction(state, action, {
        ...state,
        ...defaultInitialState(options),
        error: action.payload
      })
    },
    FULFILLED: (state, action) => {
      return locationFunction(state, action, {
        ...state,
        ...defaultInitialState(options),
        success: true,
        data: action.payload
      })
    }
  }
}

/**
 * Produces the same functionality as the original type-to-reducer function (https://github.com/tomatau/type-to-reducer),
 * with the added feature of defaulting the initialState if one is not provided.
 */
export function asyncReducer(reducerMap: reducerMap, initialState: object | undefined): reducerMapFunction {
  return typeToReducer.default(reducerMap, defaultInitialState({ initialState }))
}

/**
 * Returns the original type-to-reducer function
 */
export const reducer = typeToReducer.default

/**
 * Returns a fully implemented, 1-line reducer function
 */
export default function (type: string, options: MethodOptions | undefined = {}): reducerMapFunction {
  const { initialState = {}, locationFunction = defaultLocationFunction } = options
  return reducer({
    [type]: asyncMethod({ initialState, locationFunction })
  }, defaultInitialState(options))
}
