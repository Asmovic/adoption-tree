const db = require('../lib/knexConnection');
const { PASSWORD_RESETS } = require('../config/dbConfig').tableNames;
const { generateRandomString, generateRandomNumber } = require('../lib/utils');

exports.generateResetToken = async (user) => {
  const token = generateRandomNumber(6);
  const continuationToken = generateRandomString(64);

  await db(PASSWORD_RESETS).insert({
    username: user.username,
    phone: user.phone,
    token,
    continuationToken,
  });

  return { token };
};
