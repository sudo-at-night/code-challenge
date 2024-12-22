import fastify from 'fastify'
import { api } from '@src/api'

const server = fastify()

server.register(api)

server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})