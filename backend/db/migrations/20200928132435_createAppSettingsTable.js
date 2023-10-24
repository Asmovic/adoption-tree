const { APP_SETTINGS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return knex.schema.createTable(APP_SETTINGS, function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.string('key', 100).notNullable();
    table.string('value', 255).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(APP_SETTINGS);
};
