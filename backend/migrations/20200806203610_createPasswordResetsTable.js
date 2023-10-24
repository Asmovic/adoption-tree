
exports.up = function (knex) {
    return knex.schema.createTable("password_resets", function (table) {
        table.increments("id");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.string("phone", 255);
        table.string("username", 255);
        table.string("token", 255).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("password_resets");
};
