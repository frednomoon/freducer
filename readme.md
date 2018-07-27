# freducer
  This package contains an implementation of tomatau's [type-to-reducer](https://github.com/tomatau/type-to-reducer) package, combined with pburtchaell's [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware). If you have absolutely no idea what [type-to-reducer](https://github.com/tomatau/type-to-reducer) does, you may want to learn that first - although hopefully this package's API is simple enough will be able to bypass that altogether in many scenarios. However, you will definitely need to understand the use the [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware).

## Basic usage

  Usually with `typeToReducer` we would write something like:

    import typeToReducer from 'type-to-reducer'

    const initialState = {
      pending: false,
      error: false,
      success: false,
      data: {}
    }
    
    const myReducer = typeToReducer({
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

    import { asyncReducer, asyncMethod } from 'freducer'

    const myReducer = asyncReducer({
      [GET_RESOURCE]: asyncMethod()
      [UPDATE_RESOURCE]: asyncMethod()
    })

  (Note that we also no longer have to define `initialState`)

## Default export

### full reducer (freducer)

Often, as in the previous example, one part of the store will be affected by multiple actions. However in the most simple situation a reducer will only have a single action, for example `UPSERT_RESOURCE`. At this level, we once again start repeating code, but not anymore...

Using the `asyncReducer` & `asyncMethod` functions above, we might write something like this:

    const myReducer = asyncReducer({
      [UPSERT_RESOURCE]: asyncMethod()
    })

Using `freducer`'s default export, we can instead write:

    const reducer = fullReducer(UPSERT_RESOURCE)

<b>INCREDIBLE!</b>

## Options

### initialState
If we only require a basic async reducer, we can leave both arguments blank
as in the example above. However 2 options are available to customise the reducer.
The most common will be `initialState` as we will quite often want to set a different default value for the `data` field. This is no problem - simply pass an object containing whatever fields you want to overwrite:

    const customInitialState = { data: [] }

    const reducer = asyncReducer({
      [GET_RESOURCE]: asyncMethod({ initialState: customInitialState })
    }, customInitialState)

Note that whatever you object you pass here will be merged (using spread operator) with the default object. 

### locationFunction
Secondly we are able to tell our reducer to write to nested objects using a 
`locationFunction` argument. For example we may wish to do something like this:

    const myReducer = typeToReducer({
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

Instead we can simply write:

    const locationFunction = (state, action, internal) => {
      return {
        ...state,
        [action.meta.id]: {
          ...internal
        }
      }
    }

    const myReducer = asyncReducer({
      [GET_RESOURCE]: asyncMethod({ locationFunction })
    })

The arguments `state` & `internal` are less confusing than they seem.
`internal` refers to the object you are trying to place in the store i.e. with
`error`, `success` etc.. And the default setting is to simply place it where the
`state` tree begins. So this function simply describes the steps to get from `state`
i.e. the root of this reducers section of the store, to wherever you want to place the
'internals'.

### resetData

A common variation between asyncronous reducer functions is the behaviour of the `_PENDING` action, and its interaction with the `data` field. The default behaviour is for the `data` field to be ignored when a `_PENDING` action is fired. However, in some situations we may want to reset it to an empty object, `{}`, in preparation for the following `_SUCCESS` or `_ERROR` action

We can now achieve this by setting `resetData: true` in either the `asyncMethod` function or `fullReducer`.