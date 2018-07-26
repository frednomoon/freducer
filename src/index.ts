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

/**
 * Returns the base object for the definition
 * of each action, combining the effects of
 * various options
 */
function defaultInitialState(options: MethodOptions | undefined = {}): IState {
  const { resetData = true, initialState = {} } = options

  const state: IState = {
    success: false,
    pending: false,
    error: false
  }
  if (resetData) {
    state.data = {}
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

/**
 * Produces the same functionality as the original type-to-reducer function (https://github.com/tomatau/type-to-reducer),
 * with the added feature of defaulting the initialState if one is not provided.
 */
export const asyncReducer = (reducerMap: reducerMap, initialState: object | undefined) => typeToReducer.default(reducerMap, defaultInitialState({ initialState }))

/**
 * Returns the original type-to-reducer function
 */
export const reducer = typeToReducer.default

/**
 * Returns a fully implemented, 1-line reducer function
 */
export default (type: string, options: MethodOptions | undefined = {}) => {
  const { initialState = {}, locationFunction = defaultLocationFunction } = options
  return asyncReducer({
    [type]: asyncMethod({ initialState, locationFunction })
  }, defaultInitialState(options))
}
