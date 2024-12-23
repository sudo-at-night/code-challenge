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

describe('/users', async () => {
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

  describe('GET', () => {
    test('can list all users', async () => {
      await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const response = await server.inject({ method: 'GET', url: '/users' })

      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body)).toHaveLength(3)
    })

    test('can list a single user', async () => {
      const [[user]] = await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }).returning('*'),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const response = await server.inject({
        method: 'GET',
        url: `/users/${user.id}`,
      })

      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body).email).toEqual('test@mail.com')
    })

    test('returns 404 if non-existing user ID is given', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/users/100`,
      })

      expect(response.statusCode).toEqual(404)
    })
  })

  describe('POST', () => {
    test('can create users', async () => {
      const EMAIL = 'test@mail.com'

      const response = await server.inject({
        method: 'POST',
        url: `/users`,
        body: {
          email: EMAIL,
        },
      })

      const users = await trx(TABLE_USERS).select('*')

      expect(users).toHaveLength(1)
      expect(users[0].email).toEqual(EMAIL)
    })

    test('cannot create multiple users with the same e-mail', async () => {
      const EMAIL = 'test@mail.com'

      await trx(TABLE_USERS).insert({ email: EMAIL })

      const response = await server.inject({
        method: 'POST',
        url: `/users`,
        body: {
          email: EMAIL,
        },
      })

      expect(response.statusCode).toEqual(422)
    })
  })

  describe('DELETE', () => {
    test('can remove users', async () => {
      const [[user]] = await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }).returning('*'),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${user.id}`,
      })

      expect(response.statusCode).toEqual(204)
    })

    test('returns 404 if non-existing user ID is given', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/100`,
      })

      expect(response.statusCode).toEqual(404)
    })
  })
})
