import _ from 'lodash'

import { pg } from '@src/database'

export const TABLE_EVENTS = 'events'

export type EventInitializer = {
  userId: string
  tzOffset: number
  data: any
}

export const createEvent = (eventInitializer: EventInitializer) =>
  pg(TABLE_EVENTS).insert({
    user_id: eventInitializer.userId,
    created_at_tz_offset: eventInitializer.tzOffset,
    type: eventInitializer.data.type,
    data: _.omit(eventInitializer.data, 'type'),
  })
