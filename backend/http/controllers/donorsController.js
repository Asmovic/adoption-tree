const db = require('../../lib/knexConnection');
const { setPaginateOptions } = db;
const { validateAdoptionGoalRequest } = require('../../schemas/donors/adoptionGoalSchema');
const { validateAdopteeInfoRequest } = require('../../schemas/donors/requestAdopteeInfoSchema');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { downloadData } = require('../helpers/dataExport');
const { ADOPTEE_INFO_REQUESTS, DONORS, USERS } = require('../../config/dbConfig').tableNames;

exports.index = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      stateId,
      lgaId,
      startDate,
      endDate,
      download = 'false',
    } = req.query;

    const { data, pagination } = await db(DONORS)
      .join(USERS, `${USERS}.id`, '=', `${DONORS}.userId`)
      .modify(function (queryBuilder) {
        if (stateId) {
          queryBuilder.where(`${DONORS}.residentStateId`, '=', stateId);
        }
        if (lgaId) {
          queryBuilder.where(`${DONORS}.residentLgaId`, '=', lgaId);
        }
      })
      .dateFilter(`${DONORS}.createdAt`, startDate, endDate)
      .orderBy(`${DONORS}.createdAt`, 'desc')
      .paginate({ perPage, currentPage: page });

    if (download === 'true') {
      const fields = getExportFields();
      return downloadData(res, 'donors.csv', fields, data);
    }

    return res.json({ data, pagination });
  } catch (error) {
    next(error);
  }
};

exports.requestAdopteeInfo = async (req, res, next) => {
  try {
    const validation = await validateAdopteeInfoRequest(req.body);
    if (!validation.isValid) { throw new ErrorHandler(400, validation.errors); }

    const { reason } = req.body;

    const request = await db(ADOPTEE_INFO_REQUESTS)
      .insert({ userId: req.user.id, reason })
      .returning('*');
    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

exports.myAdopteeInfoRequests = async (req, res, next) => {
  try {
    const { user, query } = req;

    const adoptions = await db(ADOPTEE_INFO_REQUESTS)
      .where('userId', '=', user.id)
      .orderBy('createdAt', 'desc')
      .paginate(setPaginateOptions(query));

    adoptions.pagination.currentPage = parseInt(adoptions.pagination.currentPage);

    return res.json({ success: true, data: adoptions });
  } catch (error) {
    next(error);
  }
};

exports.updateAdoptionGoal = async (req, res, next) => {
  try {
    const validation = await validateAdoptionGoalRequest(req.body);
    if (!validation.isValid) { throw new ErrorHandler(400, validation.errors); }

    const { count, amount } = req.body;

    await db(DONORS)
      .where({ userId: req.user.id })
      .update({ adoptionGoalAmount: amount, adoptionGoalCount: count });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getExportFields = () => {
  return [
    { label: 'Active', value: 'active' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Phone', value: 'phone' },
    { label: 'Email', value: 'email' },
    { label: 'Gender', value: 'gender' },
    { label: 'Resident Address', value: 'residentAddress' },
  ];
};
