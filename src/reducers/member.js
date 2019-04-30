import {
  CREATE_NEW_MEMBER,
  CREATING_NEW_MEMBER,
  CREATE_NEW_MEMBER_SUCCEDED,
  CREATE_NEW_MEMBER_FAILED,
  CREATE_MEMBER_RESET
} from '../actions/member'

const initialState = {
  status: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_MEMBER:
      return {
        status: 'start_creating',
        loading: false,
        error: false,
      }
    case CREATING_NEW_MEMBER:
      return {
        status: 'creating',
        loading: true,
        error: false,
      }
    case CREATE_NEW_MEMBER_SUCCEDED:
      return {
        status: 'created',
        loading: false,
        error: false,
      }
    case CREATE_NEW_MEMBER_FAILED:
      return {
        status: 'creating-failed',
        loading: false,
        error: true,
      }
    case CREATE_MEMBER_RESET:
      return {
        status: false,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}