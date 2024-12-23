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
        data: {
          type: 'consent',
          consentId: 'email_notifications',
          enabled: true,
        },
      }

      await eventsData.createEvent(newEvent)

      const events = await trx(TABLE_EVENTS).select('*')

      expect(events).toHaveLength(1)
      expect(_.omit(events[0], 'id', 'created_at')).toEqual({
        user_id: user.id,
        type: newEvent.data.type,
        data: {
          consentId: newEvent.data.consentId,
          enabled: newEvent.data.enabled,
        },
      })
    })
  })

  describe('getLatestConsentEventsByUserId', () => {
    test('returns latest consents without duplicates', async () => {
      const [user] = await trx(TABLE_USERS)
        .insert({ email: 'test@mail.com' })
        .returning('*')
      await Promise.all([
        trx(TABLE_EVENTS).insert({
          created_at: new Date('2024-05-01'),
          user_id: user.id,
          type: 'consent',
          data: {
            consentId: 'email_notifications',
            enabled: true,
          },
        }),
        trx(TABLE_EVENTS).insert({
          created_at: new Date('2024-05-02'),
          user_id: user.id,
          type: 'consent',
          data: {
            consentId: 'email_notifications',
            enabled: false,
          },
        }),
        trx(TABLE_EVENTS).insert({
          created_at: new Date('2024-05-03'),
          user_id: user.id,
          type: 'consent',
          data: {
            consentId: 'sms_notificationss',
            enabled: true,
          },
        }),
      ])

      const consents = await eventsData.getLatestConsentEventsByUserId(user.id)

      expect(consents).toEqual([
        {
          id: 'email_notifications',
          enabled: false,
        },
        {
          id: 'sms_notificationss',
          enabled: true,
        },
      ])
    })
  })
})
