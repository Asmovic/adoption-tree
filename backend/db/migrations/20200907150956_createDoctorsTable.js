const { DOCTORS, HOSPITALS, HOSPITAL_DEPARTMENTS, USERS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable(HOSPITAL_DEPARTMENTS, function (table) {
      table.increments('id');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
      table.string('name', 255);
    }),
    knex.schema.createTable(DOCTORS, function (table) {
      table.increments('id');
      table.integer('userId').unsigned();
      table.foreign('userId').references('id').inTable(USERS).onDelete('CASCADE');
      table.integer('departmentId').unsigned().nullable();
      table.foreign('departmentId').references('id').inTable(HOSPITAL_DEPARTMENTS).onDelete('SET NULL');
      table.integer('hospitalId').unsigned().nullable();
      table.foreign('hospitalId').references('id').inTable(HOSPITALS).onDelete('SET NULL');
      table.string('idNumber', 255);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable(DOCTORS),
    knex.schema.dropTable(HOSPITAL_DEPARTMENTS),
  ]);
};
