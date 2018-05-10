interface customLocationFunction {
  (state: any, action: any, internal: any): any
}

interface customInitialState {
  [pending: string]: boolean;
  [success: string]: boolean;
  [error: string]: boolean;
  [data: string]: any;
}

interface reducerMapFunction {
  (state: any, action: any): any
}

interface reducerMap {
  [key: string]: reducerMap | reducerMapFunction
}

declare module 'freducer' {
  export function asyncMethod (
    customInitialState: customInitialState,
    customLocation: customLocationFunction
  ): any

  export function reducer (
    reducerMap: reducerMap,
    initialState: any
  ): reducerMapFunction

  export default function freducer (
      type: string,
      customInitialState: customInitialState,
      customLocation: customLocationFunction
  ): any
}
