import { type Knex } from 'knex'
import {
  vi,
  afterEach,
  beforeEach,
  describe,
  test,
  expect,
  afterAll,
} from 'vitest'

import { server } from '@src/index'
import { pg, replacePg, restorePg } from '@src/database'
import { TABLE_USERS } from '@src/database/data/users/users'

describe('/events', async () => {
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

  afterAll(() => {
    server.close()
  })

  describe('POST', () => {
    test('returns 422 incorrect event type is given', async () => {
      const [user] = await trx(TABLE_USERS)
        .insert({ email: 'test@mail.com' })
        .returning('*')

      const response = await server.inject({
        method: 'POST',
        url: '/events',
        body: {
          userId: user.id,
          data: {
            type: 'borscht',
            consentId: 'email_notifications',
            enabled: true,
          },
        },
      })

      expect(response.statusCode).toEqual(422)
    })

    describe('event type: consent', () => {
      test('registers a consent event', async () => {
        const [user] = await trx(TABLE_USERS)
          .insert({ email: 'test@mail.com' })
          .returning('*')

        const response = await server.inject({
          method: 'POST',
          url: '/events',
          body: {
            userId: user.id,
            data: {
              type: 'consent',
              consentId: 'email_notifications',
              enabled: true,
            },
          },
        })

        expect(response.statusCode).toEqual(201)
        expect(JSON.parse(response.body)).toEqual({
          user: {
            id: user.id,
          },
          consents: [
            {
              id: 'email_notifications',
              enabled: true,
            },
          ],
        })
      })

      test('returns 422 if non-existing user ID is given', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/events',
          body: {
            userId: 100,
            data: {
              type: 'consent',
              consentId: 'email_notifications',
              enabled: true,
            },
          },
        })

        expect(response.statusCode).toEqual(422)
      })

      test('returns 422 if incorrect consent event data is given', async () => {
        const [user] = await trx(TABLE_USERS)
          .insert({ email: 'test@mail.com' })
          .returning('*')

        const response = await server.inject({
          method: 'POST',
          url: '/events',
          body: {
            userId: user.id,
            data: {
              type: 'consent',
              consentId: 'email_notificatioxn',
              enabled: true,
            },
          },
        })

        expect(response.statusCode).toEqual(422)
      })
    })
  })
})
