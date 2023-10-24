const { TEMP_ENROLLEES } = require("./../../config/dbConfig").tableNames;
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable(TEMP_ENROLLEES, function (table) {
      table.bigIncrements("id");
      table.string("enrollees");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable(TEMP_ENROLLEES)]);
};
