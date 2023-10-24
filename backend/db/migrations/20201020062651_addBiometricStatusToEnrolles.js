exports.up = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.boolean('hasBiometric').default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.dropColumn('hasBiometric');
  });
};
