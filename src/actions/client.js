import { toast } from 'react-toastify'

export const CREATE_NEW_CLIENT = 'CREATE_NEW_CLIENT'
export const CREATING_NEW_CLIENT = 'CREATING_NEW_CLIENT'
export const CREATE_NEW_CLIENT_SUCCEDED = 'CREATE_NEW_CLIENT_SUCCEDED'
export const CREATE_NEW_CLIENT_FAILED = 'CREATE_NEW_CLIENT_FAILED'
export const CREATE_CLIENT_RESET = 'CREATE_CLIENT_RESET'

export const createNewClient = () => {
  return { type: CREATE_NEW_CLIENT }
}

export const creatingNewClient = (payload, callback) => {
  return { type: CREATING_NEW_CLIENT, payload: { ...payload, callback } }
}

export const createNewClientSucceded = () => {
  return dispatch => {
    toast.success('Клиент успешно добавлен в базу данных', {
      position: "top-right",
      autoClose: 7500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: CREATE_NEW_CLIENT_SUCCEDED })
  }
}

export const createNewClientFailed = () => {
  return { type: CREATE_NEW_CLIENT_FAILED }
}

export const createResetClient = () => {
  return { type: CREATE_CLIENT_RESET }
}
