import axios from 'axios'
import config from '../api-config'
import {
  CREATE_NEW_MEMBER,
  CREATING_NEW_MEMBER,
  createNewMemberSucceded,
  createNewMemberFailed,
  createResetMember
} from '../actions/member'

import { put, takeLatest, take } from 'redux-saga/effects'

export function* watchCreatingMember() {
  yield takeLatest(CREATE_NEW_MEMBER, creatingMemberAsync);
}

function* creatingMemberAsync() {
  try {
    const dataToServer = yield take(CREATING_NEW_MEMBER)
    const { members, id, callback } = dataToServer.payload
    const result = yield axios.put(`${config.apiaddress}/mc/update`, { members, id })
    const { status, data } = result
    if (status >= 200 && status < 300) {
      yield put(createNewMemberSucceded())
      callback(data.data.members)
    } else {
      yield put(createNewMemberFailed())
    }
    yield put(createResetMember())
  } catch (error) {
    console.error(error)
    yield put(createNewMemberFailed(error))
  }
}