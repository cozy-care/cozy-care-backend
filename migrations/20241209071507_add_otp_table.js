/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('OtpRequest', (table) => {
      table.uuid('otp_id').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string('email').notNullable();       // Email of the user
      table.string('hashed_otp').notNullable();  // Hashed OTP for security
      table.timestamp('expires_at').notNullable(); // Expiration timestamp for the OTP
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for record creation
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('OtpRequest');
  };
  