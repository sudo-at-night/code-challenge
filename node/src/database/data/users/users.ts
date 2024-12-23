import { pg } from '@src/database'

export const TABLE_USERS = 'users'

type UserInitializer = {
  email: string
}

// This is obviously potentially heavy, but I won't have time to
// implement proper pagination with limits for now so I'll
// just assume this app will stay small forever and this won't
// become a problem for me.
export const getAllUsers = async () => pg(TABLE_USERS).select('*')

export const getUserById = async (id: number) =>
  pg(TABLE_USERS).select('*').where({ id }).first()

export const getUserByEmail = async (email: string) =>
  pg(TABLE_USERS).select('*').where({ email }).first()

export const createUser = async (userInitializer: UserInitializer) =>
  pg(TABLE_USERS).insert(userInitializer).returning('*')

export const removeUser = async (id: number) =>
  pg(TABLE_USERS).delete().where({ id })
