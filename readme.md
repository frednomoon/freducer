# freducer
  The module's default export, `asyncReducer`, returns an object detailing how the
asyncronous aspects of a given action should operate. The object is should be
of the particular form needed for use within the `typeToReducer` package. If you have absolutely no idea what `typeToReducer` does, you may want to learn that first - although hopefully this will be able to bypass that altogether in many scenarios.

## Basic usage

  Usually with `typeToReducer` we would write something like:

    const initialState = {
      pending: false,
      error: false,
      success: false,
      data: {}
    }
    
    const reducer = typeToReducer({
      [GET_RESOURCE]: {
        PENDING: {
          ...initialState,
          pending: true
        }
        REJECTED: {
          ...initialState,
          error: true
          data: payload
        }
        FULFILLED: {
          ...initialState,
          success: true
          data: payload
        }
      }
      [UPDATE_RESOURCE]: {
        PENDING: {
          ...initialState,
          pending: true
        }
        REJECTED: {
          ...initialState,
          error: true
          data: payload
        }
        FULFILLED: {
          ...initialState,
          success: true
          data: payload
        }
      }
    }, { initialState })

  However now we can simplify this to:

    const reducer = typeToReducer({
      [GET_RESOURCE]: asyncReducer()
      [UPDATE_RESOURCE]: asyncReducer()
    }, { initialState })

  (Note that you still need to define `initialState`)
## Arguments

### customInitialState
If we only require a basic async reducer, we can leave both arguments blank
as in the example above. However 2 options are available to customise the reducer.
The most common will be `customInitialState` as we will quite often want to set a different default value for the `data` field. This is no problem - simply pass an object containing whatever fields you want to overwrite:

    typeToReducer({
      [GET_RESOURCE]: asyncReducer({ data: [] })
    }, { initialState })

  Note you still have to pass a full `initialState` object as the second arg for
`typeToReducer`. This will determine the `initialState` of the store when the app loads.

### customLocation
Secondly we are able to tell our reducer to write to nested objects using the 
`customLocation` argument. For example we may wish to do something like this:

    typeToReducer({
      [GET_RESOURCE_WITH_ID]: {
        PENDING: {
          ...state,
          [meta.id]: {
            ...initialState,
            pending: true
          }
        }
        REJECTED: {
          ...state,
          [meta.id]: {
            ...initialState,
            error: true
            data: payload
          }
        }
        FULFILLED: {
          ...state,
          [meta.id]: {
            ...initialState,
            success: true
            data: payload
          }
        }
      }
    }, { initialState })

Instead we can simply do:

    const customLocation = (state, action, internal) => {
      return {
        ...state,
        [action.meta.id]: {
          ...internal
        }
      }
    }

    typeToReducer({
      [GET_RESOURCE]: asyncReducer({}, customLocation)
    }, { initialState })

The arguments `state` & `internal` are less confusing than they seem.
`internal` refers to the object you are trying to place in the store i.e. with
`error`, `success` etc.. And the default setting is to simply place it where the
`state` tree begins. So this function simply describes the steps to get from `state`
i.e. the root of this reducers section of the store, to wherever you want to place the
'internals'.

## Non-default exports

### full reducer (freducer)

Often in more complex applications single sectors of the store (each governed by 1 reducer), will mutated by several actions eg. `GET_RESOURCE` & `DELETE_RESOURCE`. However in the most simple situation a reducer will only have a single action, for example `UPSERT_RESOURCE`. In this case, the object that we pass to `typeToReducer` becomes very simple (and repetitive) so we can simplify it even further.

Using `asyncReducer` we might write something like this:

    const reducer = typeToReducer({
      [UPSERT_RESOURCE]: asyncReducer()
    }, { initialState })

However in this case we can simply write:

    const reducer = fullReducer(UPSERT_RESOURCE)


Note that we no longer have to define an `initialState` object - this will save you at least a whopping 5 lines of repeated code per reducer. And just in case you thought it couldn't get EVEN MORE convenient... we can still choose to pass a `customInitialState` as a 2nd argument:

    const reducer = fullReducer(UPSERT_RESOURCE, { data: [] })

<b>INCREDIBLE!</b>