import { toast } from 'react-toastify'

export const CREATE_NEW_PROJECT = 'CREATE_NEW_PROJECT'
export const CREATING_NEW_PROJECT = 'CREATING_NEW_PROJECT'
export const CREATE_NEW_PROJECT_SUCCEDED = 'CREATE_NEW_PROJECT_SUCCEDED'
export const CREATE_NEW_PROJECT_FAILED = 'CREATE_NEW_PROJECT_FAILED'
export const CREATE_PROJECT_RESET = 'CREATE_PROJECT_RESET'

export const createNewProject = () => {
  return { type: CREATE_NEW_PROJECT }
}

export const creatingNewProject = (payload, callback) => {
  return { type: CREATING_NEW_PROJECT, payload: { ...payload, callback } }
}

export const createNewProjectSucceded = () => {
  return dispatch => {
    toast.success('Проект успешно создан', {
      position: "top-right",
      autoClose: 7500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: CREATE_NEW_PROJECT_SUCCEDED })
  }
}

export const createNewProjectFailed = () => {
  return { type: CREATE_NEW_PROJECT_FAILED }
}

export const createResetProject = () => {
  return { type: CREATE_PROJECT_RESET }
}
