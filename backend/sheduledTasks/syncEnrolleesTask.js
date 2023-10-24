const moment = require('moment');
const axios = require('axios');
const newEnrolleeNotification = require('../notifications/auth/newEnrolleeNotification');
const { getUnsynchronized, updateBiometricID } = require('../repositories/EnrolleeRepository');

exports.run = async () => {
  try {
    const { ENROLLEE_SYNCH_URL: url, ENROLLEE_SYNCH_TOKEN: secretKey } = process.env;

    if (!url || !secretKey) {
      console.log('Enrollee sync parameters not available');
      return;
    }

    const enrollees = await getUnsynchronized();
    console.log('Unsynchronized Enrollees:', enrollees);
    const promises = [];

    for (let i = 0; i < enrollees.length; i++) {
      const enrollee = enrollees[i];

      promises.push(syncEnrollee(url, secretKey, enrollee));
    }

    await Promise.all(promises);
    console.log('Enrollee Syncing completed');
  } catch (error) {
    console.error(error);
  }
};

const syncEnrollee = async (url, secretKey, enrollee) => {
  const payload = getPayload(enrollee, secretKey);
  const config = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  };

  try {
    const { data } = await axios(config);
    console.log('Enrollee Data:', data);
    await updateBiometricID(enrollee.id, data.staff_id, data.biometric_id);

    newEnrolleeNotification.toSms(enrollee.phone, data.biometric_id);
  } catch (error) {
    console.error('ENROLLEE_SYNC_ERROR', error.message);
  }
};

const getPayload = (enrollee, secretKey) => {
  const birthDate = enrollee.birthDate ? moment(enrollee.birthDate) : moment();
  const { plan, membershipType, adoptionCode } = getEnrollmentData();

  return {
    active_status: '',
    enrolleeID: '',
    primary_hcp: `${enrollee.hospitalId}`,
    first_name: enrollee.firstName,
    middle_name: enrollee.middleName,
    surname: enrollee.lastName,
    sex: enrollee.gender,
    birthdate: birthDate.format('MM/DD/YYYY'),
    address: enrollee.address,
    blood_group: enrollee.bloodGroup,
    phone: enrollee.phone,
    nationality: enrollee.nationality,
    state: '17',
    lga: '65',
    email: enrollee.email,
    next_of_kin: `${enrollee.nokFirstName} ${enrollee.nokLastName}`,
    next_of_phone: enrollee.nokPhone,
    next_of_address: enrollee.nokAddress,
    next_of_kin_relationship: enrollee.nokRelationShip,
    genotype: '1',
    religion: '1',
    title: null,
    town: '',
    plan: plan,
    password: null,
    is_image_capured: '0',
    passport: null,
    signature: null,
    membership_type: membershipType,
    adoption_code: adoptionCode,
    secret_key: secretKey,
  };
};

// This method is used for getting different data based on the enrollment type but for now, it's just self enrollment.
const getEnrollmentData = () => {
  return {
    plan: '2',
    membershipType: '1',
    adoptionCode: null,
  };
};
