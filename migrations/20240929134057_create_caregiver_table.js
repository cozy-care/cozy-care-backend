/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Caregiver', function (table) {
    table.uuid('caregiver_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // caregiver_id as varchar primary key
    table
      .uuid('user_id', 255)
      .references('user_id')
      .inTable('Users')
      .onDelete('CASCADE'); // Foreign key to Users table

    table.string('firstname', 255).notNullable(); // First name (not null)
    table.string('middlename', 255).notNullable(); // Middle name (not null)
    table.string('lastname', 255).notNullable(); // Last name (not null)

    table.string('sex', 50).notNullable(); // Sex (not null)
    table.datetime('birth_date').notNullable(); // Birth date (not null)
    table.float('weight').notNullable(); // Weight (not null)
    table.float('height').notNullable(); // Height (not null)

    table.string('province', 255).notNullable(); // Province (not null)
    table.string('district', 255).notNullable(); // District (not null)
    table.string('sub_district', 255).notNullable(); // Sub-district (not null)

    table.text('experience'); // Experience (optional text field)
    table.string('expert', 255); // Expert in a specific field (optional)
    table.string('certification_image', 255).notNullable(); // Certification image (not null)
    table.string('used_language', 255).notNullable(); // Language used (not null)

    table.boolean('is_approve').defaultTo(false); // Is approved (boolean, default false)

    table.datetime('available_time'); // Available time (optional)
    table.timestamp('created_at').defaultTo(knex.fn.now()); // created_at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // updated_at timestamp
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Caregiver');
};
