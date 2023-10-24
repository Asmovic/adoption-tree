const sessionTable = process.env.SESSIONS_TABLE;

exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable(sessionTable, (table) => {
      table.bigIncrements();
      table.string("refreshToken", 30).notNullable();
      table.string("accessToken", 1500).notNullable();
      table
        .bigInteger("userId")
        .unsigned()
        .notNullable()
        .references("users.id");
      table.string("userAgent", 500);
      table.specificType("ipAddress", "cidr");
      table.string("deviceId", 255);
      table.string("activeRole", 50).defaultTo("").notNullable();
      table.dateTime("createdAt").defaultTo(knex.fn.now());
      table.dateTime("updatedAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable(sessionTable)]);
};
