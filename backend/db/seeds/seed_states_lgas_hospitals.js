const axios = require('axios');

exports.seed = async (knex) => {
  try {
    const [states, lgas] = await Promise.all([
      axios.get(getUrl('getstates')),
      axios.get(getUrl('getlgas')),
    ]);

    const lgaRercords = lgas.data.map(x => {
      return {
        id: x.id,
        name: x.name.trim(),
        stateId: x.state_id,
      };
    });

    // await knex.batchInsert('states', states.data);
    // await knex.batchInsert('lgas', lgaRercords);

    await knex.raw(
      `? ON CONFLICT (id)
              DO UPDATE SET
              name = EXCLUDED.name
            RETURNING *;`,
      [knex('states').insert(states.data)],
    );

    await knex.raw(
      `? ON CONFLICT (id)
              DO UPDATE SET
              name = EXCLUDED.name
            RETURNING *;`,
      [knex('lgas').insert(lgaRercords)],
    );

    console.log('Seeding complete!');
  } catch (error) {
    console.log('error synching states and lgas: ', error);
  }
};

const getUrl = (endpoint) => {
  const { DATA_SEED_URL: url, DATA_SEED_KEY: secretkey } = process.env;

  return `${url}${endpoint}&secretkey=${secretkey}`;
};
