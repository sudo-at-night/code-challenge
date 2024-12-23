import { type FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  removeUser,
  getConsentsByUserId,
} from '@src/services/users/users'

export const usersRouter: FastifyPluginCallback = (usersRoute, _, done) => {
  const getSchema = {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'integer' },
    },
  } as const

  usersRoute.get<{ Params: FromSchema<typeof getSchema> }>(
    '/users/:userId',
    {
      schema: {
        params: getSchema,
      },
    },
    async (req, res) => {
      const userWithConsents = await getConsentsByUserId(req.params.userId)

      if (userWithConsents) {
        return res.code(200).send(userWithConsents)
      }

      res.code(404)
    }
  )

  const postSchema = {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
    },
  } as const

  usersRoute.post<{ Body: FromSchema<typeof postSchema> }>(
    '/users',
    { schema: { body: postSchema } },
    async (req, res) => {
      const { email } = req.body

      if (await getUserByEmail(email)) {
        return res.code(422).send()
      }

      const [user] = await createUser({ email })

      res.code(201).send(await getConsentsByUserId(user.id))
    }
  )

  const deleteSchema = {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'integer' },
    },
  } as const

  usersRoute.delete<{ Params: FromSchema<typeof deleteSchema> }>(
    '/users/:userId',
    { schema: { params: deleteSchema } },
    async (req, res) => {
      const user = await getUserById(req.params.userId)

      if (user) {
        await removeUser(user.id)
        return res.code(204).send()
      }

      res.code(404)
    }
  )

  done()
}
