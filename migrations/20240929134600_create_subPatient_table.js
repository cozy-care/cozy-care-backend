/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('SubPatient', function (table) {
    table.uuid('sub_patient_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // sub_patient_id as varchar primary key
    table
      .uuid('patient_id', 255)
      .references('patient_id')
      .inTable('Patient')
      .onDelete('CASCADE'); // Foreign key to Patient table

    table.string('firstname', 255); // Optional first name
    table.string('middlename', 255).notNullable(); // Required middle name
    table.string('lastname', 255); // Optional last name
    table.string('profile_image', 255); // Optional profile image

    table.string('sex', 50); // Optional sex
    table.datetime('birth_date'); // Optional birth date
    table.float('weight'); // Optional weight
    table.float('height'); // Optional height

    table.string('province', 255); // Optional province
    table.string('district', 255); // Optional district
    table.string('sub_district', 255); // Optional sub-district

    table.string('type', 255); // Optional type field
    table.string('con_disease', 255); // Optional congenital disease field
    table.string('drug_allegry', 255); // Optional drug allergy field
    table.string('drug_used', 255); // Optional drugs used field

    table.boolean('is_bedridden').defaultTo(false); // Boolean field for bedridden status
    table.boolean('is_feed').defaultTo(false); // Boolean field for whether they are fed

    table.datetime('available_time'); // Optional available time field
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Updated at timestamp
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('SubPatient');
};
