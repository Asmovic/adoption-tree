exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('adoption_requests', function (table) {
      table.increments('id');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
      table.integer('donorId').unsigned();
      table.integer('enrolleeId').unsigned();
      table.integer('lgaId').unsigned();
      table.string('category', 50);
      table.string('type', 50);
      table.integer('noOfAdoptees').unsigned();
      table.date('startDate').defaultTo(knex.fn.now());
      table.decimal('totalAmount', 15, 2);
      table.string('durationType');
      table.integer('duration').unsigned();
      table.string('paymentProcessed').defaultTo('pending');
      table.string('paymentType');
      table.integer('noOfAdoptedPersons').unsigned();

      table
        .foreign('donorId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('adoptions', function (table) {
      table.increments('id');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
      table.integer('adoptionRequestId').unsigned().notNullable();
      table.integer('adopteeId').unsigned().notNullable();
      table.boolean('completed');
      table.date('startDate');
      table.date('endDate');

      table
        .foreign('adoptionRequestId')
        .references('id')
        .inTable('adoption_requests')
        .onDelete('CASCADE');
      table
        .foreign('adopteeId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('adoption_rates', function (table) {
      table.increments('id');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
      table.string('type');
      table.decimal('dailyAmount', 15, 2);
      table.decimal('weeklyAmount', 15, 2);
      table.decimal('monthlyAmount', 15, 2);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('adoption_rates'),
    knex.schema.dropTable('adoptions'),
    knex.schema.dropTable('adoption_requests'),
  ]);
};
