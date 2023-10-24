const { ADOPTION_REQUESTS } = require('../../config/dbConfig').tableNames;

exports.up = function (knex) {
    return knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.integer('planId').unsigned();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable(ADOPTION_REQUESTS, function (table) {
        table.dropColumn('planId');
    });
};
