const knex = require('./../lib/knexConnection');
const { comparePassword } = require('./../lib/auth/security');
const { ENTITY_NOT_FOUND } = require('./../constants/errors');

class AuthService {
  async GetUser (username = '', phone = '') {
    console.log('User name:', username);
    let phone2 = '';
    if (phone.startsWith('0')) phone2 = `234${phone.substring(1)}`;
    if (phone.startsWith('234')) phone2 = `0${phone.substring(3)}`;

    // const user = await knex('enrollees')
    //   .join('users', 'enrollees.userId', 'users.id').select('*')
    //   .where({
    //     username,
    //   })
    //   .orWhere({ phone })
    //   .orWhere({ phone: phone2 })
    //   // .select()
    //   .first();

    // const user = await knex('enrollees')
    //   .join('users', 'enrollees.userId', 'users.id').select('*')
    //   // .where('users.username', username)
    //   .where('users.username', username)
    //   .orWhere({ phone })
    //   .orWhere({ phone: phone2 })
    //   // .select()
    //   .first();

    const user = await knex('users')
      .leftJoin('enrollees', 'enrollees.userId', 'users.id')
      .select('users.*', 'enrollees.biometricId', 'enrollees.AshiaEnrolleeId', 'enrollees.nokPhone')
      // .where('users.username', username)
      .where('users.username', username)
      .orWhere({ phone })
      .orWhere({ phone: phone2 })
      // .select()
      .first();
    console.log('User', user);
    return user;
  }

  async LogInUser (username = '', phone = '', password) {
    const user = await this.GetUser(username, phone);

    if (!user) {
      throw new Error(ENTITY_NOT_FOUND);
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new Error(ENTITY_NOT_FOUND);
    }

    return user;
  }
}

module.exports = new AuthService();
