const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const genders = require('../../constants/genders');

const schema = Joi.object({
  firstName: Joi.string().optional().max(255),
  lastName: Joi.string().optional().max(255),
  middleName: Joi.string().optional().max(255),
  email: Joi.string().optional().max(255),
  username: Joi.string().optional().max(255),
  active: Joi.boolean().optional(),
  phone: Joi.string()
    .min(6)
    .optional()
    .pattern(new RegExp(/^\+?([0-9]{6,15})$/)),
  gender: Joi.string()
    .min(2)
    .optional()
    .max(50)
    .valid(...Object.keys(genders).map((key) => genders[key])),
  idNumber: Joi.string().optional(),
  departmentId: Joi.number().optional(),
});

exports.validateUpdateDoctorDetails = async (request) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    const value = await schema.validateAsync(request, options);

    return {
      isValid: true,
      value,
    };
  } catch (error) {
    console.log(error);
    if (error.statusCode === 400) {
      return {
        isValid: false,
        errors: error.errors,
      };
    }

    return {
      isValid: false,
      errors: joiValidation(error),
    };
  }
};
