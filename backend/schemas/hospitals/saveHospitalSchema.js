const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { HOSPITALS } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  lgaId: Joi.number().required(),
  name: Joi.string().required().max(255),
  erpId: Joi.number().optional(),
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
  const { name, lgaId } = body;

  // Terminate early
  await Promise.all([
    checkForUnique(name, lgaId),
  ]);
};

const checkForUnique = async (name, lgaId) => {
  const exists = await knex(HOSPITALS)
    .where({ name, lgaId })
    .first();

  if (exists) {
    const error = {
      type: 'validation',
      errors: [{ name, message: `${name} already belongs to LGA` }],
    };

    throw new ErrorHandler(422, error);
  }
};
