
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable("hospitals", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.integer('lgaId').unsigned();
            table.string("value", 255);
        }),

        knex.schema.alterTable("enrollees", function (table) {
            table.dropColumn("hospital");
            table.dropColumn("nok");
            table.integer('hospitalId').unsigned();
            table.string('nokFirstName');
            table.string('nokLastName');
            table.string('preExistingConditions');
        }),
    ]);

};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('hospitals'),

        knex.schema.alterTable("enrollees", function (table) {
            table.string("hospital");
            table.string('nok');
            table.dropColumn('hospitalId');
            table.dropColumn('nokFirstName');
            table.dropColumn('nokLastName');
            table.dropColumn('preExistingConditions');
        })
    ]);
};
