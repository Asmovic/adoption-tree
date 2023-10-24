const Joi = require('joi');
const joiValidation = require('../../lib/helpers/joiValidation');
const genders = require('../../constants/genders');
const { saveDetailsValidation } = require('../../http/helpers/validations/doctorValidations');

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
  idNumber: Joi.string().required(),
  departmentId: Joi.number().required(),
});

exports.validateSaveDoctorDetails = async (request) => {
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
