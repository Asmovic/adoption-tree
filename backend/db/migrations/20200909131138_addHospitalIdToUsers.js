exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable('users', function (table) {
      table.bigInteger('hospitalId').unsigned().nullable();
    }),

    knex.schema.alterTable('hospital_departments', function (table) {
      table.bigInteger('hospitalId').unsigned().nullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable('hospital_departments', function (table) {
      table.dropColumn('hospitalId');
    }),
    knex.schema.alterTable('users', function (table) {
      table.dropColumn('hospitalId');
    }),
  ]);
};
