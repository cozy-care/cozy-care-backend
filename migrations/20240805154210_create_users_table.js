/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Users', function (table) {
    table.increments('user_id').primary();
    table.string('role', 50).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('username', 255).unique().notNullable();
    table.string('password', 255).nullable();

    table.string('firstname', 255).notNullable();
    table.string('middlename', 255).notNullable();
    table.string('lastname', 255).notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Users');
};