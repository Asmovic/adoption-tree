const Joi = require("joi");
const joiValidation = require("../../lib/helpers/joiValidation");

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  nationality: Joi.string().max(255),
  stateId: Joi.number(),
  lgaId: Joi.number(),
  phone: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp(/^\+?([0-9]{6,15})$/)),
  officePhone: Joi.string().allow('').optional(),
  residentAddress: Joi.string(),
  officeAddress: Joi.string().allow('').optional(),
  publicProfile: Joi.boolean(),
});

exports.validateUpdateUserProfile = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
    };
    await schema.validateAsync(request, options);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, errors: joiValidation(error) };
  }
};
