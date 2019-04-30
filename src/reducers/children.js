import {
  CREATE_NEW_CHILD,
  CREATING_NEW_CHILD,
  CREATE_NEW_CHILD_SUCCEDED,
  CREATE_NEW_CHILD_FAILED,
  CREATE_CHILD_RESET
} from '../actions/children'

const initialState = {
  status: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_CHILD:
      return {
        status: 'start_creating',
        loading: false,
        error: false,
      }
    case CREATING_NEW_CHILD:
      return {
        status: 'creating',
        loading: true,
        error: false,
      }
    case CREATE_NEW_CHILD_SUCCEDED:
      return {
        status: 'created',
        loading: false,
        error: false,
      }
    case CREATE_NEW_CHILD_FAILED:
      return {
        status: 'creating-failed',
        loading: false,
        error: true,
      }
    case CREATE_CHILD_RESET:
      return {
        status: false,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}