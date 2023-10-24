const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { VISION_BOARD_STATS } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  title: Joi.string().required().max(255),
  value: Joi.string().required().max(255),
  icon: Joi.string().optional(),
  updateWithEndpoint: Joi.boolean().default(false),
  endpoint: Joi.string().optional().allow(null).default('').max(255),
});

exports.validateCreate = async (request) => {
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
  const { title } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('title', title),
  ]);
};

const checkForUnique = async (key, value) => {
  const exists = await knex(VISION_BOARD_STATS).where(key, value).first();

  if (exists) {
    const error = {
      type: 'validation',
      errors: [{ key, message: `${key} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
