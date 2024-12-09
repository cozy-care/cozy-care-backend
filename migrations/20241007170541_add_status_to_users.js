/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('Users', function (table) {
    table.string('status', 50).defaultTo('free').notNullable(); // adding status field, default is 'free'
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('Users', function (table) {
    table.dropColumn('status'); // remove status field on rollback
  });
};
