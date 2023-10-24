const db = require("./../lib/knexConnection");
const {} = require("./../constants");
const sessionTable = process.env.SESSIONS_TABLE;

class SessionRepository {
  /**
   * Update session based on some WHERE conditions
   * @param {Object} session session object
   * @param {Object} condition Object containing keys mapped
   * to columns for WHERE clause and values used for the matching
   */
  updateByCondition(session, condition) {
    return db
      .table(sessionTable)
      .update(session)
      .where(condition)
      .returning("id");
  }
  update(session) {
    return db
      .table(sessionTable)
      .update(session)
      .where({ id: session.id })
      .returning("id");
  }
}

module.exports = new SessionRepository();
