exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('pages', (table) => {
      table.increments();
      table.string('title', 500).notNullable().unique();
      table.string('slug', 255).notNullable().unique();
      table.text('content').notNullable();
      table.text('styles').notNullable().defaultTo('');
      table.dateTime('createdAt').defaultTo(knex.fn.now());
      table.dateTime('updatedAt').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable('pages')]);
};
