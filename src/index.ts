import * as typeToReducer from 'type-to-reducer'

type IState = {
  // Success state
  success: true
  pending: false
  error: null
  data?: any
} | {
  // Error state
  success: false
  pending: false
  error: any
  data?: any // data persists
} | {
  // Pending state
  success: true | false | null // success persisting from previous state
  pending: true
  error: any // also persists
  data?: any // also persists
}

interface FluxStandardAction {
  type: string
  meta?: any
  payload?: any
  error?: true
}

export type LocationFunction = (state: any, action: FluxStandardAction, internal: any) => any

const defaultLocationFunction: LocationFunction = (state, action, internal) => ({
  ...state,
  ...internal
})

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
  /**
   * Pass the `type` of action you want to be used for
   * resetting this part of the store to its initial state.
   * @default undefined
   */
  reset?: string | undefined;
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
        pending: true
      })
    },
    REJECTED: (state, action) => {
      return locationFunction(state, action, {
        ...defaultInitialState(options),
        error: action.payload
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
  const { initialState = {}, locationFunction = defaultLocationFunction, reset } = options
  return reducer({
    [type]: asyncMethod({ initialState, locationFunction }),
    ...reset && { [reset]: () => defaultInitialState(options) }
  }, defaultInitialState(options))
}
