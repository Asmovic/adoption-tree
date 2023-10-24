const knex = require('../../../lib/knexConnection');
const { ErrorHandler } = require('../ErrorHandler');

module.exports = async (body) => {
  const {
    username, email, phone, role,
  } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('username', username),
    checkForUnique('email', email),
    checkForUnique('phone', phone),
  ]);
};

const checkForUnique = async (key, value) => {
  const exists = await knex('users').where(key, value).first();

  if (exists) { throw new ErrorHandler(400, [{ key, message: `${key} is already taken` }]); }
};
