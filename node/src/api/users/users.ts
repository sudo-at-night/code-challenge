import { type FastifyPluginCallback } from 'fastify'

import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  removeUser,
} from '@src/services/users/users'

export const usersRouter: FastifyPluginCallback = (usersRoute, _, done) => {
  usersRoute.get('/users', async (_, res) => {
    res.code(200).send(await getAllUsers())
  })

  usersRoute.get('/users/:userId', async (req, res) => {
    const user = await getUserById(req.params.userId)

    if (user) {
      return res.code(200).send(user)
    }

    res.code(404)
  })

  usersRoute.post('/users', async (req, res) => {
    const { email } = req.body

    if (await getUserByEmail(email)) {
      return res.code(422).send()
    }

    res.code(201).send(await createUser({ email }))
  })

  usersRoute.delete('/users/:userId', async (req, res) => {
    const user = await getUserById(req.params.userId)

    if (user) {
      await removeUser(user.id)
      return res.code(204).send()
    }

    res.code(404)
  })

  done()
}
