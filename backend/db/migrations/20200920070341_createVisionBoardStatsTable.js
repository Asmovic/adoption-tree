const { VISION_BOARD_STATS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
  return knex.schema.createTable(VISION_BOARD_STATS, function (table) {
    table.increments('id');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
    table.string('title', 255);
    table.string('value', 255);
    table.string('icon', 100).nullable();
    table.boolean('isActive').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(VISION_BOARD_STATS);
};
