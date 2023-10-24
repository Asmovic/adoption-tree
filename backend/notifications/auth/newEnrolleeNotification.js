const smsService = require('../../services/SmsService');
const { appPlatform } = require('../../config/appConfig');

exports.toSms = async (phone, registrationCode) => {
  const message = getMessage(registrationCode);

  await smsService.sendSms(message, phone);
};

const getMessage = (registrationCode) => {
  const message = `Welcome to the ${appPlatform} platform. Your ID is ${registrationCode}. Kindly proceed to the closest ${appPlatform} office for Biometric enrolment. You shall be required to present your ID for identification.`;

  return message;
};
