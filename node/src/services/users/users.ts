import { getLatestConsentEventsByUserId } from '@src/database/data/events/events'
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  removeUser,
} from '@src/database/data/users/users'

export { getAllUsers, getUserById, getUserByEmail, createUser, removeUser }

export const getConsentsByUserId = async (id: number) => {
  const user = await getUserById(id)

  if (!user) {
    return null
  }

  const consents = await getLatestConsentEventsByUserId(id)

  return {
    user: {
      id,
    },
    consents,
  }
}
