const { HOSPITALS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return knex.schema.alterTable(HOSPITALS, function (table) {
    table.boolean('isActive').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(HOSPITALS, function (table) {
    table.dropColumn('isActive');
  });
};
