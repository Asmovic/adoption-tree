exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable("adoptee_info_requests", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('donorId').unsigned().notNullable();
            table.text('reason');
            table.string('status', 50).defaultTo('pending');

            table.foreign('donorId').references('id').inTable('users').onDelete('CASCADE');
        }),
    ]);

};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('adoptee_info_requests'),
    ]);
};

