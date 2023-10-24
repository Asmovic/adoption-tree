exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.date('birthDate').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('birthDate');
  });
};
