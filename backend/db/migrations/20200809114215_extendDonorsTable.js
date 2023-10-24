exports.up = function (knex) {
    return knex.schema.alterTable('donors', function (table) {
        table.string('residentAddress', 255);
        table.integer('residentStateId');
        table.integer('residentLgaId');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('enrollees', function (table) {
        table.dropColumn('residentLgaId');
        table.dropColumn('resudentStateId');
        table.dropColumn('residentAddress');
    });
};
