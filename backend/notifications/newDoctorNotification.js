const { sendEmail } = require('../mail/EmailManager');
const smsService = require('../services/SmsService');

exports.toMail = async (user, token) => {
  await sendEmail(
    user.email,
    'Reset Password Notification',
    'forgotPassword',
    { token },
  );
};

exports.toSms = (user, token) => {
  smsService.sendResetMessage(user.phone, token);
};

exports.sendToAll = async (user, token) => {
  Promise.all([
    this.toMail(user, token),
    this.toSms(user, token),
  ]);
};
