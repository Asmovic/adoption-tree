const knex = require('../../../lib/knexConnection');
const { ErrorHandler } = require('../ErrorHandler');
const { VW_DOCTORS } = require('../../../config/dbConfig').tableNames;

exports.saveDetailsValidation = async (body) => {
  const { email, phone, idNumber } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('email', email),
    checkForUnique('phone', phone),
    checkForUnique('idNumber', idNumber),
  ]);
};

const checkForUnique = async (key, value) => {
  const exists = await knex(VW_DOCTORS).where(key, value).first();

  if (exists) {
    const error = {
      type: 'validation',
      errors: [{ key, message: `${key} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
