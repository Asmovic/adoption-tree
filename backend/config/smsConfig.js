const { SMS_API, SMS_USERNAME, SMS_PASSWORD } = process.env;

module.exports = {
  apiUrl: SMS_API,
  apiKey: process.env.SMS_API_KEY,
  username: SMS_USERNAME,
  password: SMS_PASSWORD,
  defaultSender: process.env.DEFAULT_SMS_SENDER || 'AdoptnTree',
};
