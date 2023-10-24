exports.up = function(knex) {
    return knex.schema.alterTable('adoption_requests', function (table) {
        table.string('paymentId', 255);
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('adoption_requests', function (table) {
        table.dropColumn('paymentId');
    })
};
