const db = require('./../lib/knexConnection');
const { VW_ENROLLEES, VW_DONORS, VW_PAYMENTS } = require('../config/dbConfig').tableNames;

class EnrolleeRepository {
  async getUnsynchronized () {
    return await db(VW_ENROLLEES)
      .whereNull('biometricId');
  }

  async getUnsynchronizedDonors () {
    return await db(VW_DONORS)
      .whereNull('biometricId');
  }

  async getUnsynchronizedPayments () {
    return await db(VW_PAYMENTS)
      .whereNull('synchStatus')
      .orWhere({ synchStatus: 0 });
  }

  async updateBiometricID (userId, staffId, biometricId) {
    try {
      return await db('enrollees')
        .where({ userId: userId })
        .returning('id')
        .update({ biometricId: staffId, AshiaEnrolleeId: biometricId });
    } catch (error) {
      console.log(error);
    }
  }

  async updateDonorBiometricID (userId, biometricId) {
    try {
      return await db('donors')
        .where({ userId: userId })
        .returning('id')
        .update({ biometricId });
    } catch (error) {
      console.log(error);
    }
  }

  async updatePaymentStatus (paymentId) {
    try {
      return await db('payments')
        .where({ id: paymentId })
        .update({ synchStatus: 1 });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new EnrolleeRepository();
