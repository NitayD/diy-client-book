import { toast } from 'react-toastify'

export const CREATE_NEW_MEMBER = 'CREATE_NEW_MEMBER'
export const CREATING_NEW_MEMBER = 'CREATING_NEW_MEMBER'
export const CREATE_NEW_MEMBER_SUCCEDED = 'CREATE_NEW_MEMBER_SUCCEDED'
export const CREATE_NEW_MEMBER_FAILED = 'CREATE_NEW_MEMBER_FAILED'
export const CREATE_MEMBER_RESET = 'CREATE_MEMBER_RESET'

export const createNewMember = () => {
  return { type: CREATE_NEW_MEMBER }
}

export const creatingNewMember = (payload, callback) => {
  return { type: CREATING_NEW_MEMBER, payload: { ...payload, callback } }
}

export const createNewMemberSucceded = () => {
  return dispatch => {
    toast.success('Участники успешно добавлены в базу данных', {
      position: "top-right",
      autoClose: 7500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return dispatch({ type: CREATE_NEW_MEMBER_SUCCEDED })
  }
}

export const createNewMemberFailed = () => {
  return { type: CREATE_NEW_MEMBER_FAILED }
}

export const createResetMember = () => {
  return { type: CREATE_MEMBER_RESET }
}
