exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('religions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('religions').insert([
        { id: 1, erpId: 1, value: 'Christianity' },
        { id: 2, erpId: 2, value: 'Islam' },
        { id: 3, erpId: 3, value: 'Hindu' },
        { id: 4, erpId: 4, value: 'Traditional Religion' },
        { id: 5, erpId: 5, value: 'Others' },
      ]);
    });
};
