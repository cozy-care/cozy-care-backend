/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Review', function (table) {
    table.uuid('review_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // review_id as varchar primary key
    table
      .uuid('caregiver_id', 255)
      .references('caregiver_id')
      .inTable('Caregiver')
      .onDelete('CASCADE'); // Foreign key to Caregiver table
    table
      .uuid('patient_id', 255)
      .references('patient_id')
      .inTable('Patient')
      .onDelete('CASCADE'); // Foreign key to Patient table

    table.float('rating'); // Rating given in the review
    table.text('comment'); // Comment content of the review

    table.datetime('review_time'); // Time when the review was made
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Review');
};
