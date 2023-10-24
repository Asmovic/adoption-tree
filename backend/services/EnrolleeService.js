const enrolleeRepository = require("./../repositories/EnrolleeRepository");
const { formatEnrolleeDataToSync } = require("./../lib/utils");
const axios = require("axios").default;

class EnrolleeService {
  addBatchEnrollees(enrollees) {}

  async getUnsynchronized() {
    return enrolleeRepository.getUnsynchronized();
  }

  async synchronizeData() {
    const url = process.env.ENROLLEE_SYNCH_URL;
    if (!url) {
      return;
    }
    const enrolees = await this.getUnsynchronized();
    for (var enrollee of enrolees) {
      const formattedData = formatEnrolleeDataToSync(enrollee);
      try {
        const { data } = await axios.post(url, formattedData);
        if (data.biometric_id) {
          enrolleeRepository.updateBiometricID(
            formattedData.enrollee_id,
            data.biometric_id
          );
        }
      } catch (error) {
        //TODO - log error
        console.log(error);
      }
    }
  }
}
module.exports = new EnrolleeService();
