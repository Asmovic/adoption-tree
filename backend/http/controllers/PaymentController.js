const db = require('../../lib/knexConnection');
// const flutterwaveService = require('../../services/gateways/FlutterwaveService');
const paystackService = require('../../services/gateways/PaystackService');
const voucherService = require('../../services/gateways/VoucherService');
const paymentService = require('./../../services/PaymentService');
const {
  PAYMENTS, ADOPTION_REQUESTS, ADOPTION_RATES, WALLET, VW_USERBALANCE,
} = require('../../config/dbConfig').tableNames;
const { validateSavePayment } = require('../../schemas/payments/savePaymentSchema');
const { validateVoucherPayment } = require('../../schemas/payments/voucherPaymentSchema');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { downloadData } = require('../../http/helpers/dataExport');



exports.index = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      status,
      gateway,
      channel,
      startDate,
      endDate,
      download,
    } = req.query;

    const { data, pagination } = await db(PAYMENTS)
      .modify(function (queryBuilder) {
        if (status) {
          queryBuilder.where({ status });
        }
        if (gateway) {
          queryBuilder.where({ gateway });
        }
        if (channel) {
          queryBuilder.where({ channel });
        }
      })
      .dateFilter('paymentDate', startDate, endDate)
      .orderBy('createdAt', 'desc')
      .paginate({ perPage, currentPage: page });

    if (download === 'true') {
      const fields = getExportFields();
      return downloadData(res, 'adoptions.csv', fields, data);
    }

    return res.json({ data, pagination });
  } catch (error) {
    next(error);
  }
};

exports.validatePayment = async (req, res, next) => {
  // TODO: Validate request body
  // eslint-disable-next-line camelcase
  const { transaction_id, tx_ref, reference } = req.body;
  console.log(req.body);
  const request = await db.select({
    id: 'ar.id',
    amount: 'p.amount',
  })
    .from({ ar: ADOPTION_REQUESTS })
    .join({ p: PAYMENTS }, 'ar.paymentId', '=', 'p.id')
    .where('p.reference', '=', reference)
    // .where('p.reference', '=', tx_ref)
    .first();
  console.log('Request =====>: ', request);
  try {
    const { success, message, adoptionRequestInfo } = await paystackService.verifyPayment(
      request.id,
      request.amount,
      transaction_id,
      reference,
      // tx_ref,
    );

    return res.json({
      data: adoptionRequestInfo,
      success,
      message: message || 'Payment successful.',
    });
  } catch (error) {
    next(error);
  }
};

exports.savePayment = async (req, res, next) => {
  try {
    const validation = await validateSavePayment(req.body);
    if (!validation.isValid) {
      throw new ErrorHandler(400, validation.errors);
    };
    const { requestId, ...payload } = req.body;
    payload.status = 'success';

    const request = await db(ADOPTION_REQUESTS)
      .where({ id: requestId })
      .first();

    if (!request) {
      throw new ErrorHandler(400, [{ message: 'Adoption request not available' }]);
    }

    const payment = await db(PAYMENTS)
      .where({ reference: payload.reference })
      .first();

    if (payment) {
      throw new ErrorHandler(400, [{ message: 'Payment with reference already exists' }]);
    }

    // get rates
    const rates = await db(ADOPTION_RATES).where({ id: request.planId }).first();
    if (!rates) throw new ErrorHandler(400, [{ message: 'Invalid Plan' }]);

    const isWalletPayment = (rates.onetimeAmount !== request.totalAmount && request.category === 'self');
    await db.transaction(async trx => {
      const [savedPayment] = await trx(PAYMENTS).insert(payload).returning('*');
      if (!isWalletPayment) {
        await trx(ADOPTION_REQUESTS)
          .where({ id: requestId })
          .update({ paymentId: savedPayment.id, paymentProcessed: payload.status });
      } else {
        // save to wallet
        const walletEntry = { userId: request.userId, planId: request.planId, amount: request.totalAmount, paymentId: savedPayment.id };
        await trx(WALLET).insert(walletEntry);

        // get current balance for plan
        const balance = await trx(VW_USERBALANCE).where({ planId: request.planId, userId: request.userId }).first();

        if (Number(balance.amount) >= Number(rates.onetimeAmount)) {
          // fully paid so can process
          await trx(ADOPTION_REQUESTS)
            .where({ id: requestId })
            .update({ paymentId: savedPayment.id, paymentProcessed: payload.status, amountcharged: rates.onetimeAmount, durationType: 'onetime' });
          // debit the wallet
          const debitwalletEntry = { userId: request.userId, planId: request.planId, amount: rates.onetimeAmount * -1 };
          await trx(WALLET).insert(debitwalletEntry);
        }
      }
    });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.voucherPayment = async (req, res, next) => {
  try {
    const validation = await validateVoucherPayment(req.body);
    if (!validation.isValid) {
      throw new ErrorHandler(400, validation.errors);
    };

    const {
      voucherNumber, phone, description, amount, adoptionRequestId,
    } = req.body;

    const response = await voucherService.makePayment(voucherNumber, phone, description, amount);

    if (response.success) {
      await paymentService.updatePaymentByRequestId(adoptionRequestId, { paymentProcessed: 'success' });
    }

    console.log('Response:', response);

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getExportFields = () => {
  return [
    { label: 'Date', value: 'paymentDate' },
    { label: 'Reference', value: 'reference' },
    { label: 'Amount', value: 'amount' },
    { label: 'Status', value: 'status' },
    { label: 'Gateway', value: 'gateway' },
    { label: 'Channel', value: 'channel' },
    { label: 'Description', value: 'description' },
  ];
};
