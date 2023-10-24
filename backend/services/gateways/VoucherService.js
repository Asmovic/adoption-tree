const axios = require('axios');
const logger = require('../../lib/logger');

const {
  VOUCHER_URL, VOUCHER_CLIENT_ID, VOUCHER_TOKEN_URL,
  VOUCHER_TOKEN_USERNAME, VOUCHER_TOKEN_PASSWORD,
} = process.env;

class VoucherService {
  static charge = 50;
  async getToken () {
    const url = `${VOUCHER_TOKEN_URL}`;
    const payload = {
      identifier: VOUCHER_TOKEN_USERNAME,
      password: VOUCHER_TOKEN_PASSWORD,
    };
    const { data } = await axios.post(url, payload);
    return data.jwt;
  }

  async makePayment (voucherNumber, phone, description, amount) {
    try {
      const url = `${VOUCHER_URL}/debit/${voucherNumber}`;
      const token = await this.getToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      console.log('got here and used token: ', token, 'URL: ', VOUCHER_URL);

      const payload = {
        client_id: VOUCHER_CLIENT_ID,
        recipient_msisdn: phone,
        transaction_desc: description,
        amount: parseFloat(amount) - VoucherService.charge,
      };
      console.log('Voucher: ', payload);
      const { data } = await axios.put(url, payload, config);

      return { success: true, data };
    } catch (error) {
      logger.error(error);
      const data = error.response ? error.response.data : { message: 'An unexcpected error occured' };
      if (error.response.status === 404) {
        data.message = 'This voucher does not exist.';
      };

      return { success: false, data };
    }
  }


};

module.exports = new VoucherService();
