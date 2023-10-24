const db = require('../../lib/knexConnection');
const { VISION_BOARD_STATS } = require('../../config/dbConfig').tableNames;
const _ = require('lodash');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const moment = require('moment');
const { validateCreate } = require('../../schemas/visionBoard/saveVisionBoardSchema');
const { validateUpdate } = require('../../schemas/visionBoard/updateVisionBoardSchema');

// Get stats
exports.index = async (req, res, next) => {
  const { perPage = 25, page = 1 } = req.query;
  try {
    const stats = await db(VISION_BOARD_STATS)
      .select().paginate({
        perPage: perPage,
        currentPage: page,
      });

    return res.json({ data: stats });
  } catch (error) {
    next(error);
  }
};

// Save new stat
exports.store = async (req, res, next) => {
  try {
    var statBody = _.pick(req.body, [
      'title', 'value', 'icon', 'updateWithEndpoint', 'endpoint',
    ]);

    const { isValid, errors } = await validateCreate(statBody);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    const [stat] = await db(VISION_BOARD_STATS).insert(statBody, '*');

    return res.json({ data: stat });
  } catch (error) {
    next(error);
  }
};

// Update stats plan
exports.update = async (req, res, next) => {
  try {
    const { params, body } = req;

    var existingPlan = await db(VISION_BOARD_STATS)
      .where({ id: params.id })
      .first();

    if (!existingPlan) {
      throw new ErrorHandler(404, [{ message: 'Stat specified does not exist' }]);
    }

    var statBody = _.pick(body, [
      'title', 'value', 'icon', 'isActive', 'updateWithEndpoint', 'endpoint',
    ]);

    const { isValid, errors } = await validateUpdate(existingPlan, statBody);
    console.log(errors);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    statBody.updatedAt = moment().format('YYYY-MM-DD hh:mm:ss');

    const [plan] = await db(VISION_BOARD_STATS)
      .where({ id: params.id })
      .update(statBody, '*');

    return res.json({ data: plan });
  } catch (error) {
    next(error);
  }
};
