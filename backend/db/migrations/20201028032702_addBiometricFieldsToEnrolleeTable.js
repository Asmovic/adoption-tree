exports.up = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.boolean('isImageCaptured').default(false);
    table.text('passport');
    table.text('signature');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.dropColumn('signature');
    table.dropColumn('passport');
    table.dropColumn('isImageCaptured');
  });
};
