const { PAYMENTS, ADOPTION_REQUESTS, USERS } = require("../../config/dbConfig").tableNames;

exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable(PAYMENTS, function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('userId').unsigned().nullable();
            table.string("reference", 255);
            table.decimal("amount", 15, 2);
            table.string("status", 20).defaultTo("pending");
            table.string("gateway", 50);
            table.string("channel", 50);
            table.string("description");
            table.timestamp("paymentDate");

            table.foreign('userId').references('id').inTable(USERS).onDelete('CASCADE');
        }),
    ]);

};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable(PAYMENTS),
    ]);
};
