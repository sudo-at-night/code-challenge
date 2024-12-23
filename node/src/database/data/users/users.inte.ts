import { type Knex } from 'knex'
import { vi, afterEach, beforeEach, describe, test, expect } from 'vitest'

import { pg, replacePg, restorePg } from '@src/database'
import * as usersData from './users'

const { TABLE_USERS } = usersData

describe('users', () => {
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

  describe('getAllUsers', () => {
    test('returns all users in the database', async () => {
      await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const result = await usersData.getAllUsers()

      expect(result).toHaveLength(3)
    })
  })

  describe('getUserById', () => {
    test('returns user by id', async () => {
      const [[user]] = await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }).returning('*'),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const result = await usersData.getUserById(user.id)

      expect(result.email).toEqual('test@mail.com')
    })
  })

  describe('getUserByEmail', () => {
    test('returns user by email', async () => {
      const [[user]] = await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }).returning('*'),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      const result = await usersData.getUserByEmail(user.email)

      expect(result.email).toEqual('test@mail.com')
    })
  })

  describe('createUser', () => {
    test('creates a new user', async () => {
      const EMAIL = 'test@mail.com'

      await usersData.createUser({ email: EMAIL })

      const users = await trx(TABLE_USERS).select('*')

      expect(users).toHaveLength(1)
      expect(users[0].email).toEqual('test@mail.com')
    })
  })

  describe('removeUser', () => {
    test('removes a user', async () => {
      const [[user]] = await Promise.all([
        trx(TABLE_USERS).insert({ email: 'test@mail.com' }).returning('*'),
        trx(TABLE_USERS).insert({ email: 'test2@mail.com' }),
        trx(TABLE_USERS).insert({ email: 'test3@mail.com' }),
      ])

      await usersData.removeUser(user.id)

      const users = await trx(TABLE_USERS).select('*')
      expect(users).toHaveLength(2)
    })
  })
})
