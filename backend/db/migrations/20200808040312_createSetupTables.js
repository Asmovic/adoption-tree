
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable("religions", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("value", 255);
        }),

        knex.schema.createTable("blood_groups", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("value", 255);
        }),

        knex.schema.createTable("genotypes", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("value", 255);
        }),

        knex.schema.createTable("nok_relationships", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("value", 255);
        }),

        knex.schema.createTable("states", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("name", 255).notNullable();
            table.string("code", 50).notNullable().unique();
        }),

        knex.schema.createTable("lgas", function (table) {
            table.increments("id");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt");
            table.integer('erpId').unsigned();
            table.string("name", 255).notNullable();
            table.string("code", 50).notNullable().unique();
            table.integer('stateId').unsigned();
            table.foreign('stateId').references('id').inTable('states').onDelete('CASCADE');
        }),
    ]);

};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('lgas'),
        knex.schema.dropTable('states'),
        knex.schema.dropTable('nok_relationships'),
        knex.schema.dropTable('genotypes'),
        knex.schema.dropTable('blood_groups'),
        knex.schema.dropTable('religions'),
    ]);
};
