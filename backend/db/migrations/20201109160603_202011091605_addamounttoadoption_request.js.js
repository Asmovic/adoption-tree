exports.up = function (knex) {
    return knex.schema.alterTable('adoption_requests', function (table) {
        table.decimal('amountcharged', 15, 2);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('adoption_requests', function (table) {
        table.dropColumn('amountcharged');
    });
};
