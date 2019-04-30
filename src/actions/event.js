export const FETCH_EVENTS = 'FETCH_EVENTS'
export const REQUESTED_EVENTS = 'REQUESTED_EVENTS'
export const REQUESTED_EVENTS_SUCCEEDED = 'REQUESTED_EVENTS_SUCCEEDED'
export const REQUESTED_EVENTS_FAILED = 'REQUESTED_EVENTS_FAILED'

export const requestEvents = () => {
  return { type: REQUESTED_EVENTS }
};

export const requestEventsSuccess = (data) => {
  return { type: REQUESTED_EVENTS_SUCCEEDED, data: data.message }
};

export const requestEventsError = () => {
  return { type: REQUESTED_EVENTS_FAILED }
};

export const fetchEvents = () => {
  return { type: FETCH_EVENTS }
};