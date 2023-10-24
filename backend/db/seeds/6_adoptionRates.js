exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('adoption_rates')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('adoption_rates').insert([
        {
          type: 'individual',
          onetimeAmount: 12100,
          weeklyAmount: 250,
          monthlyAmount: 1100,
        },
        // {
        //   type: 'family',
        //   onetimeAmount: 60100,
        //   weeklyAmount: 2600,
        //   monthlyAmount: 20100,
        // },
      ]);
    });
};
