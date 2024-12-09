/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Users', function (table) {
    table.uuid('user_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // user_id as varchar primary key

    table.string('username', 255).unique().notNullable(); // username as unique varchar
    table.string('password', 255).nullable(); // password can be null
    table.string('email', 255).unique().nullable(); // email is unique, but nullable
    table.string('google_id', 255).unique().nullable(); // google_id is unique, but nullable
    table.string('role', 50).notNullable(); // role as varchar(50) and not null

    table.string('alias', 100).notNullable();
    table.string('profile_image', 255).nullable(); // new field for profile image
    table.string('phone', 10).unique().nullable(); // phone number as varchar(10), unique and nullable

    table.timestamp('created_at').defaultTo(knex.fn.now()); // created_at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // updated_at timestamp
    table.timestamp('deleted_at').nullable(); // deleted_at timestamp for soft delete
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};
