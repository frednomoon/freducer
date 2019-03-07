# freducer
  This package contains an implementation of tomatau's [type-to-reducer](https://github.com/tomatau/type-to-reducer) package, for use with pburtchaell's [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware). If you have absolutely no idea what [type-to-reducer](https://github.com/tomatau/type-to-reducer) does, I really recommend taking a look at that as well - although hopefully this package's API is simple enough will be able to bypass that altogether in many scenarios. However, you will definitely need to understand the use the [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware).

## Basic usage

  Take the following reducer, written with standard Redux syntax:

    const myReducer = (state, action) => {
      switch (action.type) {
        case 'GET_RESOURCE_PENDING':
          return {
            ...state,
            pending: true
          }
        case 'GET_RESOURCE_FULFILLED':
          return {
            ...state,
            success: true,
            data: action.payload
          }
        case 'GET_RESOURCE_REJECTED':
          return {
            ...state,
            error: action.payload
          }
        case 'UPDATE_RESOURCE_PENDING':
          return {
            ...state,
            pending: true
          }
        case 'UPDATE_RESOURCE_FULFILLED':
          return {
            ...state,
            success: true,
            data: action.payload
          }
        case 'UPDATE_RESOURCE_REJECTED':
          return {
            ...state,
            error: action.payload
          }
        default:
          return state
      }
    }

  Pretty long and messy right? Using a package like  `typeToReducer` we can improve the code a bit by writing something like this:

    import typeToReducer from 'type-to-reducer'

    const initialState = {
      pending: false,
      success: false,
      error: null,
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
          error: payload
        }
        FULFILLED: {
          ...initialState,
          success: true,
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
          error: payload
        }
        FULFILLED: {
          ...initialState,
          success: true,
          data: payload
        }
      }
    }, { initialState })

  A bit better right? But still *a lot* of repeated code... Imagine if you could simplify this to:

    import { asyncReducer, asyncMethod } from 'freducer'

    const myReducer = asyncReducer({
      [GET_RESOURCE]: asyncMethod()
      [UPDATE_RESOURCE]: asyncMethod()
    })

  Well now you can (note that we also no longer have to define `initialState`)!

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

    const initialState = { data: [] }

    const reducer = asyncReducer({
      [GET_RESOURCE]: asyncMethod({ initialState })
    }, initialState)

Note that whatever you object you pass here will be merged (using spread operator) with the default object. 

### reset (added in 3.1.0)
A very common pattern that started emerging in my projects was needing to "reset" a section of the store having finished with it. An good example of this could be a login / logout process, where you want an action to clear the data from the store. Previously my code looked like this:

    const reducerWithReset = asyncReducer({
      [LOGIN]: asyncMethod({ data: {} }),
      [LOGOUT]: () => initialState
    })

Now, with `reset`, we can simply write:

    const reducerWithReset = fullReducer(LOGIN, { reset: LOGOUT })

Unbelievable!

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
            error: payload
          }
        }
        FULFILLED: {
          ...state,
          [meta.id]: {
            ...initialState,
            success: true,
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
