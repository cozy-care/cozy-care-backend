/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('Task', function(table) {
      table.dropColumn('task_type'); // Drop the existing column
      table.string('task_title'); // Add the new column
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('Task', function(table) {
      table.dropColumn('task_title'); // Rollback: remove new column
      table.string('task_type'); // Rollback: re-add the old column
    });
  };
