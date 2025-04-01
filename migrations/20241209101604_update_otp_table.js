/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('OtpRequest', (table) => {
      table
      .uuid('user_id', 255)
      .references('user_id')
      .inTable('Users')
      .onDelete('CASCADE'); // Foreign key to Users table
      table.string('otp').notNullable();  // Hashed OTP for security
      table.dropColumn('email');
      table.dropColumn('hashed_otp');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('OtpRequest');
  };
  