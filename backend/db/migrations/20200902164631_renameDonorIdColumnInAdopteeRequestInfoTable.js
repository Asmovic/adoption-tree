const {
  ADOPTEE_INFO_REQUESTS,
} = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return Promise.all([
    knex.schema.table(ADOPTEE_INFO_REQUESTS, table => {
      table.dropForeign(['donorId']);
      table.renameColumn('donorId', 'userId');
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table(ADOPTEE_INFO_REQUESTS, table => {
      table.dropForeign(['userId']);
      table.renameColumn('userId', 'donorId');
      table.foreign('donorId').references('id').inTable('users').onDelete('CASCADE');
    }),
  ]);
};
