const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const knex = require('../../lib/knexConnection');
const genders = require('../../constants/genders');
const { HOSPITAL_ADMIN, ADMIN } = require('../../constants/roles');
const { USERS } = require('../../config/dbConfig').tableNames;
const { ErrorHandler } = require('../../http/helpers/ErrorHandler');

const schema = Joi.object({
  firstName: Joi.string().required().max(255),
  lastName: Joi.string().required().max(255),
  middleName: Joi.string().optional().max(255),
  email: Joi.string().required().max(255),
  phone: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp(/^\+?([0-9]{6,15})$/)),
  gender: Joi.string()
    .min(2)
    .required()
    .max(50)
    .valid(...Object.keys(genders).map((key) => genders[key])),
  role: Joi.string().required().valid(...[ADMIN.name, HOSPITAL_ADMIN.name]),
  hospitalId: Joi.number().optional(),
});

exports.validateCreate = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: false,
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
  const { phone, email } = body;

  // Terminate early
  await Promise.all([
    checkForUnique('email', email),
    checkForUnique('phone', phone),
  ]);
};

const checkForUnique = async (key, value) => {
  const exists = await knex(USERS).where(key, value).first();

  if (exists) {
    const error = {
      type: 'validation',
      errors: [{ key, message: `${key} is already taken` }],
    };

    throw new ErrorHandler(422, error);
  }
};
