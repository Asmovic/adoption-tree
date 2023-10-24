const {
  ADOPTION_RATES,
} = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return Promise.all([
    knex.schema.table(ADOPTION_RATES, table => {
      table.renameColumn('dailyAmount', 'onetimeAmount');
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table(ADOPTION_RATES, table => {
      table.renameColumn('onetimeAmount', 'dailyAmount');
    }),
  ]);
};
