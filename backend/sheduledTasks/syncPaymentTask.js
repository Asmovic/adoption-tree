const moment = require('moment');
const axios = require('axios');
const { getUnsynchronizedPayments, updatePaymentStatus } = require('../repositories/EnrolleeRepository');

exports.run = async () => {
  try {
    const { PAYMENT_SYNCH_URL: url, ENROLLEE_SYNCH_TOKEN: secretKey } = process.env;

    if (!url || !secretKey) {
      console.log('Enrollee sync parameters not available');
      return;
    }

    const payments = await getUnsynchronizedPayments();
    const promises = [];

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      console.log('Payment(s): ', payment);
      promises.push(syncPayment(url, secretKey, payment));
    }

    await Promise.all(promises);
    console.log('Payment Syncing completed');
  } catch (error) {
    console.error(error);
  }
};

const syncPayment = async (url, secretKey, payment) => {
  const payload = getPayload(payment, secretKey);
  var config = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  };

  try {
    const { data } = await axios(config);
    if (data.status === 'Success') await updatePaymentStatus(payment.paymentId);

    // newEnrolleeNotification.toSms(enrollee.phone, data.staff_id);
  } catch (error) {
    console.error('PAYMENT_SYNC_ERROR', error.message);
  }
};

const getPayload = (payment, secretKey) => {
  const paymentDate = payment.paymentDate ? moment(payment.paymentDate) : moment();
  return {
    staff_id: payment.enrolleeId === null ? payment.donorId : payment.enrolleeId,
    subscription_days: getDays(payment.durationType),
    amount: payment.amount,
    date_of_payment: paymentDate,
    no_of_beneficiaries: payment.noOfAdoptees,
    plan: getPlans(payment.type),
    secret_key: secretKey,
  };
};

const getDays = (durationType) => {
  switch (durationType) {
    case 'daily':
      return '1';
    case 'weekly':
      return '7';
    case 'monthly':
      return '30';
    case 'onetime':
      return '360';
  }
};

const getPlans = (category) => {
  return category === 'self' ? 2 : 5;
};
