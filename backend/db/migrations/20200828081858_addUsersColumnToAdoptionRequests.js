const { ADOPTION_REQUESTS } = require("../../config/dbConfig").tableNames;

exports.up = async function (knex) {

    await knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.dropColumn("donorId");
        table.dropColumn("enrolleeId");
        table.dropColumn("paymentId");
    });

    await knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.integer("paymentId").unsigned();
        table.integer("userId").unsigned();
        table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.dropColumn("userId");
        table.dropColumn("paymentId");
    });

    await knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.integer("donorId").unsigned();
        table.integer("enrolleeId").unsigned();
        table.string("paymentId", 255);
    });
};

