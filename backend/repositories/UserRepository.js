const db = require("./../lib/knexConnection");

class UserRepository {
  addUser(user) {
    return db.insert(user).into("users");
  }

  addUsers(users) {
    return db.batchInsert("users", users).returning("id");
  }

  userExists(username) {
    return db
      .select()
      .from("users")
      .where({
        username,
      })
      .first();
  }

  getAll() {
    return db.select().from("users");
  }

  getById(id) {
    return this.getAll()
      .where({
        "users.id": id,
      })
      .first();
  }

  updateUser(user) {
    user.updatedAt = db.fn.now();
    return db.table("users").returning("*").update(user).where({ id: user.id });
  }
}

module.exports = new UserRepository();
