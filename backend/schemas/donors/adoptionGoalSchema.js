const Joi = require("joi");;
const joiValidation = require('../../lib/helpers/joiValidation');

const schema = Joi.object({
    count: Joi.number().optional(),
    amount: Joi.number().optional(),
});

exports.validateAdoptionGoalRequest = async (request) => {
    try {
        const options = {
            abortEarly: false,
            allowUnknown: false
        };
        await schema.validateAsync(request, options);
        return { isValid: true };
    } catch (error) {
        return { isValid: false, errors: joiValidation(error) };
    }
}
