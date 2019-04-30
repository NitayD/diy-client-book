import { combineReducers } from 'redux'

import events from './event'
import projects from './project'
import mc from './mc'
import member from './member'
import client from './client'
import children from './children'

export default combineReducers({
  events,
  projects,
  mc,
  client,
  children,
  member
})