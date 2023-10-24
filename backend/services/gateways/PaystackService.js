const axios = require('axios');
const logger = require('../../lib/logger');
const db = require('../../lib/knexConnection');
const { paymentStatuses } = require('../../constants/adoptionRequests');
const { PAYSTACK_SECRET_KEY, PAYSTACK_CALLBACK_URL } = process.env;
const {
  ADOPTION_REQUESTS, ADOPTION_RATES, WALLET, VW_USERBALANCE,
} = require('../../config/dbConfig').tableNames;
class PaystackService {
  async getPaymentLink ({
    amount, metadata, user, transactionId,
  }) {
    let email = user.email;
    if (!user.email) {
      email = `${user.phonenumber}@anshia.com.ng`;
    }
    const payload = { amount: Number(amount * 100), reference: transactionId, email, callback_url: PAYSTACK_CALLBACK_URL };
    // console.log({ metadata, user, transactionId });
    const { data } = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );
    console.log('Data: ', { data });
    if (data.status === true) {
      return { success: true, link: data.data.authorization_url, data };
    }
    return { success: false };
  }

  async verifyPayment (adoptionRequestId, initializedAmount, transactionId, transactionReference) {
    const url = `https://api.paystack.co/transaction/verify/${transactionReference}`;
    console.log(transactionReference);
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });
      console.log('verification data ====>:', data);
      //   logger.info(data);

      const { data: responseData } = data;
      const response = {
        success: false,
      };
      console.log('response===data: ', responseData);
      let updatedPaymentStatus = paymentStatuses.failed;
      const { amount,
        reference,
        status } = responseData;
      const convertedAmount = Number(amount / 100);
      if (status === 'success') {
        if (
          Number(amount / 100) === Number(initializedAmount) &&
          //   parseFloat(amount) === parseFloat(meta.totalAmount) &&
          reference === transactionReference
        ) {
          response.success = true;
          response.reference = responseData.reference;
          updatedPaymentStatus = paymentStatuses.success;
        } else {
          console.log(`paymentStatus: ${status}, amount: ${amount}, reference: ${reference}, transactionReference: ${transactionReference}`);
          response.message =
            'Discrepancies found in this transaction. Please contact support to rectify this.';
        }
      } else {
        response.message =
          "We couldn't verify this transaction. Please try again later.";
      }

      const [adoptionRequest] = (await this.updatePaymentStatus(adoptionRequestId, updatedPaymentStatus) || []);
      response.description = `Payment Type: ${adoptionRequest.type}`;
      responseData.amount = convertedAmount;
      response.adoptionRequestInfo = { adoptionRequest, ...responseData };
      console.log('Updated Statue: ', response);
      return response;
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }
  }

  async updatePaymentStatus (adoptionRequestId, paymentStatus) {
    const request = await db.select().from(ADOPTION_REQUESTS).where({ id: adoptionRequestId }).first();
    const rates = await db(ADOPTION_RATES).where({ id: request.planId }).first();
    const isWalletPayment = (rates.onetimeAmount !== request.totalAmount && request.category === 'self');
    const {
      paymentId, userId, planId, totalAmount,
    } = request;

    await db('payments')
      .where({ id: paymentId })
      .update({ status: paymentStatus });

    if (paymentStatus !== 'success' || !isWalletPayment) {
      return await db
        .table('adoption_requests')
        .update({ paymentProcessed: paymentStatus })
        .where({ id: adoptionRequestId })
        .returning('*');
    } else {
      const walletEntry = { userId, planId, amount: totalAmount, paymentId };
      await db.transaction(async (trx) => {
        await trx(WALLET).insert(walletEntry);
        // get current balance for plan
        const balance = await trx(VW_USERBALANCE).where({ planId, userId }).first();

        if (Number(balance.amount) >= Number(rates.onetimeAmount)) {
          // fully paid so can process
          await trx(ADOPTION_REQUESTS)
            .where({ id: adoptionRequestId })
            .update({ paymentId, paymentProcessed: 'success', amountcharged: rates.onetimeAmount, durationType: 'onetime' });
          // debit the wallet
          const debitwalletEntry = { userId, planId, amount: rates.onetimeAmount * -1 };
          await trx(WALLET).insert(debitwalletEntry);
        }
      });

      return db.select().from(ADOPTION_REQUESTS).where({ id: adoptionRequestId });
    }
  };
}

module.exports = new PaystackService();
