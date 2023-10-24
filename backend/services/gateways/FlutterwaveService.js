const axios = require('axios').default;
const logger = require('../../lib/logger');
const db = require('../../lib/knexConnection');
const { paymentStatuses } = require('../../constants/adoptionRequests');

const { FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_REDIRECT_HOST } = process.env;
const {
  ADOPTION_REQUESTS, ADOPTION_RATES, WALLET, VW_USERBALANCE,
} = require('../../config/dbConfig').tableNames;

class PaymentService {
  async getPaymentLink ({
    amount, metadata, user, transactionId,
  }) {
    const requestObj = {
      tx_ref: transactionId,
      amount,
      currency: 'NGN',
      redirect_url: `${FLUTTERWAVE_REDIRECT_HOST || ''
        }/adoption-payment-status`,
      payment_options: 'card',
      meta: metadata,
      customer: user,
      customizations: {
        title: 'Pied Piper Payments',
        description: "Middleout isn't free. Pay the price",
        logo: 'https://assets.piedpiper.com/logo.png',
      },
    };

    try {
      const { data } = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        requestObj,
        {
          headers: {
            Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          },
        },
      );

      if (data.status == 'success') {
        return { success: true, link: data.data.link };
      }
      return { success: false };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async verifyPayment (adoptionRequestId, transactionId, transactionReference) {
    const url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      });

      logger.info(data);

      const { status, data: responseData } = data;
      const response = {
        success: false,
      };

      let updatedPaymentStatus = paymentStatuses.failed;
      if (status === 'success') {
        const {
          amount,
          tx_ref,
          status: paymentStatus,
          charged_amount,
          meta,
        } = responseData;
        if (
          paymentStatus === 'successful' &&
          // amount === charged_amount &&
          parseFloat(amount) === parseFloat(meta.totalAmount) &&
          tx_ref === transactionReference
        ) {
          response.success = true;
          updatedPaymentStatus = paymentStatuses.success;
        } else {
          console.log('paymentStatus:', paymentStatus, 'amount:', amount, 'charged_amount:', charged_amount, 'meta.totalAmount:', meta.totalAmount,
            'tx_ref:', tx_ref, 'transactionReference:', transactionReference);
          response.message =
            'Discrepancies found in this transaction. Please contact support to rectify this.';
        }
      } else {
        response.message =
          "We couldn't verify this transaction. Please try again later.";
      }

      const [adoptionRequest] = (await updatePaymentStatus(adoptionRequestId, updatedPaymentStatus) || []);
      response.adoptionRequestInfo = adoptionRequest;

      return response;
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }
  }
}

const updatePaymentStatus = async (adoptionRequestId, paymentStatus) => {
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

module.exports = new PaymentService();
