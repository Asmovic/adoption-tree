
exports.up = async (knex) => {
  await knex.raw('DROP VIEW IF EXISTS vw_enrollees');
  await knex.raw('DROP VIEW IF EXISTS vw_doctors');
  await knex.raw('DROP VIEW IF EXISTS vw_donors');
  await knex.raw('DROP VIEW IF EXISTS vw_patients');

  await knex.schema.table('doctors', function (table) {
    table.dropForeign('hospitalId');
  });

  await Promise.all([
    knex.schema.dropTable('hospitals'),
    knex.schema.dropTable('lgas'),
    knex.schema.dropTable('states'),
  ]);

  await knex.schema.createTable('states', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.string('name', 255).notNullable();
  });

  await knex.schema.createTable('lgas', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.string('name', 255).notNullable();
    table.integer('stateId').unsigned();
  });

  await knex.schema.createTable('hospitals', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.string('name', 255);
    table.integer('lgaId').unsigned();
    table.boolean('active').defaultTo(true);
  });
};

exports.down = async (knex) => {
  await Promise.all([
    knex.schema.dropTable('hospitals'),
    knex.schema.dropTable('lgas'),
    knex.schema.dropTable('states'),
  ]);

  await knex.schema.createTable('states', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.integer('erpId').unsigned();
    table.string('name', 255).notNullable();
    table.string('code', 50).notNullable().unique();
  });

  await knex.schema.createTable('lgas', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.integer('erpId').unsigned();
    table.string('name', 255).notNullable();
    table.string('code', 50).notNullable().unique();
    table.integer('stateId').unsigned();
    table.foreign('stateId').references('id').inTable('states').onDelete('CASCADE');
  });

  await knex.schema.createTable('hospitals', function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.integer('erpId').unsigned();
    table.integer('lgaId').unsigned();
    table.string('value', 255);
  });

  await knex.schema.table('doctors', function (table) {
    table.foreign('hospitalId').references('id').inTable('hospitals').onDelete('SET NULL');
  });
};
