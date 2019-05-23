import { fork, take, takeLatest, put, cancel } from 'redux-saga/effects'
import axios from 'axios'
import { watchCreatingProjects } from './projects'
import { watchCreatingMC } from './mc'
import { watchCreatingMember } from './member'
import { watchCreatingClient } from './client'
import { watchCreatingChild } from './children'
import cookieLibs from '../libs/cookie'

import config from '../api-config'
import {
  LOGIN_IN,
  loginInSucceded,
  loginInFailed,
  UNAUTHORIZATION
} from '../actions/login'


export function* rootSaga() {
  cookieLibs.delete('token')
  const tokenFromCookie = cookieLibs.get('token')
  if (!!tokenFromCookie) {
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      Authorization: tokenFromCookie
    }
    yield put(loginInSucceded(tokenFromCookie))
  } else {
    yield takeLatest(LOGIN_IN, authtorizationAsync);
  }
}

function* authtorizationAsync({ payload }) {
  try {
    const tokenFromCookie = cookieLibs.get('token')
    if (!!tokenFromCookie) {
      axios.defaults.headers.common = {
        ...axios.defaults.headers.common,
        Authorization: tokenFromCookie
      }
      yield put(loginInSucceded(tokenFromCookie))
    } else {
      const result = yield axios.post(`${config.apiaddress}/user/login`, payload)
      const { status, data } = result
      if (status >= 200 && status < 300) {
        if (data.success && !!data.token) {
          axios.defaults.headers.common = {
            ...axios.defaults.headers.common,
            Authorization: data.token
          }
          yield put(loginInSucceded(data.token))
          const dt = new Date()
          dt.setDate(dt.getDate() + 1)
          dt.setHours(0)
          dt.setMinutes(0)
          dt.setSeconds(0)
          dt.setMilliseconds(0)
          cookieLibs.set('token', data.token, {
            expires: Math.ceil((dt.getTime() - Date.now()) / 1000),
            path: '/'
          })
        } else {
          yield put(loginInFailed())
        }
      } else {
        yield put(loginInFailed())
      }
    }
    const sagas = [
      yield fork(watchCreatingProjects),
      yield fork(watchCreatingMC),
      yield fork(watchCreatingMember),
      yield fork(watchCreatingClient),
      yield fork(watchCreatingChild)
    ]
    yield take(UNAUTHORIZATION)
    sagas.forEach(saga => cancel(saga))
  } catch (error) {
    yield put(loginInFailed(error))
  }
}