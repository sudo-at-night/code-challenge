import { type FastifyPluginCallback } from 'fastify'

import { usersRouter } from '@src/api/users/users'
import { eventsRouter } from '@src/api/events/events'

// This is where we can implement a proper authentication mechanism.
// I would do it, but I wanted to focus on other things.
// Let's say I have a public and non-public API, we can separate
// the routers here and apply proper auth mechanism for each of them.
export const api: FastifyPluginCallback = (apiServer, _, done) => {
  apiServer.setErrorHandler(function (err, _, res) {
    if (err.validation) {
      return res.status(422).send()
    }
    res.status(500).send()
  })

  apiServer.register(usersRouter)
  apiServer.register(eventsRouter)

  done()
}
