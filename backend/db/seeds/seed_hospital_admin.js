const bcrypt = require('bcrypt');
const { HOSPITAL_ADMIN } = require('../../constants/roles');

exports.seed = async function (knex) {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  const hashPassword = await bcrypt.hash('password', saltRounds);
  const username = 'admin';

  await knex('users').where({ username }).delete();

  return knex('users').insert([
    {
      firstName: 'Hospital',
      lastName: 'Admin',
      username,
      password: hashPassword,
      email: 'hospital@admin.com',
      phone: '08000000000',
      gender: 'male',
      roles: JSON.stringify([HOSPITAL_ADMIN.name]),
      hospitalId: 1,
      active: true,
    },
  ]);
};
