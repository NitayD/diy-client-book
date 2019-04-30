import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/index'

import { rootSaga } from './sagas/index'
const sagaMiddleware = createSagaMiddleware()

const createMiddlewares = () => {
  let middlewares = [ thunkMiddleware, sagaMiddleware ]
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger({
      level: 'info',
      collapsed: true,
      stateTransformer: state => ({...state})
    }))
  }
  return middlewares
}

const createInitialStore = (initialState = {}) => {
  let middlewares = createMiddlewares()
  let state = { ...initialState }

  const store = createStore(
    rootReducer,
    state,
    compose(applyMiddleware(...middlewares))
  )

  sagaMiddleware.run(rootSaga)

  return store
}

export default createInitialStore
