const axios = require('axios').default;
const debug = require('debug')('API:smsService');
const {
  apiUrl, username, password, defaultSender,
} = require('../config/smsConfig');

const { formatPhoneNumber } = require('./../lib/utils');

class SmsService {
  sendActivationMessage (phone, code) {
    const message = `Your ${process.env.APP_NAME} confirmation code is ${code}. Valid for 30 minutes, one-time use only.`;
    this.sendSms(message, [phone]);
  }

  sendResetMessage (phone, token) {
    const message = `Your ${process.env.APP_NAME} confirmation code is ${token}. It expires in 30 minutes.`;
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

    recipients = recipients.map((x) => {
      return formatPhoneNumber(x);
    }).join(',');

    try {
      // TODO: Use message queue
      await axios
        .get(`${apiUrl}?username=${username}&password=${password}&sender=${sender}&message=${message}&mobile=${recipients}`);
    } catch (error) {
      debug(error);
    }
  }
}

module.exports = new SmsService();
