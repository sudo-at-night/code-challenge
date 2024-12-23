import _ from 'lodash'

import { pg } from '@src/database'

export const TABLE_EVENTS = 'events'

export type EventInitializer = {
  userId: string
  data: any
}

export const createEvent = (eventInitializer: EventInitializer) =>
  pg(TABLE_EVENTS).insert({
    user_id: eventInitializer.userId,
    type: eventInitializer.data.type,
    data: _.omit(eventInitializer.data, 'type'),
  })

export const getLatestConsentEventsByUserId = async (userId: number) => {
  const consentEvents = await pg.raw(`
    WITH consents as (SELECT
      (data ->> 'consentId') as id,
      (data ->> 'enabled')::boolean as enabled,
      created_at
    FROM ${TABLE_EVENTS}
    WHERE
      type = 'consent'
    ORDER BY created_at DESC)

    SELECT
      DISTINCT ON (id)
      id,
      enabled
    FROM consents
  `)

  return consentEvents.rows
}
