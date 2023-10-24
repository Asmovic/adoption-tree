const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');

const createSchema = Joi.object({
  title: Joi.string().required().max(255),
  slug: Joi.string().optional().max(500),
  content: Joi.string().required(),
  styles: Joi.string().optional().allow(''),
});

const updateSchema = Joi.object({
  title: Joi.string().required().max(255),
  slug: Joi.string().optional().max(500),
  content: Joi.string().required(),
  styles: Joi.string().optional().allow(''),
});

exports.validateCreate = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const body = await createSchema.validateAsync(request, options);

    return { isValid: true, body };
  } catch (error) {
    console.log(joiValidation(error));
    if (error.statusCode === 422) {
      return { isValid: false, errors: error.errors };
    }

    return { isValid: false, errors: joiValidation(error) };
  }
};

exports.validateUpdate = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const body = await updateSchema.validateAsync(request, options);

    return { isValid: true, body };
  } catch (error) {
    console.log(error);
    console.log(joiValidation(error));
    if (error.statusCode === 422) {
      return { isValid: false, errors: error.errors };
    }

    return { isValid: false, errors: joiValidation(error) };
  }
};
