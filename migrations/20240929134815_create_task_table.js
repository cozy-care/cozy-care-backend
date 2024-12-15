/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Task', function (table) {
    table.uuid('task_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // task_id as varchar primary key
    table
      .uuid('caregiver_id', 255)
      .references('caregiver_id')
      .inTable('Caregiver')
      .onDelete('CASCADE'); // Foreign key to Caregiver table
    table
      .uuid('sub_patient_id', 255)
      .references('sub_patient_id')
      .inTable('SubPatient')
      .onDelete('CASCADE'); // Foreign key to SubPatient table

    table.string('task_status', 50); // Status of the task

    table.datetime('start_time'); // Start time of the task
    table.datetime('end_time'); // End time of the task
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Task');
};
