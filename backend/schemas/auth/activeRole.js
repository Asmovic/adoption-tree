const Joi = require("joi");
const roles = require("./../../constants/roles");

module.exports = Joi.object({
  activeRole: Joi.string()
    .required()
    .valid(...Object.keys(roles)),
}).options({ abortEarly: false });
