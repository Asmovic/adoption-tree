const randomize = require('randomatic');
const db = require('./../lib/knexConnection');
const { ENROLLEE, DONOR } = require('../constants/roles');

class RegistrationRepository {
  async addEnrollee (enrollee, userId, trx) {
    trx = trx || db;

    const {
      hospitalId,
      genotypeId,
      religionId,
      bloodGroupId,
      nokFirstName,
      nokLastName,
      nokPhone,
      nokAddress,
      nokRelationshipId,
      preExistingConditions,
    } = enrollee;

    await trx
      .insert({
        userId,
        hospitalId,
        genotypeId,
        religionId,
        bloodGroupId,
        nokFirstName,
        nokLastName,
        nokPhone,
        nokAddress,
        nokRelationshipId,
        preExistingConditions,
      })
      .into('enrollees');
  }

  /**
   * Add user to app. This also generates an activation code
   * that will be used to confirm the user's registration
   * @param {object} user The user object
   * @param {String} role User's role
   * @returns {Promise<Object | Error>} Returns activation code on
   * success or throws error on failure
   */
  async addUser (user, role, activationCode, continuationToken, authPhone) {
    await db.transaction(async (trx) => {
      try {
        const {
          firstName,
          lastName,
          middleName,
          email,
          phone,
          username,
          password,
          gender,
          address,
          nationality,
          stateId,
          lgaId,
          birthDate,
        } = user;

        const [userId] = await trx
          .insert({
            firstName,
            lastName,
            middleName,
            email,
            phone,
            username,
            password,
            gender,
            address,
            nationality,
            stateId,
            lgaId,
            birthDate,
            registrationCode: randomize('A', 3) + randomize('0', 6),
            active: !!authPhone,
            verified: !!authPhone,
            roles: authPhone ? JSON.stringify([role]) : null,
          })
          .into('users')
          .returning('id');

        if (role === ENROLLEE.name) {
          await this.addEnrollee(user, userId, trx);
        }

        if (role === DONOR.name) {
          const { residentAddress, residentStateId, residentLgaId } = user;

          await trx
            .insert({
              userId,
              residentAddress,
              residentStateId,
              residentLgaId,
            })
            .into('donors');
        }

        if (!authPhone) {
          await trx
            .insert({ userId, activationCode, continuationToken, userRole: role })
            .into('account_verification');
        }

        await trx.commit();
      } catch (error) {
        await trx.rollback(error);
        throw error;
      }
    });

    return { activationCode, continuationToken };
  }

  findConfirmationEntry (continuationToken, activationCode) {
    return db
      .select()
      .from('account_verification')
      .where({ continuationToken, activationCode })
      .first();
  }

  findConfirmationEntryByContinuation (continuationToken) {
    return db
      .select()
      .from('account_verification')
      .where({ continuationToken })
      .first();
  }
}

module.exports = new RegistrationRepository();
