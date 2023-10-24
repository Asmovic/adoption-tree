exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.boolean("publicProfile").defaultTo(true);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("publicProfile");
    });
};
