exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("account_verification", (table) => {
      table.bigIncrements();
      table
        .bigInteger("userId")
        .unsigned()
        .notNullable()
        .references("users.id");
      table.string("userRole", 50).defaultTo("").notNullable();
      table.string("activationCode", 30).defaultTo("").notNullable();
      table.string("continuationToken", 30).defaultTo("").notNullable();
      table.dateTime("createdAt").defaultTo(knex.fn.now());
      table.dateTime("updatedAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("account_verification")]);
};
