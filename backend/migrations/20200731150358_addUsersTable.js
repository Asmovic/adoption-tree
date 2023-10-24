exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.bigIncrements();
      table.string('firstName', 50).notNullable();
      table.string('lastName', 50).notNullable();
      table.string('username', 50).notNullable().unique();
      table.string('email', 80).unique();
      table.string('phone', 30).notNullable().unique();
      table.string('password', 500).notNullable();
      table.string('gender', 30).notNullable();
      table.string('profilePicture', 255);
      table.string('roles', 255);
      // `Verified` is used only during account creation.
      // `active` is used for account (de)activation
      table.boolean('verified').defaultTo(false);
      table.boolean('active').defaultTo(false);
      table.dateTime('createdAt').defaultTo(knex.fn.now());
      table.dateTime('updatedAt').defaultTo(knex.fn.now());
      table.index(['phone', 'email', 'username']);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable('users')]);
};
