const { APP_SETTINGS } = require('../../config/dbConfig').tableNames;

exports.seed = function (knex) {
  return knex(APP_SETTINGS).del()
    .then(function () {
      return knex(APP_SETTINGS).insert([
        { key: 'admin_settings', value: JSON.stringify({ allowProfileToggle: true }) },
      ]);
    });
};
