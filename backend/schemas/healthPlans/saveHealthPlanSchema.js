const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { ADOPTION_RATES } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  type: Joi.string().required().max(100),
  onetimeAmount: Joi.number().required(),
  weeklyAmount: Joi.number().required(),
  monthlyAmount: Joi.number().required(),
});

exports.validateSaveHealthPlanDetails = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
    };
    await schema.validateAsync(request, options);

    // Extra validations
    await saveDetailsValidation(request);

    return { isValid: true };
  } catch (error) {
    if (error.statusCode === 422) {
      return { isValid: false, errors: error.errors };
    }

    return { isValid: false, errors: joiValidation(error) };
  }
};

const saveDetailsValidation = async (body) => {
  const { type } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('type', type),
  ]);
};

const checkForUnique = async (key, value) => {
  const exists = await knex(ADOPTION_RATES).where(key, value).first();

  if (exists) {
    const error = {
      type: 'validation',
      errors: [{ key, message: `${key} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
