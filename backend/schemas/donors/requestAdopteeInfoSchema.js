const Joi = require("joi");;
const joiValidation = require('../../lib/helpers/joiValidation');

const schema = Joi.object({
    reason: Joi.string().min(5).required(),
});

exports.validateAdopteeInfoRequest = async (request) => {
    try {
        const options = {
            abortEarly: false,
            allowUnknown: true
        };
        await schema.validateAsync(request, options);
        return { isValid: true };
    } catch (error) {
        return { isValid: false, errors: joiValidation(error) };
    }
}

