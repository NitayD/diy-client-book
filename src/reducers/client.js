import {
  CREATE_NEW_CLIENT,
  CREATING_NEW_CLIENT,
  CREATE_NEW_CLIENT_SUCCEDED,
  CREATE_NEW_CLIENT_FAILED,
  CREATE_CLIENT_RESET
} from '../actions/client'

const initialState = {
  status: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_CLIENT:
      return {
        status: 'start_creating',
        loading: false,
        error: false,
      }
    case CREATING_NEW_CLIENT:
      return {
        status: 'creating',
        loading: true,
        error: false,
      }
    case CREATE_NEW_CLIENT_SUCCEDED:
      return {
        status: 'created',
        loading: false,
        error: false,
      }
    case CREATE_NEW_CLIENT_FAILED:
      return {
        status: 'creating-failed',
        loading: false,
        error: true,
      }
    case CREATE_CLIENT_RESET:
      return {
        status: false,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}