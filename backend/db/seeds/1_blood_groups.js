exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('blood_groups')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('blood_groups').insert([
        { id: 1, erpId: 1, value: 'A+' },
        { id: 2, erpId: 2, value: 'A-' },
        { id: 3, erpId: 3, value: 'B+' },
        { id: 4, erpId: 4, value: 'B-' },
        { id: 5, erpId: 5, value: 'O+' },
        { id: 6, erpId: 6, value: 'O-' },
        { id: 7, erpId: 7, value: 'AB+-' },
        { id: 8, erpId: 8, value: 'AB-' },
      ]);
    });
};
