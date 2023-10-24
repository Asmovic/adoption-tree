const randomize = require('randomatic');
const moment = require('moment');

module.exports = {
  cleanUserData(user) {
    const {
      password, emailVerified, phoneVerified, ...userData
    } = user;

    return userData;
  },

  formatPhoneNumber(number) {
    if (!number) {
      throw new Error('Phone number must be supplied.');
    }

    // Remove starting zeroes
    if (number.startsWith('+') || number.startsWith('234')) return number;
    number = number.replace(/^0*/, '234');
    return number.replace(/^\+{1,1}/, '');
  },

  generateRandomPassword() {
    return randomize('aAa0A0', 8);
  },

  generateRandomString(length) {
    return randomize('aAa0A0', length);
  },

  generateRandomNumber(length) {
    const start = Math.pow(10, length) * 1;
    const end = Math.pow(10, length) * 9;

    return Math.floor(start + Math.random() * end);
  },
  //   leftTrim => (str, value) => str.replace()

  async paginate(query, size, offset) {
    let result = query;
    if (size) {
      result = result.limit(size);
    }

    if (offset) {
      result = result.offset(offset);
    }

    return result;
  },

  formatEnrolleeDataToSync(enrollee) {
    const date = new Date();
    return {
      enrollee_id: enrollee.id,
      staff_id: `INF-${date.getTime()}`,
      first_name: enrollee.firstName,
      middle_name: enrollee.middleName,
      surname: enrollee.lastName,
      sex: enrollee.gender,
      birthdate: enrollee.birthDate ? moment(enrollee.birthDate).format('MM/DD/YYYY') : '01/30/2020',
      blood_group: '5',
      phone: enrollee.phone,
      nationality: 'Nigeria',
      state: '17',
      lga: enrollee.lgaERPId,
      email: enrollee.email,
      next_of_kin: `${enrollee.nokFirstName} ${enrollee.nokLastName}`,
      next_of_phone: enrollee.nokPhone,
      next_of_address: enrollee.nokAddress,
      next_of_kin_relationship: '7',
      ministry: '1000',
      department: '0',
      genotype: enrollee.genotypeId,
      religion: enrollee.religionId,
      identification_no: null,
      primary_hcp: enrollee.primary_hcp,
      secondary_hcp: null,
      title: 'MR.',
      town: '',
      plan: '2',
      date_of_employment: '08/23/2015',
      password: null,
    };
  },
};
