exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('donors', (table) => {
      table.bigIncrements();
      table
        .bigInteger('userId')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE');
      table.boolean('active').defaultTo(true);
      table.dateTime('createdAt').defaultTo(knex.fn.now());
      table.dateTime('updatedAt').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable('donors')]);
};
