
const { VISION_BOARD_STATS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return knex.schema.alterTable(VISION_BOARD_STATS, function (table) {
    table.boolean('updateWithEndpoint').defaultTo(false);
    table.string('endpoint', 255);
    table.text('icon').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(VISION_BOARD_STATS, function (table) {
    table.string('icon', 255).alter();
    table.dropColumn('endpoint');
    table.dropColumn('updateWithEndpoint');
  });
};
