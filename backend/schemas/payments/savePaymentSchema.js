const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');

const schema = Joi.object({
  userId: Joi.number().required(),
  requestId: Joi.number().required(),
  amount: Joi.number().required(),
  gateway: Joi.string().required(),
  channel: Joi.string().required(),
  paymentDate: Joi.date().required(),
  description: Joi.string().required(),
  reference: Joi.string().required(),
});

exports.validateSavePayment = async (request) => {
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
