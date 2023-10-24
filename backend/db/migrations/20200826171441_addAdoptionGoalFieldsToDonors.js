const { DONORS } = require("../../config/dbConfig").tableNames;

exports.up = function (knex) {
    return Promise.all([
        knex.schema.alterTable(DONORS, table => {
            table.decimal("adoptionGoalAmount", 15, 2).nullable();
            table.bigInteger("adoptionGoalCount").nullable();
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.alterTable(DONORS, table => {
            table.dropColumn("adoptionGoalCount");
            table.dropColumn("adoptionGoalAmount");
        }),
    ]);
};
