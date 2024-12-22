import { type FastifyPluginCallback } from 'fastify'

export const usersRouter: FastifyPluginCallback = (usersRoute, _, done) => {
  usersRoute.get('/users', (req, res) => {
    return []
  })

  usersRoute.get('/users/:userId', (req, res) => {
    return null
  })

  done()
}
