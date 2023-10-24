exports.up = function (knex) {
  return knex.schema.alterTable("password_resets", function (table) {
    table.string("continuationToken", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("password_resets", function (table) {
    table.dropColumn("continuationToken");
  });
};
