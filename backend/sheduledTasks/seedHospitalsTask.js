const axios = require('axios');
const db = require('../lib/knexConnection');

exports.run = async () => {
  try {
    const { DATA_SEED_URL, DATA_SEED_KEY } = process.env;

    if (!DATA_SEED_URL || !DATA_SEED_KEY) {
      console.log('Data seed parameters not available');
      return;
    }

    const url = `${DATA_SEED_URL}gethcps&secretkey=${DATA_SEED_KEY}`;

    const { data } = await axios.get(url);
    const hospitalData = JSON.parse(data.replace(',]', ']').replace(',,', ','));
    const hcpRecords = hospitalData.map(x => {
      return {
        id: x.id,
        name: x.hcp_name.trim(),
        lgaId: x.hcp_lga,
      };
    });

    // await db('hospitals').truncate();
    // await db.batchInsert('hospitals', hcpRecords);

    await db.raw(
      `? ON CONFLICT (id)
              DO UPDATE SET
              name = EXCLUDED.name,
              "lgaId" = EXCLUDED."lgaId"
            RETURNING *;`,
      [db('hospitals').insert(hcpRecords)],
    );

    console.log('Hospitals seeding complete!');
  } catch (error) {
    console.error(error);
  }
};
