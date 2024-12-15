/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('Message', function (table) {
      table.uuid('message_id').defaultTo(knex.raw('gen_random_uuid()')).primary();  // Primary key
      table.uuid('chat_id').references('chat_id').inTable('Chat').onDelete('CASCADE'); // Foreign key to Chat table
      table.uuid('sender_id').references('user_id').inTable('Users').onDelete('CASCADE'); // Foreign key to Users table
      table.text('content').notNullable(); // Message content
      table.timestamp('sent_at').defaultTo(knex.fn.now()); // Timestamp for when the message was sent
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('Message');
  };
  