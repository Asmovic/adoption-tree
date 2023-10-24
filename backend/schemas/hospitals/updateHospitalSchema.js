const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');
const { HOSPITALS } = require('../../config/dbConfig').tableNames;

const schema = Joi.object({
  name: Joi.string().optional().max(255),
  erpId: Joi.number().optional().allow(null),
  isActive: Joi.boolean().optional(),
  lgaId: Joi.number().optional().when('name', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
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
    console.error('---', error);
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
  // Terminate early
  await Promise.all([
    checkForUnique(body, existing),
  ]);
};

const checkForUnique = async ({name, lgaId }, existing) => {
  const exists = await knex(HOSPITALS)
    .where({ name, lgaId }).first()
    .andWhere('id', '!=', existing.id);

  if (exists) {
    const error = {
      type: 'validation',
      statusCode: 422,
      errors: [{ key: 'name', message: `${name} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
