/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('Patient', function (table) {
    table
    .uuid('sub_patient_id', 255)
    .references('sub_patient_id')
    .inTable('SubPatient')
    .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Patient');
};
