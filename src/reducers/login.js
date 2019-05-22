import {
  LOGIN_IN,
  LOGIN_IN_SUCCEDED,
  LOGIN_IN_FAILED,
  UNAUTHORIZATION
} from '../actions/login'

const initialState = {
  status: false,
  loading: false,
  error: false,
  token: false
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_IN:
      return {
        status: 'login_in',
        loading: true,
        error: false,
        token: false
      }
    case LOGIN_IN_SUCCEDED:
      return {
        status: 'loginned',
        loading: false,
        error: false,
        token: payload
      }
    case LOGIN_IN_FAILED:
      return {
        status: 'loginned-failed',
        loading: false,
        error: true,
        token: false
      }
    case UNAUTHORIZATION:
      return {
        status: false,
        loading: false,
        error: false,
        token: false
      }
    default:
      return state
  }
}