/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("SessionToken", (table) => {
      table.uuid("session_id").defaultTo(knex.raw('gen_random_uuid()')).primary(); // Primary key
      table
        .uuid('user_id', 255)
        .references('user_id')
        .inTable('Users')
        .onDelete('CASCADE'); // Foreign key to Users table
      table.string("token", 64).notNullable().unique(); // Unique session token
      table.timestamp("expires_at").notNullable(); // Expiration timestamp
      table.string("device_info", 255).nullable(); // Device information
      table.string("ip_address", 45).nullable(); // IP address
      table.timestamp("created_at").defaultTo(knex.fn.now()); // Creation timestamp

    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SessionToken");
  };
  