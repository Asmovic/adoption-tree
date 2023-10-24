exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.string('registrationCode', 20).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('registrationCode');
  });
};
