const db = require('../../lib/knexConnection');
const { PAYMENTS, ADOPTION_REQUESTS, USERS } = require('../../config/dbConfig').tableNames;
const { validateSavePayment } = require('../../schemas/payments/savePaymentSchema');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { downloadData } = require('../helpers/dataExport');

exports.index = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      durationType,
      startDate,
      endDate,
      download,
    } = req.query;

    const { data, pagination } =
      await db.select({
        durationType: 'ar.durationType',
        duration: 'ar.duration',
        startDate: 'ar.startDate',
        amount: 'p.amount',
        description: 'p.description',
        user: db.raw('CONCAT(u."firstName", \' \', u."lastName")'),
      })
        .from({ ar: ADOPTION_REQUESTS })
        .innerJoin({ u: USERS }, 'ar.userId', '=', 'u.id')
        .innerJoin({ p: PAYMENTS }, 'ar.paymentId', '=', 'p.id')
        .modify(function (queryBuilder) {
          if (durationType) {
            queryBuilder.where('ar.durationType', '=', durationType);
          }
        })
        .dateFilter('ar.createdAt', startDate, endDate)
        .orderBy('ar.createdAt', 'desc')
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

const getExportFields = () => {
  return [
    { label: 'DurationType', value: 'durationType' },
    { label: 'Duration', value: 'duration' },
    { label: 'StartDate', value: 'startDate' },
    { label: 'Description', value: 'description' },
    { label: 'Amount', value: 'amount' },
    { label: 'User', value: 'user' },
  ];
};
