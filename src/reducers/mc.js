import {
  CREATE_NEW_MC,
  CREATING_NEW_MC,
  CREATE_NEW_MC_SUCCEDED,
  CREATE_NEW_MC_FAILED,
  CREATE_MC_RESET
} from '../actions/mc'

const initialState = {
  status: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_MC:
      return {
        status: 'start_creating',
        loading: false,
        error: false,
      }
    case CREATING_NEW_MC:
      return {
        status: 'creating',
        loading: true,
        error: false,
      }
    case CREATE_NEW_MC_SUCCEDED:
      return {
        status: 'created',
        loading: false,
        error: false,
      }
    case CREATE_NEW_MC_FAILED:
      return {
        status: 'creating-failed',
        loading: false,
        error: true,
      }
    case CREATE_MC_RESET:
      return {
        status: false,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}