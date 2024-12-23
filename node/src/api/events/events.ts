import { type FastifyPluginCallback } from 'fastify'
import { type FromSchema } from 'json-schema-to-ts'

import {
  type EVENT_DATA,
  EVENT_TYPES,
  EventValidationError,
  registerEvent,
  validateEvent,
} from '@src/services/events/events'
import { getConsentsByUserId, getUserById } from '@src/services/users/users'
import { EventInitializer } from '@src/database/data/events/events'

export const eventsRouter: FastifyPluginCallback = (usersRoute, _, done) => {
  const postSchema = {
    type: 'object',
    required: ['userId', 'data'],
    properties: {
      userId: { type: 'integer' },
      data: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'string',
            enum: EVENT_TYPES,
          },
        },
      },
    },
  } as const

  usersRoute.post<{ Body: FromSchema<typeof postSchema> }>(
    '/events',
    {
      schema: {
        body: postSchema,
      } as const,
    },
    async (req, res) => {
      const { body } = req
      const user = await getUserById(body.userId)

      if (!user) {
        return res.code(422).send()
      }

      try {
        validateEvent(body.data as unknown as EVENT_DATA)
      } catch (err) {
        if (err instanceof EventValidationError) {
          return res.code(422).send()
        }
        return res.code(500).send()
      }

      await registerEvent(body as unknown as EventInitializer)

      res.code(201).send(await getConsentsByUserId(body.userId))
    }
  )

  done()
}
