import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      // I'd use UUIDv7 here by extending Postgres with a function for it
      // but for the sake of time saving I'll use an incrementing
      // integer here for now.
      table.increments('id').primary()
      table.string('email').unique()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      // Storing TZ offset next to a timestamp in Postgres
      // enables us to use the timestamp + offset in every
      // context we may want it in.
      // We can display this date for the user in the US,
      // at the same time displaying it for someone else in
      // europe.
      // For instance, I'm in Poland and I want to know
      // when the user in the US gave this consent,
      // I can get a clear answer "at 8pm their time"
      // while retaining UTC information next to it.
      table.integer('created_at_tz_offset').defaultTo(0)
    })
    .createTable('events', (table) => {
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
      table.integer('created_at_tz_offset').defaultTo(0)
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('events')
}
