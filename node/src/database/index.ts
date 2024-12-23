import knex, { type Knex } from 'knex'

import knexConfig from '@src/database/knexfile'

let pgCopy: Knex | null
export let pg: Knex = knex(knexConfig.development)

// Ok, the below is highly experimental and I'd test it
// for memory leaks, but it works and allows us to
// safely test the API, services and database in
// our integration tests.

export const replacePg = (newPg: Knex) => {
  pgCopy = pg
  pg = newPg
}

export const restorePg = () => {
  if (!pgCopy) {
    return
  }

  pg = pgCopy
  pgCopy = null
}
