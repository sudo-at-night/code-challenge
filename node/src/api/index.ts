import { type FastifyPluginCallback } from 'fastify'

import { usersRouter } from '@src/api/users/users'

// This is where we can implement a proper authentication mechanism.
// I would do it, but I wanted to focus on other things.
// Let's say I have a public and non-public API, we can separate
// the routers here and apply proper auth mechanism for each of them.
export const api: FastifyPluginCallback = (apiServer, _, done) => {
  apiServer.register(usersRouter)

  done()
}
