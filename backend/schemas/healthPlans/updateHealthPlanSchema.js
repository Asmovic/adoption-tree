const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { ADOPTION_RATES } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  type: Joi.string().required().max(100),
  onetimeAmount: Joi.number().optional(),
  weeklyAmount: Joi.number().optional(),
  monthlyAmount: Joi.number().optional(),
  isActive: Joi.boolean().optional()
});

exports.validateUpdateHealhPlanDetails = async (existing, request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    const value = await schema.validateAsync(request, options);

    // Extra validations
    await updateDetailsValidation(existing, request);

    return {
      isValid: true,
      value,
    };
  } catch (error) {
    if (error.statusCode === 422) {
      return { isValid: false, errors: error.errors };
    }

    return {
      isValid: false,
      errors: joiValidation(error),
    };
  }
};

const updateDetailsValidation = async (existing, body) => {
  const { type } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('type', type, existing),
  ]);
};

const checkForUnique = async (key, value, existing) => {
  const exists = await knex(ADOPTION_RATES)
    .where(key, value).first()
    .andWhere('id', '!=', existing.id);

  if (exists) {
    const error = {
      type: 'validation',
      statusCode: 422,
      errors: [{ key, message: `${key} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
