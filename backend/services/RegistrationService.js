const registrationRepository = require('./../repositories/RegistrationRepository');
const userRepository = require('./../repositories/UserRepository');
const { ENTITY_NOT_FOUND, RECORD_EXPIRED } = require('./../constants/errors');
const { generateRandomString, cleanUserData } = require('./../lib/utils');
const moment = require('moment');

class RegistrationService {
  addUser (user, authPhone) {
    const { role, ...userData } = user;
    const activationCode = generateRandomString(6).toUpperCase();
    const continuationToken = authPhone ? null : generateRandomString(24);
    return registrationRepository.addUser(
      userData,
      role,
      activationCode,
      continuationToken,
      authPhone,
    );
  }

  async confirmRegistration (continuationToken, activationCode) {
    const record = await registrationRepository.findConfirmationEntry(
      continuationToken,
      activationCode.toUpperCase(),
    );

    if (!record) throw new Error(ENTITY_NOT_FOUND);

    const { createdAt, userId, userRole } = record;
    if (moment(createdAt).add(2, 'd').isBefore()) { throw new Error(RECORD_EXPIRED); }

    // Activate user
    const user = {
      id: userId,
      active: true,
      verified: true,
      roles: JSON.stringify([userRole]),
    };
    // TODO: Remove temporary record in account activation table
    const [updatedUser] = await userRepository.updateUser(user);
    return cleanUserData(updatedUser);
  }
}

module.exports = new RegistrationService();
