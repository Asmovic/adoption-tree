const db = require('../../lib/knexConnection');
const { ADOPTION_RATES } = require('../../config/dbConfig').tableNames;
const _ = require('lodash');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const moment = require('moment');
const { validateSaveHealthPlanDetails } = require('../../schemas/healthPlans/saveHealthPlanSchema');
const { validateUpdateHealhPlanDetails } = require('../../schemas/healthPlans/updateHealthPlanSchema');

// Get health plans
exports.index = async (req, res, next) => {
  try {
    const plans = await db(ADOPTION_RATES)
      .select();

    return res.json({ data: plans });
  } catch (error) {
    next(error);
  }
};

// Save new health plan
exports.store = async (req, res, next) => {
  try {
    var planBody = _.pick(req.body, ['type', 'onetimeAmount', 'weeklyAmount', 'monthlyAmount']);

    const { isValid, errors } = await validateSaveHealthPlanDetails(planBody);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    const [plan] = await db(ADOPTION_RATES).insert(planBody, '*');

    return res.json({ data: plan });
  } catch (error) {
    next(error);
  }
};

// Update existing health plan
exports.update = async (req, res, next) => {
  try {
    const { params, body } = req;

    var existingPlan = await db(ADOPTION_RATES)
      .where({ id: params.id })
      .first();

    if (!existingPlan) {
      throw new ErrorHandler(404, [{ message: 'Plan specified does not exist' }]);
    }

    var planBody = _.pick(body, ['type', 'onetimeAmount', 'weeklyAmount', 'monthlyAmount', 'isActive']);

    const { isValid, errors } = await validateUpdateHealhPlanDetails(existingPlan, planBody);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    planBody.updatedAt = moment().format('YYYY-MM-DD hh:mm:ss');

    const [plan] = await db(ADOPTION_RATES)
      .where({ id: params.id })
      .update(planBody, '*');

    return res.json({ data: plan });
  } catch (error) {
    next(error);
  }
};
