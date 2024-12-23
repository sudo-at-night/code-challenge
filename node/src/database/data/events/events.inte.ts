import { type Knex } from 'knex'
import { vi, afterEach, beforeEach, describe, test, expect } from 'vitest'
import _ from 'lodash'

import { pg, replacePg, restorePg } from '@src/database'
import { TABLE_USERS } from '@src/database/data/users/users'
import * as eventsData from './events'

const { TABLE_EVENTS } = eventsData

describe('events', () => {
  let trx: Knex.Transaction

  beforeEach(async () => {
    trx = await pg.transaction()
    replacePg(trx)
  })

  afterEach(async () => {
    await trx.rollback()
    restorePg()
    vi.resetAllMocks()
  })

  describe('createEvent', () => {
    test('creates a new event', async () => {
      const [user] = await trx(TABLE_USERS)
        .insert({ email: 'test@mail.com' })
        .returning('*')

      const newEvent = {
        userId: user.id,
        tzOffset: 20,
        data: {
          type: 'consent',
          dataPoint: 10,
        },
      }

      await eventsData.createEvent(newEvent)

      const events = await trx(TABLE_EVENTS).select('*')

      expect(events).toHaveLength(1)
      expect(_.omit(events[0], 'id', 'created_at')).toEqual({
        user_id: user.id,
        type: newEvent.data.type,
        data: {
          dataPoint: 10,
        },
        created_at_tz_offset: newEvent.tzOffset,
      })
    })
  })
})
