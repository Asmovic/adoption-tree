const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');

const schema = Joi.object({
  searchParam: Joi.string().required().valid(...['phone', 'biometricId']),
  searchValue: Joi.string().required(),
});

exports.validateSearchPatient = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: false,
    };
    await schema.validateAsync(request, options);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, errors: joiValidation(error) };
  }
};
