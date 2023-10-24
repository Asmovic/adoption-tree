const moment = require('moment');
const axios = require('axios');
const { getUnsynchronizedDonors, updateDonorBiometricID } = require('../repositories/EnrolleeRepository');

exports.run = async () => {
  try {
    const { ENROLLEE_SYNCH_URL: url, ENROLLEE_SYNCH_TOKEN: secretKey } = process.env;

    if (!url || !secretKey) {
      console.log('Enrollee sync parameters not available');
      return;
    }

    const donors = await getUnsynchronizedDonors();
    // console.log('enrollees: ', enrollees);
    const promises = [];

    for (let i = 0; i < donors.length; i++) {
      const donor = donors[i];

      promises.push(syncDonor(url, secretKey, donor));
    }

    await Promise.all(promises);
    console.log('Donor Syncing completed');
  } catch (error) {
    console.error(error);
  }
};

const syncDonor = async (url, secretKey, donor) => {
  const payload = getPayload(donor, secretKey);
  var config = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  };

  try {
    const { data } = await axios(config);
    await updateDonorBiometricID(donor.id, data.staff_id);

    // newEnrolleeNotification.toSms(enrollee.phone, data.staff_id);
  } catch (error) {
    console.error('DONOR_SYNC_ERROR', error.message);
  }
};

const getPayload = (donor, secretKey) => {
  const birthDate = donor.birthDate ? moment(donor.birthDate) : moment();
  const { plan, membershipType } = getEnrollmentData();

  return {
    active_status: '',
    enrolleeID: '',
    primary_hcp: '',
    first_name: donor.firstName,
    middle_name: donor.middleName,
    surname: donor.lastName,
    sex: donor.gender,
    birthdate: birthDate.format('MM/DD/YYYY'),
    address: donor.address,
    blood_group: '',
    phone: donor.phone,
    nationality: donor.nationality,
    state: donor.stateId,
    lga: donor.lgaId,
    email: donor.email,
    next_of_kin: '',
    next_of_phone: '',
    next_of_address: '',
    next_of_kin_relationship: '',
    genotype: '',
    religion: null,
    title: null,
    town: '',
    plan: plan,
    password: null,
    is_image_capured: '0',
    passport: null,
    signature: null,
    membership_type: membershipType,
    adoption_code: donor.registrationCode,
    secret_key: secretKey,
  };
};

// This method is used for getting different data based on the enrollment type but for now, it's just self enrollment.
const getEnrollmentData = () => {
  return {
    plan: '5',
    membershipType: '2',
  };
};
