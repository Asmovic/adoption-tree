const db = require('../../../lib/knexConnection');
const { stateId } = require('../../../config/appConfig');

exports.registrationData = async (req, res) => {
  try {
    const [
      religions,
      bloodGroups,
      genotypes,
      states,
      lgas,
      nokRelationships,
      hospitals,
    ] = await Promise.all([
      db.select().table('religions'),
      db.select().table('blood_groups'),
      db.select().table('genotypes'),
      db.select().table('states'),
      db.select().table('lgas'),
      db.select().table('nok_relationships'),
      db.select().table('hospitals'),
    ]);

    return res.json({
      data: {
        religions,
        bloodGroups,
        genotypes,
        states,
        lgas,
        nokRelationships,
        hospitals,
        defaultStateId: stateId,
      },
    });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      errors: [
        {
          message: 'A server error occurred. Please try again later.',
        },
      ],
    });
  }
};
