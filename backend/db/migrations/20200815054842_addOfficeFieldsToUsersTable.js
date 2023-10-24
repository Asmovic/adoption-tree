exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.string("officePhone", 20).defaultTo("");
    table.string("officeAddress", 255).defaultTo("");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.dropColumn("officeAddress");
    table.dropColumn("officePhone");
  });
};
