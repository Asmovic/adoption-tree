const Joi = require("joi");

module.exports = Joi.object({
  activationCode: Joi.string().min(2).required(),
  continuationToken: Joi.string().min(2).required(),
}).options({ abortEarly: false, allowUnknown: true });
