/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Chat', function (table) {
    table.uuid('chat_id').defaultTo(knex.raw('gen_random_uuid()')).primary();  // Primary key
    table.uuid('user1_id').references('user_id').inTable('Users').onDelete('CASCADE'); // Foreign key to Users
    table.uuid('user2_id').references('user_id').inTable('Users').onDelete('CASCADE'); // Foreign key to Users
    
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the chat was created
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Chat');
};
