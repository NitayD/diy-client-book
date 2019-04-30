import axios from 'axios'
import config from '../api-config'
import {
  CREATE_NEW_CHILD,
  CREATING_NEW_CHILD,
  createNewChildSucceded,
  createNewChildFailed,
  createResetChild
} from '../actions/children'

import { put, takeLatest, take } from 'redux-saga/effects'

export function* watchCreatingChild() {
  yield takeLatest(CREATE_NEW_CHILD, creatingChildAsync);
}

function* creatingChildAsync() {
  try {
    const dataToServer = yield take(CREATING_NEW_CHILD)
    const { fio, age, callback } = dataToServer.payload
    const result = yield axios.post(`${config.apiaddress}/childrens/new`, { fio, age })
    const { status, data } = result
    if (status >= 200 && status < 300) {
      yield put(createNewChildSucceded())
      callback(data.data._id, data.data.fio)
    } else {
      yield put(createNewChildFailed())
    }
    yield put(createResetChild())
  } catch (error) {
    yield put(createNewChildFailed(error))
  }
}