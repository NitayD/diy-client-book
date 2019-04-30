import {
  requestEvents,
  requestEventsSuccess,
  requestEventsError
} from '../actions/event'

import { put, takeLatest } from 'redux-saga/effects'

export function* watchFetchEvents() {
  yield takeLatest(requestEvents(), fetchEventsAsync);
}

function* fetchEventsAsync() {
  try {
    yield put(requestEvents());
    const data = yield call(() => {
      return fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())
    })
    yield put(requestEventsSuccess(data));
  } catch (error) {
    yield put(requestEventsError());
  }
}