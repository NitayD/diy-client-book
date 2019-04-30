import axios from 'axios'
import config from '../api-config'
import {
  CREATE_NEW_PROJECT,
  CREATING_NEW_PROJECT,
  createNewProjectSucceded,
  createNewProjectFailed,
  createResetProject
} from '../actions/projects'

import { put, takeLatest, take } from 'redux-saga/effects'

export function* watchCreatingProjects() {
  yield takeLatest(CREATE_NEW_PROJECT, creatingProjectAsync);
}

function* creatingProjectAsync() {
  try {
    const dataToServer = yield take(CREATING_NEW_PROJECT)
    const { name, imageLink, callback } = dataToServer.payload
    const result = yield axios.post(`${config.apiaddress}/projects/new`, { name, imageLink })
    const { status } = result
    if (status >= 200 && status < 300) {
      yield put(createNewProjectSucceded())
      callback()
    } else {
      yield put(createNewProjectFailed())
    }
    yield put(createResetProject())
  } catch (error) {
    yield put(createNewProjectFailed(error))
  }
}