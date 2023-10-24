exports.up = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.integer('bloodGroupId');
    table.string('hospital', 255);
    table.integer('genotypeId');
    table.integer('religionId');
    table.string('biometricId', 255);
    table.string('AshiaEnrolleeId', 100);
    table.string('nok', 255);
    table.string('nokPhone', 255);
    table.string('nokAddress', 255);
    table.integer('nokRelationshipId');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('enrollees', function (table) {
    table.dropColumn('nokRelationshipId');
    table.dropColumn('nokAddress');
    table.dropColumn('nokPhone');
    table.dropColumn('nok');
    table.dropColumn('biometricId');
    table.dropColumn('AshiaEnrolleeId');
    table.dropColumn('religionId');
    table.dropColumn('genotypeId');
    table.dropColumn('hospital');
    table.dropColumn('bloodGroupId');
  });
};
