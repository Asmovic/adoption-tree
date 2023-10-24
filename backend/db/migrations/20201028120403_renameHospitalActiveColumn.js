
exports.up = function (knex) {
  return knex.schema.table('hospitals', function (table) {
    table.renameColumn('active', 'isActive');
  });
};

exports.down = function (knex) {
  return knex.schema.table('hospitals', function (table) {
    table.renameColumn('isActive', 'active');
  });
};
