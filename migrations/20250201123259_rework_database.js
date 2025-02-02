/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Drop the existing tables if they exist
  await knex.schema.dropTableIfExists('Task');
  await knex.schema.dropTableIfExists('SubPatient');
  await knex.schema.dropTableIfExists('Review');
  await knex.schema.dropTableIfExists('Caregiver');
  await knex.schema.dropTableIfExists('Patient');

  // Create the new `Client` table
  await knex.schema.createTable('Client', (table) => {
    table.uuid('client_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // client_id as UUID primary key
    table
      .uuid('user_id', 255)
      .references('user_id')
      .inTable('Users')
      .onDelete('CASCADE'); // Foreign key to Users table
  });

  // Create the new `SubClient` table
  await knex.schema.createTable('SubClient', (table) => {
    table.uuid('sub_client_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // sub_client_id as UUID primary key
    table
      .uuid('client_id', 255)
      .references('client_id')
      .inTable('Client')
      .onDelete('CASCADE'); // Foreign key to Client table

    table.string('firstname', 255); // Optional first name
    table.string('middlename', 255); // Optional middle name
    table.string('lastname', 255); // Optional last name
    table.string('profile_image', 255); // Optional profile image

    table.string('sex', 50); // Optional sex
    table.datetime('birth_date'); // Optional birth date
    table.float('weight'); // Optional weight
    table.float('height'); // Optional height

    table.string('client_type', 255); // Optional type field
    table.string('phy_con', 255); // Optional physical condition field
    table.string('con_dis', 255); // Optional congenital disease field
    table.string('drug_all', 255); // Optional drugs allergy field
    table.string('drug_used', 255); // Optional drugs used field

    table.boolean('is_term').defaultTo(false);

    table.datetime('available_time'); // Optional available time field
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Updated at timestamp
  });

  await knex.schema.createTable('Caregiver', function (table) {
    table.uuid('caregiver_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // caregiver_id as varchar primary key
    table
      .uuid('user_id', 255)
      .references('user_id')
      .inTable('Users')
      .onDelete('CASCADE'); // Foreign key to Users table
      
    table.string('firstname', 255);
    table.string('middlename', 255);
    table.string('lastname', 255);

    table.string('sex', 50);
    table.datetime('birth_date');
    table.float('weight');
    table.float('height');

    table.string('used_language', 255);
    table.text('experience');
    table.text('study_experience');
    table.string('certification_image', 255);

    table.boolean('is_term').defaultTo(false);
    table.boolean('is_approve').defaultTo(false);
    table.datetime('available_time'); // Available time (optional)

    table.timestamp('created_at').defaultTo(knex.fn.now()); // created_at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // updated_at timestamp
  });

  await knex.schema.createTable('Task', (table) => {
    table.uuid('task_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // task_id as varchar primary key
    table
      .uuid('caregiver_id', 255)
      .references('caregiver_id')
      .inTable('Caregiver')
      .onDelete('CASCADE'); // Foreign key to Caregiver table
    table
      .uuid('sub_client_id', 255)
      .references('sub_client_id')
      .inTable('SubClient')
      .onDelete('CASCADE'); // Foreign key to SubPatient table

    table.string('task_status', 255); // Status of the task
    table.string('task_type', 255);

    table.datetime('start_time'); // Start time of the task
    table.datetime('end_time'); // End time of the task
  });

  await knex.schema.createTable('Review', (table) => {
    table.uuid('review_id', 255).defaultTo(knex.raw('gen_random_uuid()')).primary(); // review_id as varchar primary key
    table
      .uuid('caregiver_id', 255)
      .references('caregiver_id')
      .inTable('Caregiver')
      .onDelete('CASCADE'); // Foreign key to Caregiver table
    table
      .uuid('client_id', 255)
      .references('client_id')
      .inTable('Client')
      .onDelete('CASCADE'); // Foreign key to Patient table

    table.float('rating'); // Rating given in the review
    table.text('comment'); // Comment content of the review

    table.datetime('review_time'); // Time when the review was made
  });

  await knex.schema.createTable('ClientOrder', function (table) {
    table
      .uuid('sub_client_id', 255)
      .references('sub_client_id')
      .inTable('SubClient')
      .onDelete('CASCADE'); // Foreign key to SubPatient table

    table.text('address', 255);
    table.text('geocode', 255);

    table.string('want_language', 255);
    table.string('payment_type');
    table.string('price').nullable;
    table.string('want_ext_skill', 255);
    table.string('more_addition', 255);

    table.datetime('start_time'); // Start time of the task
    table.datetime('end_time'); // End time of the task

    table.timestamp('created_at').defaultTo(knex.fn.now()); // created_at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // updated_at timestamp
  });

  await knex.schema.createTable('CaregiverOrder', function (table) {
    table
      .uuid('caregiver_id', 255)
      .references('caregiver_id')
      .inTable('Caregiver')
      .onDelete('CASCADE'); // Foreign key to SubPatient table

    table.text('address', 255);
    table.text('geocode', 255);

    table.string('want_client_type', 255);
    table.string('payment_type');
    table.string('price').nullable;
    table.string('more_skill', 255);

    table.datetime('start_time'); // Start time of the task
    table.datetime('end_time'); // End time of the task

    table.timestamp('created_at').defaultTo(knex.fn.now()); // created_at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // updated_at timestamp
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
