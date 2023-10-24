exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('wallet', (table) => {
            table.bigIncrements();
            table
                .bigInteger('userId')
                .unsigned()
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            table.bigInteger('planId').unsigned();
            table.decimal('amount', 15, 2);
            table
                .bigInteger('paymentId')
                .unsigned()
                .references('payments.id')
                .onDelete('CASCADE');
            table.dateTime('createdAt').defaultTo(knex.fn.now());
            table.dateTime('updatedAt').defaultTo(knex.fn.now());
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([knex.schema.dropTable('wallet')]);
};
