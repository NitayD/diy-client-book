import { toast } from 'react-toastify'

export const CREATE_NEW_CHILD = 'CREATE_NEW_CHILD'
export const CREATING_NEW_CHILD = 'CREATING_NEW_CHILD'
export const CREATE_NEW_CHILD_SUCCEDED = 'CREATE_NEW_CHILD_SUCCEDED'
export const CREATE_NEW_CHILD_FAILED = 'CREATE_NEW_CHILD_FAILED'
export const CREATE_CHILD_RESET = 'CREATE_CHILD_RESET'

export const createNewChild = () => {
  return { type: CREATE_NEW_CHILD }
}

export const creatingNewChild = (payload, callback) => {
  return { type: CREATING_NEW_CHILD, payload: { ...payload, callback } }
}

export const createNewChildSucceded = () => {
  return dispatch => {
    toast.success('Ребёнок успешно добавлен в базу данных', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: CREATE_NEW_CHILD_SUCCEDED })
  }
}

export const createNewChildFailed = () => {
  return { type: CREATE_NEW_CHILD_FAILED }
}

export const createResetChild = () => {
  return { type: CREATE_CHILD_RESET }
}
