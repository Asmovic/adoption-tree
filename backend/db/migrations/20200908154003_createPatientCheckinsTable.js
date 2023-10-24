
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('patient_checkins', function (table) {
      table.increments('id');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
      table.integer('userId').unsigned();
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
      table.integer('doctorId').unsigned();
      table.integer('departmentId').unsigned();
      table.integer('hospitalId').unsigned();
      table.text('note');
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('patient_checkins'),
  ]);
};
