exports.up = function (knex) {
    return knex.schema.alterTable('payments', function (table) {
        table.integer('synchStatus');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('payments', function (table) {
        table.dropColumn('synchStatus');
    });
};
