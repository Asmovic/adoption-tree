const { ADOPTION_RATES } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return knex.schema.alterTable(ADOPTION_RATES, function (table) {
    table.boolean('isActive').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(ADOPTION_RATES, function (table) {
    table.dropColumn('isActive');
  });
};
