const randomize = require('randomatic');
const { generateJWTToken } = require('./../lib/helpers/jwt');
const db = require('./../lib/knexConnection');
const { cleanUserData } = require('./../lib/utils');
const sessionTable = process.env.SESSIONS_TABLE;
const sessionRepository = require('./../repositories/SessionRepository');

class SessionService {
  async createSession (userData, request) {
    const { accessToken, refreshToken } = await this.generateTokens(userData);

    const headers = request ? request.headers : {};
    const ipAddress = headers.ip || request.connection.remoteAddress;
    const userAgent = headers['user-agent'] || '';

    await db
      .insert({
        userId: userData.id,
        accessToken,
        refreshToken,
        userAgent,
        ipAddress,
        activeRole: userData.activeRole || '',
      })
      .into(sessionTable);

    return {
      accessToken,
      refreshToken,
      user: cleanUserData(userData),
    };
  }

  async updateSessionById (session) {
    const results = await sessionRepository.update(session);
    return !!results.length;
  }

  async updateSessionByUserIdAndRefreshToken (session, userId, refreshToken) {
    const results = await sessionRepository.updateByCondition(session, {
      userId,
      refreshToken,
    });

    return !!results.length;
  }

  async endSession (user, refreshToken) {
    const userId = user.id;
    await db.table(sessionTable).del().where({
      userId,
      refreshToken,
    });
  }

  async refreshAuthTokens (accessToken, refreshToken) {
    const error = Error('An error occurred.');
    const [record] = await db.select().from(sessionTable).where({
      accessToken,
      refreshToken,
    });

    if (!record) {
      error.message = 'Session not found.';
      error.code = 'SESSION_NOT_FOUND';
      throw error;
    }

    const { id, userId } = record;

    const [user] = await db.select().from('users').where({
      id: userId,
    });
    const userData = cleanUserData(user);
    userData.activeRole = record.activeRole;
    const tokens = await this.generateTokens(userData);
    // Update refreshed time
    tokens.updatedAt = db.fn.now();
    await db(sessionTable).update(tokens).where({
      id,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };
  }

  async generateTokens (userData) {
    const accessToken = await generateJWTToken(cleanUserData(userData));
    const refreshToken = randomize('aA', 15);

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new SessionService();
