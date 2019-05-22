import { toast } from 'react-toastify'

export const LOGIN_IN = 'LOGIN_IN'
export const LOGIN_IN_SUCCEDED = 'LOGIN_IN_SUCCEDED'
export const LOGIN_IN_FAILED = 'LOGIN_IN_FAILED'
export const UNAUTHORIZATION = 'UNAUTHORIZATION'

export const loginIn = (payload) => {
  return { type: LOGIN_IN, payload }
}

export const loginInSucceded = (token) => {
  return dispatch => {
    toast.success('Вход выполнен успешно!', {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: LOGIN_IN_SUCCEDED, payload: token })
  }
}

export const loginInFailed = () => {
  return { type: LOGIN_IN_FAILED }
}

export const unauthtorization = () => {
  return { type: UNAUTHORIZATION }
}
