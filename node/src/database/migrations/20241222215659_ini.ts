import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    // I'd use UUIDv7 here by extending Postgres with a function for it
    // but for the sake of time saving I'll use an incrementing
    // integer here for now.
    table.increments('id').primary()
    table.string('email').unique()
    table.index('email')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
  await knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('id').inTable('users')
    table
      .enum('type', ['consent'], {
        enumName: 'event_type',
        useNative: true,
      })
      .notNullable()
    table.jsonb('data')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('events')
  await knex.schema.dropTable('users')
  await knex.schema.raw('DROP TYPE event_type')
}
