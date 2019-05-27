import { toast } from 'react-toastify'

export const CREATE_NEW_MC = 'CREATE_NEW_MC'
export const CREATING_NEW_MC = 'CREATING_NEW_MC'
export const CREATE_NEW_MC_SUCCEDED = 'CREATE_NEW_MC_SUCCEDED'
export const CREATE_NEW_MC_FAILED = 'CREATE_NEW_MC_FAILED'
export const CREATE_MC_RESET = 'CREATE_MC_RESET'

export const createNewMC = () => {
  return { type: CREATE_NEW_MC }
}

export const creatingNewMC = (payload) => {
  return { type: CREATING_NEW_MC, payload: payload }
}

export const createNewMCSucceded = () => {
  return dispatch => {
    toast.success('Мастер-класс успешно создан', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: CREATE_NEW_MC_SUCCEDED })
  }
}

export const createNewMCFailed = () => {
  return { type: CREATE_NEW_MC_FAILED }
}

export const createMCReset = () => {
  return { type: CREATE_MC_RESET }
}
