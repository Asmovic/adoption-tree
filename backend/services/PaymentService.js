
const db = require('../lib/knexConnection');
const logger = require('../lib/logger');
const {
  PAYMENTS, ADOPTION_REQUESTS, ADOPTION_RATES, WALLET, VW_USERBALANCE,
} = require('../config/dbConfig').tableNames;

exports.savePayment = async (userId, reference, amount, status, gateway, channel, description, paymentDate) => {
  try {
    const [payment] = await db(PAYMENTS)
      .insert({
        userId, reference, amount, status, gateway, channel, description, paymentDate,
      })
      .returning('*');

    return { payment, error: null };
  } catch (error) {
    logger.error(error);
    return { payment: null, error };
  }
};

exports.updatePaymentByRequestId = async (adoptionRequestId, data) => {
  const request = await db.select().from(ADOPTION_REQUESTS).where({ id: adoptionRequestId }).first();
  const {
    paymentId, userId, planId, totalAmount,
  } = request;

  const now = db.fn.now();

  const rates = await db(ADOPTION_RATES).where({ id: request.planId }).first();
  const isWalletPayment = (rates.onetimeAmount !== request.totalAmount && request.category === 'self');

  await db.transaction(async (trx) => {
    if (data.paymentProcessed !== 'success' || !isWalletPayment) {
      await trx(PAYMENTS)
        .update({ updatedAt: now, paymentDate: now, status: data.paymentProcessed })
        .where({ id: paymentId })
        .transacting(trx);

      await trx
        .table(ADOPTION_REQUESTS)
        .update(data)
        .where({ id: adoptionRequestId })
        .transacting(trx);
    } else {
      // only successfull wallet payments
      await trx(PAYMENTS)
        .update({ updatedAt: now, paymentDate: now, status: data.paymentProcessed })
        .where({ id: paymentId })
        .transacting(trx);

      const walletEntry = { userId, planId, amount: totalAmount, paymentId };
      await trx(WALLET).insert(walletEntry);

      // get current balance for plan
      const balance = await trx(VW_USERBALANCE).where({ planId: request.planId, userId: request.userId }).first();

      if (Number(balance.amount) >= Number(rates.onetimeAmount)) {
        // fully paid so can process
        await trx(ADOPTION_REQUESTS)
          .where({ id: adoptionRequestId })
          .update({ paymentId: paymentId, paymentProcessed: 'success', amountcharged: rates.onetimeAmount, durationType: 'onetime' });
        // debit the wallet
        const debitwalletEntry = { userId, planId, amount: rates.onetimeAmount * -1 };
        await trx(WALLET).insert(debitwalletEntry);
      }
    }
  });

  return Object.assign(request, { status: data.paymentProcessed });
};
