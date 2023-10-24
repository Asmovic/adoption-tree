exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("enrollees", (table) => {
      table.bigIncrements();
      table
        .bigInteger("userId")
        .unsigned()
        .notNullable()
        .references("users.id");
      table.boolean("active").defaultTo(true);
      table.dateTime("createdAt").defaultTo(knex.fn.now());
      table.dateTime("updatedAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("enrollees")]);
};
