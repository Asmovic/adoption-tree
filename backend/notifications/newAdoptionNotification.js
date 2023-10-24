const smsService = require('../services/SmsService');
const { categories } = require('../constants/adoptionRequests');
const { getDurationLabel } = require('../lib/helpers/adoptions');

exports.toSms = async (phone, adoptionRequest) => {
  const message = getMessage(adoptionRequest);

  await smsService.sendSms(message, phone);
};

const getMessage = (request) => {
  const { durationType, duration, category } = request;
  const durationLabel = getDurationLabel(durationType, duration);

  if (category === categories.self) {
    return `You have successfully paid for ${durationLabel} of health insurance on the Imo State Health Insurance Platform.`;
  }

  return `You have successfully been adopted on the Imo State Health Insurance scheme for ${durationLabel}.`;
};