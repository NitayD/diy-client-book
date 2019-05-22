import { combineReducers } from 'redux'

import events from './event'
import projects from './project'
import mc from './mc'
import member from './member'
import client from './client'
import children from './children'
import login from './login'

export default combineReducers({
  login,
  events,
  projects,
  mc,
  client,
  children,
  member
})