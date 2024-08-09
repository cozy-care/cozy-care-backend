/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Users', function (table) {
    table.uuid('user_id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.string('username', 255).unique().notNullable();
    table.string('password', 255).nullable();
    table.string('email', 255).unique().nullable();
    table.string('google_id', 255).unique().nullable();
    table.string('role', 50).notNullable();

    table.string('firstname', 255).nullable();
    table.string('middlename', 255).nullable();
    table.string('lastname', 255).nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};
