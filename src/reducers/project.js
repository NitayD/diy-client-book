import {
  CREATE_NEW_PROJECT,
  CREATING_NEW_PROJECT,
  CREATE_NEW_PROJECT_SUCCEDED,
  CREATE_NEW_PROJECT_FAILED,
  CREATE_PROJECT_RESET
} from '../actions/projects'

const initialState = {
  status: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_PROJECT:
      return {
        status: 'start_creating',
        loading: false,
        error: false,
      }
    case CREATING_NEW_PROJECT:
      return {
        status: 'creating',
        loading: true,
        error: false,
      }
    case CREATE_NEW_PROJECT_SUCCEDED:
      return {
        status: 'created',
        loading: false,
        error: false,
      }
    case CREATE_NEW_PROJECT_FAILED:
      return {
        status: 'creating-failed',
        loading: false,
        error: true,
      }
    case CREATE_PROJECT_RESET:
      return {
        status: false,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}