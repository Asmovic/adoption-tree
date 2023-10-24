const Joi = require("joi");
const roles = require("../../constants/roles");

module.exports = Joi.object({
  username: Joi.string().min(2).max(50),
  phone: Joi.string().min(6).pattern(new RegExp("^[0-9]{6,15}$")),
  password: Joi.string().max(50).required(),
})
  .xor("username", "phone")
  .options({ abortEarly: false, allowUnknown: true });
