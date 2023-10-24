const db = require('../../lib/knexConnection');
const { setPaginateOptions } = db;
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { ADOPTEE_INFO_REQUESTS, USERS } = require('../../config/dbConfig').tableNames;
const { validateChangeStatus } = require('../../schemas/adopteeInfo/changeStatusSchema');

exports.getRequests = async (req, res, next) => {
  try {
    const requests =
      await db.select({
        r: 'r.*',
        user: db.raw('CONCAT(u."firstName", \' \', u."lastName")'),
      })
        .from({ r: ADOPTEE_INFO_REQUESTS })
        .join({ u: USERS }, 'r.userId', '=', 'u.id')
        .orderBy('r.createdAt', 'desc')
        .paginate(setPaginateOptions(req.query));

    return res.json({ data: requests });
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { body, params } = req;

    const validation = await validateChangeStatus(body);
    if (!validation.isValid) throw new ErrorHandler(400, validation.errors);

    const request = await db(ADOPTEE_INFO_REQUESTS).where({ id: params.id }).first();

    if (!request) {
      throw new ErrorHandler(404, [{ message: 'Adoptee info request not found' }]);
    }

    const updatedRequest = await db(ADOPTEE_INFO_REQUESTS)
      .where({ id: params.id })
      .update({ status: body.status }, '*');

    return res.json({ data: updatedRequest });
  } catch (error) {
    next(error);
  }
};
