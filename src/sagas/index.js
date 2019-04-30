import { fork } from 'redux-saga/effects'
import { watchCreatingProjects } from './projects'
import { watchCreatingMC } from './mc'
import { watchCreatingMember } from './member'
import { watchCreatingClient } from './client'
import { watchCreatingChild } from './children'

export function* rootSaga() {
  yield fork(watchCreatingProjects)
  yield fork(watchCreatingMC)
  yield fork(watchCreatingMember)
  yield fork(watchCreatingClient)
  yield fork(watchCreatingChild)
}