/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Patient', function (table) {
    table.uuid('patient_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // patient_id as varchar primary key
    table
      .uuid('user_id', 255)
      .references('user_id')
      .inTable('Users')
      .onDelete('CASCADE'); // Foreign key to Users table
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Patient');
};
