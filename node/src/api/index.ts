import { type FastifyPluginCallback } from 'fastify'

import { usersRouter } from '@src/api/users'

export const api: FastifyPluginCallback = (apiServer, _, done) => {
  apiServer.register(usersRouter)

  done()
}
