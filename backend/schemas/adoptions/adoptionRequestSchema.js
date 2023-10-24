const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const {
  categories,
  types,
  durationTypes,
  paymentStatuses,
  paymentChannels,
} = require('../../constants/adoptionRequests');

const _types = Object.keys(types).map((x) => types[x]);

const schema = Joi.object({
  category: Joi.string()
    .optional()
    .valid(...Object.keys(categories)),
  entryId: Joi.number(),
  type: Joi.string()
    .optional()
    .valid(..._types),
  lgaId: Joi.number().when('type', {
    is: types.random,
    then: Joi.required(),
  }),
  noOfAdoptees: Joi.number().when('type', {
    is: types.random,
    then: Joi.required(),
  }),
  startDate: Joi.date().optional(),
  totalAmount: Joi.number().precision(2).required(),
  durationType: Joi.string()
    .required()
    .valid(...Object.keys(durationTypes)),
  duration: Joi.number().precision(0).required(),
  paymentType: Joi.string()
    .required()
    .valid(...Object.keys(paymentChannels)),
  planId: Joi.required(),
}).options({ abortEarly: false, allowUnknown: true });

exports.validateAdoptionRequest = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
    };

    // TODO: Rework this workaround
    request.paymentProcessed =
      request.paymentProcessed || paymentStatuses.pending;
    const body = await schema.validateAsync(request, options);
    return { isValid: true, body };
  } catch (error) {
    return { isValid: false, errors: joiValidation(error) };
  }
};
