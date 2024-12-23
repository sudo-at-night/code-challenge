import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    // I'd use UUIDv7 here by extending Postgres with a function for it
    // but for the sake of time saving I'll use an incrementing
    // integer here for now.
    table.increments('id').primary()
    table.string('email').unique()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
