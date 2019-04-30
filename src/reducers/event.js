import {
  REQUESTED_EVENTS,
  REQUESTED_EVENTS_SUCCEEDED,
  REQUESTED_EVENTS_FAILED
} from '../actions/event'

const initialState = {
  data: false,
  loading: false,
  error: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case REQUESTED_EVENTS:
      return {
        data: false,
        loading: true,
        error: false,
      }
    case REQUESTED_EVENTS_SUCCEEDED:
      return {
        data: payload,
        loading: false,
        error: false,
      }
    case REQUESTED_EVENTS_FAILED:
      return {
        data: false,
        loading: false,
        error: true,
      }
    default:
      return state
  }
}