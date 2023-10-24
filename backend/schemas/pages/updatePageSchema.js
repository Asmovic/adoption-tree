const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { VISION_BOARD_STATS } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  title: Joi.string().optional().max(255),
  value: Joi.string().optional().max(255),
  icon: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  updateWithEndpoint: Joi.boolean().optional(),
  endpoint: Joi.string().optional().allow(null).default('').max(255),
});

exports.validateUpdate = async (existing, request) => {
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
  const { title } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('title', title, existing),
  ]);
};

const checkForUnique = async (key, value, existing) => {
  const exists = await knex(VISION_BOARD_STATS)
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
