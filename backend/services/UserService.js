const repository = require('./../repositories/UserRepository');

class UserService {
  userExists (username) {
    return repository.userExists(username);
  }

  getAll () {
    return repository.getAll();
  }

  getById (id) {
    return repository.getById(id);
  }
}

module.exports = new UserService();
