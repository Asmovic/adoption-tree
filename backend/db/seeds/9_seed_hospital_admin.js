const bcrypt = require('bcrypt');
const { HOSPITAL_ADMIN, ADMIN } = require('../../constants/roles');
const { SESSIONS } = require('../../config/dbConfig').tableNames;

exports.seed = async function (knex) {
  // TODO: Remove after 3 deployments
  // Run fix for session ID issue when trying t seed this user after login
  await knex.schema.table(SESSIONS, table => {
    table.dropForeign(['userId']);
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
  });

  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  const hashPassword1 = await bcrypt.hash(process.env.ADMIN_PASS, saltRounds);
  const hashPassword2 = await bcrypt.hash(process.env.SGS_ADMIN_PASS, saltRounds);
  const hospitalAdminUsername = 'admin';
  const siteAdminUsername = 'site_admin';
  const sgsAdminUsername = 'sgs';
  await knex('users').whereIn('username', [hospitalAdminUsername, siteAdminUsername, sgsAdminUsername]).delete();

  return knex('users').insert([{
    firstName: 'Hospital',
    lastName: 'Admin',
    username: hospitalAdminUsername,
    password: hashPassword1,
    email: 'hospital@admin.com',
    phone: '08000000000',
    gender: 'male',
    roles: JSON.stringify([HOSPITAL_ADMIN.name]),
    hospitalId: 1,
    active: true,
  },
  {
    firstName: 'Site',
    lastName: 'Admin',
    username: siteAdminUsername,
    password: hashPassword1,
    email: 'side_admin@admin.com',
    phone: '08000000001',
    gender: 'male',
    roles: JSON.stringify([ADMIN.name]),
    active: true,
  },
  {
    firstName: 'SGS',
    lastName: 'Admin',
    username: sgsAdminUsername,
    password: hashPassword2,
    email: 'admin@saltingstein.com',
    phone: '08000000002',
    gender: 'male',
    roles: JSON.stringify([ADMIN.name]),
    active: true,
  },
  ]);
};
