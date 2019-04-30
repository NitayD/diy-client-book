import axios from 'axios'
import config from '../api-config'
import {
  CREATE_NEW_CLIENT,
  CREATING_NEW_CLIENT,
  createNewClientSucceded,
  createNewClientFailed,
  createResetClient
} from '../actions/client'

import { put, takeLatest, take } from 'redux-saga/effects'

export function* watchCreatingClient() {
  yield takeLatest(CREATE_NEW_CLIENT, creatingClientAsync);
}

function* creatingClientAsync() {
  try {
    const dataToServer = yield take(CREATING_NEW_CLIENT)
    const { fio, phone, callback } = dataToServer.payload
    const result = yield axios.post(`${config.apiaddress}/clients/new`, { fio, phone })
    const { status, data } = result
    if (status >= 200 && status < 300) {
      yield put(createNewClientSucceded())
      callback(data.data._id, data.data.fio)
    } else {
      yield put(createNewClientFailed())
    }
    yield put(createResetClient())
  } catch (error) {
    yield put(createNewClientFailed(error))
  }
}