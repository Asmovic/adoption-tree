const axios = require('axios').default;
const debug = require('debug')('API:smsService');
const sdk = require('api')('@smslive247api/v1.0#2vmizjp3blaut3hvq');
const util = require('util');
const {
  apiUrl, username, password, defaultSender,
} = require('../config/smsConfig');

const { formatPhoneNumber } = require('./../lib/utils');

class SmsService {
  sendActivationMessage (phone, code) {
    const message = `Your ${process.env.APP_NAME} confirmation OTP is ${code}. Valid for 30 minutes, one-time use only.`;
    this.sendSms(message, [phone]);
  }

  sendResetMessage (phone, token) {
    const message = `Your ${process.env.APP_NAME} confirmation OTP is ${token}. It expires in 30 minutes.`;
    this.sendSms(message, [phone]);
  }

  /**
   *
   * @param {String} message Message to send
   * @param {String | String[]} recipients String containing recipient number or array or numbers
   * @param {String} sender Sender ID
   */
  async sendSms (message, recipients, sender = defaultSender) {
    // Format recipents
    if (!Array.isArray(recipients)) recipients = [recipients];

    // recipients = recipients.map((x) => {
    //   return formatPhoneNumber(x);
    // }).join(',');
    // recipients.forEach(async (recipient) => {
    try {
      // TODO: Use message queue
      // await axios
      //   .get(`${apiUrl}?username=${username}&password=${password}&sender=${sender}&message=${message}&mobile=${recipients}`);
      recipients.forEach(recipient => {
        sdk.auth(process.env.SMSLIVE247_APIKEY);
        sdk.sendSmsMessage(`{"senderID":"ANSHIA","messageText":"${message}","mobileNumber":"${recipient}"}`, { accept: 'application/json' })
          .then(({ data }) => console.log(data))
          .catch(err => console.error(util.inspect(err, true, null, true)));
        console.log('Sms Sent');
      });
    } catch (error) {
      console.log(error.message);
      debug(error);
    }
    // });
  }
}

module.exports = new SmsService();
