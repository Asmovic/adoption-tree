exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('nok_relationships')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('nok_relationships').insert([
        { id: 1, erpId: 1, value: 'Father' },
        { id: 2, erpId: 2, value: 'Mother' },
        { id: 3, erpId: 3, value: 'Uncle' },
        { id: 4, erpId: 4, value: 'Aunty' },
        { id: 5, erpId: 5, value: 'Brother' },
        { id: 6, erpId: 6, value: 'Sister' },
        { id: 7, erpId: 7, value: 'Husband' },
        { id: 8, erpId: 8, value: 'Wife' },
        { id: 9, erpId: 9, value: 'In-law' },
        { id: 10, erpId: 10, value: 'Cousin' },
        { id: 11, erpId: 11, value: 'Son' },
        { id: 12, erpId: 12, value: 'Daughter' },
      ]);
    });
};
