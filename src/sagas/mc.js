import axios from 'axios'
import config from '../api-config'
import {
  CREATE_NEW_MC,
  CREATING_NEW_MC,
  createNewMCSucceded,
  createNewMCFailed,
  createMCReset
} from '../actions/mc'

import { put, takeLatest, take } from 'redux-saga/effects'

export function* watchCreatingMC() {
  yield takeLatest(CREATE_NEW_MC, creatingMCAsync)
}

function* creatingMCAsync() {
  try {
    const dataToServer = yield take(CREATING_NEW_MC)
    const { date, price, maxMembers, project } = dataToServer.payload
    const result = yield axios.post(`${config.apiaddress}/mc/new`, { date, price, maxMembers, project })
    const { status } = result
    if (status >= 200 && status < 300)
      yield put(createNewMCSucceded())
    else
      yield put(createNewMCFailed())
    yield put(createMCReset())
  } catch (error) {
    yield put(createNewMCFailed(error))
  }
}