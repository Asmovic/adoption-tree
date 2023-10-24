exports.up = function (knex) {
    return knex.schema.alterTable('donors', function (table) {
        table.string('biometricId', 255);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('donors', function (table) {
        table.dropColumn('biometricId');
    });
};
