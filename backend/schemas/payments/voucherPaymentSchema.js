const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');

const schema = Joi.object({
  adoptionRequestId: Joi.number().required(),
  phone: Joi.string().required(),
  voucherNumber: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().allow('').optional(),
});

exports.validateVoucherPayment = async (request) => {
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
