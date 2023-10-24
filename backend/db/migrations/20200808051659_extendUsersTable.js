exports.up = function(knex) {
    return knex.schema.alterTable('users', function (table) {
        table.string('middleName', 255);
        table.string('address', 255);
        table.string('nationality', 255);
        table.integer('stateId');
        table.integer('lgaId');
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', function (table) {
        table.dropColumn('lgaId');
        table.dropColumn('stateId');
        table.dropColumn('nationality');
        table.dropColumn('address');
        table.dropColumn('middleName');
    });
};
